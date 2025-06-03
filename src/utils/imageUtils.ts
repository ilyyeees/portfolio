/**
 * Image optimization utilities for better performance
 */

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Generate optimized image URLs for different sizes
 */
export const generateOptimizedImageUrl = (
  baseUrl: string,
  width: number,
  height?: number,
  quality: number = 80
): string => {
  // For external services like Unsplash, we can add query parameters
  if (baseUrl.includes('unsplash.com')) {
    const params = new URLSearchParams();
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('auto', 'format');
    params.set('fit', 'crop');
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  // For local images, return as-is for now
  // In a real app, you'd integrate with an image optimization service
  return baseUrl;
};

/**
 * Generate responsive image srcset
 */
export const generateResponsiveSrcSet = (
  baseUrl: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string => {
  return sizes
    .map(size => `${generateOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (
  imgElement: HTMLImageElement,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, defaultOptions);

  observer.observe(imgElement);
  return observer;
};

/**
 * Image format detection and fallback
 */
export const getOptimalImageFormat = (): 'webp' | 'avif' | 'jpg' => {
  // Check for AVIF support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    if (avifSupported) return 'avif';
  } catch (e) {
    // AVIF not supported
  }
  
  try {
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    if (webpSupported) return 'webp';
  } catch (e) {
    // WebP not supported
  }
  
  return 'jpg';
};
