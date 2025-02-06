import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal = ({ children }: { children: React.ReactNode }) => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return null;
    }

    const modal = React.createElement(
      'div',
      {
        style: {
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          overflow: 'hidden',
        },
        onClick: closeModal,
        tabIndex: 0,
        autoFocus: true,
        onScroll: (e: React.UIEvent<HTMLDivElement>) => {
          e.stopPropagation();
          e.preventDefault();
        },
        onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
          e.stopPropagation();
          e.preventDefault();
        },
      },
      children
    );

    document.body.style.overflow = 'hidden';

    return createPortal(modal, document.body);
  };

  return { openModal, closeModal, Modal };
};

export default useModal;
