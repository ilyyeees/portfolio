import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  enableAnimation?: boolean;
  fallback?: React.ReactNode;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  enableAnimation = true,
  fallback = null
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasLoaded]);

  const handleError = () => {
    setError(true);
  };

  const content = error ? (
    fallback || (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <span>Failed to load content</span>
      </div>
    )
  ) : isVisible ? (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  ) : (
    placeholder || (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">
          <div className="w-full h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  );

  if (!enableAnimation) {
    return (
      <div ref={elementRef} className={className}>
        {content}
      </div>
    );
  }

  return (
    <div ref={elementRef} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    </div>
  );
};

// Simple error boundary for the lazy loading
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <span>Something went wrong</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadWrapper;
