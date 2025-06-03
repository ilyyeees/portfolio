import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useAnimationController } from './AdvancedAnimationController';

// Create a HOC for motion components that integrates with our animation controller
export function createSmartMotion<T extends keyof JSX.IntrinsicElements>(
  component: T
) {
  return React.forwardRef<
    HTMLElement,
    HTMLMotionProps<T> & {
      complexity?: 'minimal' | 'basic' | 'advanced' | 'full';
    }
  >(({ complexity = 'basic', ...props }, ref) => {
    const { shouldAnimate, getTransition } = useAnimationController();
    
    if (!shouldAnimate(complexity)) {
      const Element = component as any;
      return <Element ref={ref} {...props} />;
    }

    const MotionComponent = motion[component] as any;
    return <MotionComponent ref={ref} {...props} />;
  });
}

// Pre-created smart motion components
export const SmartMotion = {
  div: createSmartMotion('div'),
  section: createSmartMotion('section'),
  h1: createSmartMotion('h1'),
  h2: createSmartMotion('h2'),
  h3: createSmartMotion('h3'),
  p: createSmartMotion('p'),
  span: createSmartMotion('span'),
  a: createSmartMotion('a'),
};
