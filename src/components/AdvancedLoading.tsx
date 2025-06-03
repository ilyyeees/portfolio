import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface AdvancedLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  delay?: number;
  minLoadingTime?: number;
}

export const AdvancedLoading: React.FC<AdvancedLoadingProps> = ({
  isLoading,
  children,
  skeleton,
  delay = 0,
  minLoadingTime = 500
}) => {
  const [showContent, setShowContent] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    if (!isLoading) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setShowContent(true);
      }, remainingTime + delay);
    }
  }, [isLoading, loadingStartTime, minLoadingTime, delay]);

  const defaultSkeleton = (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );

  if (shouldReduceAnimations) {
    return showContent ? <>{children}</> : (skeleton || defaultSkeleton);
  }

  return (
    <AnimatePresence mode="wait">
      {!showContent ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skeleton || defaultSkeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            staggerChildren: 0.1
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = 'text',
  animation = 'pulse',
  width,
  height
}) => {
  const { shouldReduceAnimations } = useResponsive();

  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded"
  };

  const animationClasses = shouldReduceAnimations ? "" : {
    pulse: "animate-pulse",
    wave: "animate-pulse", // Could be enhanced with a wave animation
    none: ""
  }[animation];

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : undefined)
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
    />
  );
};

interface ProjectCardSkeletonProps {
  count?: number;
}

export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4 p-6 border rounded-lg">
          <Skeleton variant="rectangular" height="200px" />
          <div className="space-y-2">
            <Skeleton width="80%" />
            <Skeleton width="60%" />
            <Skeleton width="90%" />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="circular" width="24px" height="24px" />
            <Skeleton variant="circular" width="24px" height="24px" />
            <Skeleton variant="circular" width="24px" height="24px" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface SkillBadgeSkeletonProps {
  count?: number;
}

export const SkillBadgeSkeleton: React.FC<SkillBadgeSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton 
          key={index} 
          className="h-10 rounded-full"
          width={`${Math.random() * 40 + 80}px`}
        />
      ))}
    </div>
  );
};

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  lowQualitySrc?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = "",
  placeholderSrc,
  lowQualitySrc
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false);
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    // Preload low quality image
    if (lowQualitySrc) {
      const lowQualityImg = new Image();
      lowQualityImg.onload = () => setLowQualityLoaded(true);
      lowQualityImg.src = lowQualitySrc;
    }

    // Preload full quality image
    const fullQualityImg = new Image();
    fullQualityImg.onload = () => setImageLoaded(true);
    fullQualityImg.src = src;
  }, [src, lowQualitySrc]);

  const transition = shouldReduceAnimations 
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!lowQualityLoaded && !imageLoaded && (
        <Skeleton 
          variant="rectangular" 
          className="absolute inset-0 w-full h-full"
        />
      )}

      {/* Low quality image */}
      {lowQualitySrc && lowQualityLoaded && (
        <motion.img
          src={lowQualitySrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 0 : 1 }}
          transition={transition}
        />
      )}

      {/* Full quality image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={transition}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ""
}) => {
  const { shouldReduceAnimations } = useResponsive();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent'
  };

  const animationClass = shouldReduceAnimations ? '' : 'animate-spin';

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${animationClass}
        border-2 border-t-transparent rounded-full
        ${className}
      `}
    />
  );
};

interface ContentTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const ContentTransition: React.FC<ContentTransitionProps> = ({
  children,
  isVisible,
  direction = 'up',
  delay = 0
}) => {
  const { shouldReduceAnimations } = useResponsive();

  const variants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 }
  };

  if (shouldReduceAnimations) {
    return isVisible ? <>{children}</> : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={variants[direction]}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={variants[direction]}
          transition={{
            duration: 0.5,
            delay,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
