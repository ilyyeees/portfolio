import { useEffect, useState, useCallback } from 'react';

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  darkMode: boolean;
}

/**
 * Hook to detect and manage accessibility preferences
 */
export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    darkMode: false,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    // Check for color scheme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Update preferences
    const updatePreferences = () => {
      setPreferences({
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
        largeText: window.innerWidth < 768, // Simplified for mobile
        darkMode: darkModeQuery.matches,
      });
    };

    // Initial check
    updatePreferences();

    // Add listeners
    reducedMotionQuery.addEventListener('change', updatePreferences);
    highContrastQuery.addEventListener('change', updatePreferences);
    darkModeQuery.addEventListener('change', updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences);
      highContrastQuery.removeEventListener('change', updatePreferences);
      darkModeQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  return preferences;
};

/**
 * Hook for keyboard navigation management
 */
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { isKeyboardUser };
};

/**
 * Hook for focus management
 */
export const useFocusManagement = () => {
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    trapFocus,
    announceToScreenReader,
  };
};

/**
 * Hook for ARIA live regions
 */
export const useAriaLive = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region') || createLiveRegion();
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }, []);

  const createLiveRegion = () => {
    const existing = document.getElementById('aria-live-region');
    if (existing) return existing;

    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);

    return liveRegion;
  };

  useEffect(() => {
    createLiveRegion();
  }, []);

  return { announce };
};
