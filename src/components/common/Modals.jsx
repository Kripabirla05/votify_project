import React, { useEffect } from 'react';
import { CloseIcon, ShieldCheckIcon, XCircleIcon, ClockIcon } from '../../assets/icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "normal", 
  maxWidth
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-container ${sizeClass}`}
        style={maxWidth ? { maxWidth } : {}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  highlightText,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="confirm-icon-wrapper confirm-icon-danger">
            <XCircleIcon size={36} />
          </div>
        );
      case 'success':
        return (
          <div className="confirm-icon-wrapper confirm-icon-success">
            <ShieldCheckIcon size={36} />
          </div>
        );
      case 'primary':
        return (
          <div className="confirm-icon-wrapper confirm-icon-primary">
            <ShieldCheckIcon size={36} />
          </div>
        );
      case 'warning':
      default:
        return (
          <div className="confirm-icon-wrapper confirm-icon-warning">
            <ClockIcon size={36} />
          </div>
        );
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'primary': return 'btn-primary';
      case 'warning': default: return 'btn-primary';
    }
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </button>
      <button
        type="button"
        className={`btn ${getConfirmBtnClass()}`}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : confirmText}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} footer={footer} size="sm">
      <div className="confirm-alert-box">
        {getIcon()}
        <h3>{title}</h3>
        <p>{message}</p>
        {highlightText && (
          <div className="highlight-box">
            {highlightText}
          </div>
        )}
      </div>
    </Modal>
  );
};
