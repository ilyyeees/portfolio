import React, { ReactNode, Suspense } from 'react';
import { motion } from 'framer-motion';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

const DefaultFallback = () => (
  <motion.div
    className="flex justify-center items-center h-32"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex space-x-2">
      <motion.div
        className="w-3 h-3 bg-accent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0
        }}
      />
      <motion.div
        className="w-3 h-3 bg-accent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2
        }}
      />
      <motion.div
        className="w-3 h-3 bg-accent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4
        }}
      />
    </div>
  </motion.div>
);

const LazyWrapper: React.FC<LazyWrapperProps> = React.memo(({
  children,
  fallback = <DefaultFallback />,
  className = ''
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
});

LazyWrapper.displayName = 'LazyWrapper';

export default LazyWrapper;
