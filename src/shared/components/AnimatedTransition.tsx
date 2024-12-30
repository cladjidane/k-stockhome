import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'slide' | 'fade' | 'scale';
}

const animations = {
  slide: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
};

export default function AnimatedTransition({
  children,
  className = '',
  animation = 'fade',
}: AnimatedTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={animations[animation].initial}
        animate={animations[animation].animate}
        exit={animations[animation].exit}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
