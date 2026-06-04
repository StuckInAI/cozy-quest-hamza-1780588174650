import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'warm' | 'soft' | 'sky' | 'moss' | 'rose';
  padded?: boolean;
};

export default function Card({ children, className, variant = 'default', padded = true }: Props) {
  return (
    <div className={clsx(styles.card, styles[variant], padded && styles.padded, className)}>
      {children}
    </div>
  );
}
