import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface FABProps extends HTMLMotionProps<'button'> {}

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[var(--shadow-glow)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-main md:bottom-8 md:right-8',
          className
        )}
        {...props}
      >
        {children as React.ReactNode}
      </motion.button>
    );
  }
);
FAB.displayName = 'FAB';
