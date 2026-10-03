import React, { useEffect } from 'react';
import { X } from './icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white p-6 md:p-8 text-left align-middle shadow-floating border border-beige-200 transition-all duration-300 animate-scale-up`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-beige-200/80 mb-5">
            <div>
              <h3 className="text-xl md:text-2xl font-serif text-charcoal-900 font-semibold tracking-tight">
                {title}
              </h3>
              {subtitle && <p className="text-xs md:text-sm text-charcoal-600 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-charcoal-400 hover:text-charcoal-800 hover:bg-beige-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="text-sm text-charcoal-700 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 pt-4 border-t border-beige-200/80 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
