import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface AnimationSettings {
  duration: number;
  easing: string;
  stiffness: number;
  damping: number;
  mass: number;
  enabled: boolean;
  complexity: 'minimal' | 'basic' | 'advanced' | 'full';
}

interface AnimationControllerContextType {
  settings: AnimationSettings;
  updateSettings: (newSettings: Partial<AnimationSettings>) => void;
  shouldAnimate: (complexity: 'minimal' | 'basic' | 'advanced' | 'full') => boolean;
  getTransition: (overrides?: Partial<AnimationSettings>) => any;
  isReducedMotion: boolean;
}

const AnimationControllerContext = createContext<AnimationControllerContextType | null>(null);

export const useAnimationController = () => {
  const context = useContext(AnimationControllerContext);
  if (!context) {
    throw new Error('useAnimationController must be used within AnimationControllerProvider');
  }
  return context;
};

interface AnimationControllerProviderProps {
  children: React.ReactNode;
}

export const AnimationControllerProvider: React.FC<AnimationControllerProviderProps> = ({ children }) => {
  const { isMobile, shouldReduceAnimations, optimizedSettings } = useResponsive();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Default animation settings based on device capabilities
  const getDefaultSettings = useCallback((): AnimationSettings => {
    const baseSettings: AnimationSettings = {
      duration: 0.5,
      easing: 'easeOut',
      stiffness: 100,
      damping: 15,
      mass: 1,
      enabled: true,
      complexity: 'full'
    };

    if (shouldReduceAnimations || isReducedMotion) {
      return {
        ...baseSettings,
        duration: 0.2,
        complexity: 'minimal',
        enabled: false
      };
    }

    if (isMobile) {
      return {
        ...baseSettings,
        duration: 0.3,
        stiffness: 150,
        damping: 20,
        complexity: optimizedSettings.enableComplexAnimations ? 'advanced' : 'basic'
      };
    }

    return baseSettings;
  }, [isMobile, shouldReduceAnimations, isReducedMotion, optimizedSettings.enableComplexAnimations]);

  const [settings, setSettings] = useState<AnimationSettings>(getDefaultSettings);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update settings when device capabilities change
  useEffect(() => {
    setSettings(getDefaultSettings());
  }, [getDefaultSettings]);

  const updateSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const shouldAnimate = useCallback((complexity: 'minimal' | 'basic' | 'advanced' | 'full') => {
    if (!settings.enabled || isReducedMotion) return false;

    const complexityLevels = {
      minimal: 1,
      basic: 2,
      advanced: 3,
      full: 4
    };

    return complexityLevels[complexity] <= complexityLevels[settings.complexity];
  }, [settings.enabled, settings.complexity, isReducedMotion]);

  const getTransition = useCallback((overrides: Partial<AnimationSettings> = {}) => {
    const finalSettings = { ...settings, ...overrides };

    if (!finalSettings.enabled || isReducedMotion) {
      return { duration: 0 };
    }

    return {
      type: "spring",
      stiffness: finalSettings.stiffness,
      damping: finalSettings.damping,
      mass: finalSettings.mass,
      duration: finalSettings.duration
    };
  }, [settings, isReducedMotion]);

  const value: AnimationControllerContextType = {
    settings,
    updateSettings,
    shouldAnimate,
    getTransition,
    isReducedMotion
  };

  return (
    <AnimationControllerContext.Provider value={value}>
      {children}
    </AnimationControllerContext.Provider>
  );
};

// Enhanced Motion wrapper that uses the animation controller
interface SmartMotionProps {
  children: React.ReactNode;
  complexity?: 'minimal' | 'basic' | 'advanced' | 'full';
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';
  className?: string;
  delay?: number;
  [key: string]: any;
}

export const SmartMotion: React.FC<SmartMotionProps> & {
  div: React.FC<SmartMotionProps & { as?: 'div' }>;
  h1: React.FC<SmartMotionProps & { as?: 'h1' }>;
  h2: React.FC<SmartMotionProps & { as?: 'h2' }>;
  h3: React.FC<SmartMotionProps & { as?: 'h3' }>;
  p: React.FC<SmartMotionProps & { as?: 'p' }>;
  span: React.FC<SmartMotionProps & { as?: 'span' }>;
  section: React.FC<SmartMotionProps & { as?: 'section' }>;
} = ({ 
  children, 
  complexity = 'basic', 
  animation = 'fadeIn',
  className,
  delay = 0,
  as = 'div',
  ...props 
}: SmartMotionProps & { as?: keyof HTMLElementTagNameMap }) => {
  const { shouldAnimate, getTransition } = useAnimationController();

  const animationVariants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -5, scale: 0.95 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: 5, scale: 0.95 }
    }
  };

  if (!shouldAnimate(complexity)) {
    const Element = as as keyof JSX.IntrinsicElements;
    return <Element className={className}>{children}</Element>;
  }

  const variants = animationVariants[animation];
  const transition = getTransition({ duration: delay > 0 ? 0.5 : 0.3 });
  const MotionElement = motion[as as keyof typeof motion] as any;

  return (
    <MotionElement
      className={className}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{
        ...transition,
        delay
      }}
      {...props}
    >
      {children}
    </MotionElement>
  );
};

// Add element-specific variants
SmartMotion.div = (props) => <SmartMotion {...props} as="div" />;
SmartMotion.h1 = (props) => <SmartMotion {...props} as="h1" />;
SmartMotion.h2 = (props) => <SmartMotion {...props} as="h2" />;
SmartMotion.h3 = (props) => <SmartMotion {...props} as="h3" />;
SmartMotion.p = (props) => <SmartMotion {...props} as="p" />;
SmartMotion.span = (props) => <SmartMotion {...props} as="span" />;
SmartMotion.section = (props) => <SmartMotion {...props} as="section" />;

// Performance monitoring for animations
export const useAnimationPerformance = () => {
  const [metrics, setMetrics] = useState({
    averageFPS: 60,
    droppedFrames: 0,
    animationCount: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        setMetrics(prev => ({
          ...prev,
          averageFPS: fps,
          droppedFrames: fps < 55 ? prev.droppedFrames + 1 : prev.droppedFrames
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      frameCount++;
      animationFrame = requestAnimationFrame(measureFPS);
    };

    if (process.env.NODE_ENV === 'development') {
      animationFrame = requestAnimationFrame(measureFPS);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return metrics;
};
