import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntersectionImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
}

const IntersectionImage: React.FC<IntersectionImageProps> = React.memo(({
  src,
  alt,
  className = '',
  width,
  height,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultPlaceholder = (
    <motion.div
      className={`bg-gradient-to-r from-muted to-muted/50 animate-pulse ${className}`}
      style={{ width, height }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {!isVisible || !isLoaded ? (
          <motion.div key="placeholder">
            {placeholder || defaultPlaceholder}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isVisible && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 1.1 
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          loading="lazy"
        />
      )}
    </div>
  );
});

IntersectionImage.displayName = 'IntersectionImage';

export default IntersectionImage;
