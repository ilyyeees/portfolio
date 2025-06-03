import React, { useEffect, useState, useCallback } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  connectionType: string;
}

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'landscape',
    touchSupport: false,
    connectionType: 'unknown'
  });

  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const orientation = width > height ? 'landscape' : 'portrait';
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Get connection type if available
    let connectionType = 'unknown';
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connectionType = connection.effectiveType || connection.type || 'unknown';
    }

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      orientation,
      touchSupport,
      connectionType
    });
  }, []);

  useEffect(() => {
    updateDeviceInfo();
    
    const handleResize = () => updateDeviceInfo();
    const handleOrientationChange = () => {
      // Add small delay to get accurate dimensions after orientation change
      setTimeout(updateDeviceInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateDeviceInfo]);

  return deviceInfo;
};

// Hook for optimizing performance based on device capabilities
export const usePerformanceOptimization = () => {
  const deviceInfo = useDeviceDetection();
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const [shouldReduceQuality, setShouldReduceQuality] = useState(false);

  useEffect(() => {
    // Reduce animations on slower connections or low-end devices
    const slowConnection = ['slow-2g', '2g', '3g'].includes(deviceInfo.connectionType);
    const lowEndDevice = deviceInfo.isMobile && deviceInfo.screenWidth < 400;
    
    setShouldReduceAnimations(slowConnection || lowEndDevice);
    setShouldReduceQuality(slowConnection);
  }, [deviceInfo]);

  const getOptimizedSettings = useCallback(() => {
    return {
      // Animation settings
      animationDuration: shouldReduceAnimations ? 0.2 : 0.5,
      particleCount: deviceInfo.isMobile ? 20 : 40,
      enableComplexAnimations: !shouldReduceAnimations,
      
      // Image settings
      imageQuality: shouldReduceQuality ? 0.7 : 0.9,
      enableLazyLoading: true,
      
      // Performance settings
      targetFPS: deviceInfo.isMobile ? 30 : 60,
      enableGPUAcceleration: !deviceInfo.isMobile,
    };
  }, [deviceInfo, shouldReduceAnimations, shouldReduceQuality]);

  return {
    deviceInfo,
    shouldReduceAnimations,
    shouldReduceQuality,
    optimizedSettings: getOptimizedSettings(),
  };
};

// Hook for touch gestures
export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onPinch?: (scale: number) => void;
    threshold?: number;
  } = {}
) => {
  const { threshold = 50 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let startDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        startDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
              options.onSwipeRight?.();
            } else {
              options.onSwipeLeft?.();
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
              options.onSwipeDown?.();
            } else {
              options.onSwipeUp?.();
            }
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && options.onPinch) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (startDistance > 0) {
          const scale = currentDistance / startDistance;
          options.onPinch(scale);
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [elementRef, options, threshold]);
};

// Hook for viewport intersection with mobile optimizations
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  };
};
