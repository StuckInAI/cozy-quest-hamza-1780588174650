import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
