import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Coffee, Sparkles } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useMobileOptimization';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

// Memoized animation variants for better performance
const containerVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0 }
};

const logoVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 }
};

const spinnerVariants = {
  animate: { rotate: 360 }
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const dotVariants = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.5, 1, 0.5]
  }
};

const LoadingScreen: React.FC<LoadingScreenProps> = React.memo(({ isLoading }) => {
  // Memoized floating particles to avoid recreation on every render
  const floatingParticles = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 1.5
    })), []
  );  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          style={{ willChange: 'opacity' }}
        >
          {/* Simplified animated background for better performance */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-accent/10"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Loading content */}
          <div className="relative z-10 text-center">
            {/* Logo animation */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 22,
                duration: 0.8
              }}
              className="mb-8"
              style={{ willChange: 'transform' }}
            >
              <motion.h1 
                className="text-6xl font-bold text-gradient"
                animate={{
                  textShadow: [
                    "0 0 15px rgba(255, 107, 53, 0.4)",
                    "0 0 25px rgba(255, 107, 53, 0.6)",
                    "0 0 15px rgba(255, 107, 53, 0.4)"
                  ]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                il.y.s
              </motion.h1>
            </motion.div>

            {/* Optimized loading spinner */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="relative w-16 h-16"
                variants={spinnerVariants}
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
              >
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                <motion.div
                  className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </motion.div>            {/* Loading text */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.6 }}
            >
              <motion.p
                className="text-muted-foreground text-lg"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Crafting amazing experiences...
              </motion.p>
            </motion.div>

            {/* Optimized progress dots */}
            <motion.div
              className="flex justify-center space-x-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  variants={dotVariants}
                  animate="animate"
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  style={{ willChange: 'transform' }}
                />
              ))}
            </motion.div>
          </div>

          {/* Optimized floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-accent/30 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -80, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
