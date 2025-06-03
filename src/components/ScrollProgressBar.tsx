import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar: React.FC = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = Math.round((scrolled / maxScroll) * 100);
    
    setIsVisible(scrolled > 100);
    setScrollPercentage(percentage);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 8);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-transparent origin-left"
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -10 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ willChange: 'opacity, transform' }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={scrollPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-live="polite"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-accent to-secondary origin-left"
        style={{ 
          scaleX, 
          willChange: 'transform',
        }}
        animate={{
          backgroundPositionX: ["0%", "100%", "0%"]
        }}
        transition={{
          duration: 5,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Screen reader only text for current progress */}
      <span className="sr-only">
        Page scrolled {scrollPercentage}%
      </span>
    </motion.div>
  );
});

ScrollProgressBar.displayName = 'ScrollProgressBar';

export default ScrollProgressBar;
