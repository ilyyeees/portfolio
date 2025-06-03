import { useEffect, useRef, useCallback } from 'react';

interface FocusManagerOptions {
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export const useFocusManager = (
  isOpen: boolean = true,
  options: FocusManagerOptions = {}
) => {
  const { trapFocus = false, autoFocus = false, restoreFocus = false } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Get focusable elements
  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(', ');

    return Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(element => {
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    if (event.key === 'Escape') {
      // Allow components to handle escape key
      const escapeEvent = new CustomEvent('focusEscape', { bubbles: true });
      containerRef.current?.dispatchEvent(escapeEvent);
    }
  }, [trapFocus, getFocusableElements]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // Store previous focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Auto focus first element
    if (autoFocus) {
      const focusableElements = getFocusableElements(container);
      const firstElement = focusableElements[0];
      if (firstElement) {
        setTimeout(() => firstElement.focus(), 0);
      }
    }

    // Add keyboard listener
    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore previous focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, autoFocus, restoreFocus, trapFocus, handleKeyDown, getFocusableElements]);

  return {
    containerRef,
    getFocusableElements: () => 
      containerRef.current ? getFocusableElements(containerRef.current) : [],
  };
};

// Hook for managing scroll behavior
export const useScrollManager = () => {
  const scrollToElement = useCallback((
    elementId: string,
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
  ) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
      
      // Focus the element for screen readers
      if (element.tabIndex === -1) {
        element.tabIndex = -1;
      }
      element.focus();
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    scrollToElement,
    scrollToTop,
  };
};

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      let shortcutKey = '';
      if (ctrlKey) shortcutKey += 'ctrl+';
      if (shiftKey) shortcutKey += 'shift+';
      if (altKey) shortcutKey += 'alt+';
      shortcutKey += key;

      const handler = shortcuts[shortcutKey];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
