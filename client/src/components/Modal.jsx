import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  className = "",
  closeOnBackdropClick = true,
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
          style={{ margin: 0, padding: 0 }}
          onClick={(e) => {
            if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
        >
          <div
            className="flex min-h-full items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
                onClose();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full ${maxWidth} transform rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-100 overflow-hidden my-auto ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
