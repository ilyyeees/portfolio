import React from 'react';
import { motion } from 'framer-motion';

const SkipNavigation: React.FC = () => {
  return (
    <motion.a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      initial={{ y: -50, opacity: 0 }}
      whileFocus={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      Skip to main content
    </motion.a>
  );
};

export default SkipNavigation;
