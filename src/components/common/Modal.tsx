import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Arrière-plan semi-transparent */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenu du dialogue */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-2xl shadow-2xl border border-stone-200 z-10 overflow-hidden transform transition-all my-8 max-h-[90vh] flex flex-col`}
      >
        {/* En-tête de la modale */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-stone-100 shrink-0">
          <div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-stone-900">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-stone-600">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
