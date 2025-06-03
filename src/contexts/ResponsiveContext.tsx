import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDeviceDetection, usePerformanceOptimization } from '@/hooks/useMobileOptimization';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  shouldReduceAnimations: boolean;
  optimizedSettings: {
    animationDuration: number;
    particleCount: number;
    enableComplexAnimations: boolean;
    imageQuality: number;
    enableLazyLoading: boolean;
    targetFPS: number;
    enableGPUAcceleration: boolean;
  };
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
};

interface ResponsiveProviderProps {
  children: React.ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const { deviceInfo, shouldReduceAnimations, optimizedSettings } = usePerformanceOptimization();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set CSS custom properties for responsive design
    const root = document.documentElement;
    
    root.style.setProperty('--mobile-multiplier', deviceInfo.isMobile ? '0.8' : '1');
    root.style.setProperty('--animation-duration', shouldReduceAnimations ? '0.2s' : '0.5s');
    root.style.setProperty('--particle-count', optimizedSettings.particleCount.toString());
    
    // Add device classes to body
    document.body.classList.toggle('is-mobile', deviceInfo.isMobile);
    document.body.classList.toggle('is-tablet', deviceInfo.isTablet);
    document.body.classList.toggle('is-desktop', deviceInfo.isDesktop);
    document.body.classList.toggle('has-touch', deviceInfo.touchSupport);
    document.body.classList.toggle('reduce-animations', shouldReduceAnimations);
    
    setIsReady(true);
  }, [deviceInfo, shouldReduceAnimations, optimizedSettings]);

  const contextValue: ResponsiveContextType = {
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    shouldReduceAnimations,
    optimizedSettings,
    orientation: deviceInfo.orientation,
    touchSupport: deviceInfo.touchSupport,
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Initializing...</div>
      </div>
    );
  }

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  default: T;
}): T {
  const breakpoint = useBreakpoint();
  return values[breakpoint as keyof typeof values] ?? values.default;
}
