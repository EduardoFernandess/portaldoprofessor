import { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </header>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;