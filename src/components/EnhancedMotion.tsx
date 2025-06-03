import React from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface EnhancedMotionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';
  delay?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

// Predefined animation variants optimized for different devices
const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  },
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 10, scale: 0.9 }
  }
};

export const EnhancedMotion: React.FC<EnhancedMotionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration,
  className = '',
  disabled = false
}) => {
  const { shouldReduceAnimations, optimizedSettings } = useResponsive();

  // Use optimized duration or disable animations if needed
  const effectiveDuration = duration ?? optimizedSettings.animationDuration;
  const shouldAnimate = !disabled && !shouldReduceAnimations && optimizedSettings.enableComplexAnimations;

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  const variants = animationVariants[animation];

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{
        duration: effectiveDuration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

// Hook for consistent animation patterns
export const useAnimationConfig = () => {
  const { shouldReduceAnimations, optimizedSettings } = useResponsive();

  return {
    duration: optimizedSettings.animationDuration,
    enabled: optimizedSettings.enableComplexAnimations && !shouldReduceAnimations,
    easing: 'easeOut',
    spring: {
      type: 'spring',
      damping: shouldReduceAnimations ? 30 : 20,
      stiffness: shouldReduceAnimations ? 300 : 200
    }
  };
};

// Utility component for responsive spacing
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  spacing?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  spacing = { mobile: 'p-4', tablet: 'p-6', desktop: 'p-8' },
  className = ''
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getSpacing = () => {
    if (isMobile) return spacing.mobile;
    if (isTablet) return spacing.tablet;
    if (isDesktop) return spacing.desktop;
    return spacing.desktop;
  };

  return (
    <div className={`${getSpacing()} ${className}`}>
      {children}
    </div>
  );
};
