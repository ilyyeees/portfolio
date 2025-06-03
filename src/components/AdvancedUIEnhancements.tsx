import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  disabled?: boolean;
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({ 
  children, 
  speed = 0.5,
  disabled = false 
}) => {
  const [scrollY, setScrollY] = useState(0);
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    if (disabled || shouldReduceAnimations) return;

    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [disabled, shouldReduceAnimations]);

  if (disabled || shouldReduceAnimations) {
    return <>{children}</>;
  }

  return (
    <motion.div
      style={{
        transform: `translateY(${scrollY * speed}px)`,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "",
  strength = 20,
  disabled = false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { shouldReduceAnimations } = useResponsive();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || shouldReduceAnimations) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    setMousePosition({
      x: deltaX * strength,
      y: deltaY * strength
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  if (disabled || shouldReduceAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = "",
  delay = 0,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (disabled || shouldReduceAnimations) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span className={className}>
      <AnimatePresence>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.05,
              delay: index * 0.03,
              ease: "easeOut"
            }}
            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.span>
  );
};

interface SmoothScrollIndicatorProps {
  disabled?: boolean;
}

export const SmoothScrollIndicator: React.FC<SmoothScrollIndicatorProps> = ({ 
  disabled = false 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { shouldReduceAnimations } = useResponsive();

  useEffect(() => {
    if (disabled || shouldReduceAnimations) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [disabled, shouldReduceAnimations]);

  if (disabled || shouldReduceAnimations) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary z-50"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ duration: 0.1 }}
    />
  );
};
