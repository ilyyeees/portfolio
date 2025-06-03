import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateOptimizedImageUrl, generateResponsiveSrcSet, OptimizedImageProps } from '@/utils/imageUtils';
import { useDeviceDetection } from '@/hooks/useMobileOptimization';

const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  width,
  height,
  quality = 80,
  loading = 'lazy',
  className = '',
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const deviceInfo = useDeviceDetection();

  // Optimize quality based on device and connection
  const getOptimizedQuality = () => {
    if (deviceInfo.connectionType === 'slow-2g' || deviceInfo.connectionType === '2g') {
      return Math.min(quality, 50);
    }
    if (deviceInfo.connectionType === '3g') {
      return Math.min(quality, 65);
    }
    if (deviceInfo.isMobile) {
      return Math.min(quality, 75);
    }
    return quality;
  };

  const optimizedQuality = getOptimizedQuality();
  const optimizedSrc = generateOptimizedImageUrl(src, width || 800, height, optimizedQuality);
  const srcSet = generateResponsiveSrcSet(src);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-muted to-muted-foreground/10 animate-pulse"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Main image */}      <motion.img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={alt}
        loading={loading}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${
          hasError ? 'hidden' : ''
        }`}
        width={width}
        height={height}
        initial={{ scale: 1.1 }}
        animate={{ scale: isLoaded ? 1 : 1.1 }}
        transition={{ duration: 0.3 }}
        style={{
          willChange: 'transform, opacity',
          ...style,
        }}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
