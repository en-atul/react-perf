import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import './Modal.scss';

// Modal Context
interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a Modal component');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
  defaultOpen?: boolean; 
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void; 
}

export function ModalProvider({ children, defaultOpen = false, controlledOpen, onOpenChange }: ModalProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (open: boolean) => {
      if (controlledOpen !== undefined) {
        onOpenChange?.(open);
      } else {
        setUncontrolledOpen(open);
      }
    },
    [controlledOpen, onOpenChange]
  );

  const openModal = useCallback(() => setOpen(true), [setOpen]);
  const closeModal = useCallback(() => setOpen(false), [setOpen]);
  const toggleModal = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  const value = {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

// Main Modal Component
interface ModalProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  onClose?: () => void;
}

export function Modal({ 
  children, 
  size = 'md', 
  centered = true, 
  backdrop = true, 
  keyboard = true,
  onClose 
}: ModalProps) {
  const { isOpen, closeModal } = useModal();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (backdrop === true && e.target === e.currentTarget) {
      closeModal();
      onClose?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (keyboard && e.key === 'Escape') {
      closeModal();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-backdrop ${backdrop ? 'modal-backdrop--active' : ''}`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className={`modal modal--${size} ${centered ? 'modal--centered' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

// Modal Header Component
interface ModalHeaderProps {
  children: ReactNode;
  closeButton?: boolean;
  className?: string;
}

export function ModalHeader({ children, closeButton = true, className = '' }: ModalHeaderProps) {
  const { closeModal } = useModal();

  return (
    <div className={`modal__header ${className}`}>
      {children}
      {closeButton && (
        <button 
          className="modal__close-btn"
          onClick={closeModal}
          aria-label="Close modal"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Modal Body Component
interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`modal__body ${className}`}>
      {children}
    </div>
  );
}

// Modal Footer Component
interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`modal__footer ${className}`}>
      {children}
    </div>
  );
}

// Modal Title Component
interface ModalTitleProps {
  children: ReactNode;
  className?: string;
}

export function ModalTitle({ children, className = '' }: ModalTitleProps) {
  return (
    <h2 className={`modal__title ${className}`}>
      {children}
    </h2>
  );
}

// Modal Close Button Component
interface ModalCloseProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ModalClose({ children = 'Close', className = '', onClick }: ModalCloseProps) {
  const { closeModal } = useModal();

  const handleClick = () => {
    closeModal();
    onClick?.();
  };

  return (
    <button 
      className={`modal__close ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

const CompoundModal = Object.assign(Modal, {
  Provider: ModalProvider,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Close: ModalClose,
});

export default CompoundModal;