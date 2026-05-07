import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isBottomSheetOnMobile?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isBottomSheetOnMobile = true,
}) => {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={isBottomSheetOnMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
              animate={isBottomSheetOnMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
              exit={isBottomSheetOnMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto flex w-full flex-col bg-bg-card shadow-2xl',
                isBottomSheetOnMobile
                  ? 'max-h-[90vh] rounded-t-2xl sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl'
                  : 'max-h-[85vh] max-w-lg rounded-2xl'
              )}
            >
              {/* Drag handle for mobile */}
              {isBottomSheetOnMobile && (
                <div className="flex w-full items-center justify-center pt-3 pb-1 sm:hidden">
                  <div className="h-1 w-12 rounded-full bg-border-subtle" />
                </div>
              )}
              
              <div className="flex items-center justify-between border-b border-border-subtle p-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-text-muted hover:bg-bg-stripe hover:text-text-main transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto p-4 no-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
