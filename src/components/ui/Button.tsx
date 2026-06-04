import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'soft' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ children, variant = 'primary', size = 'md', className, ...rest }: Props) {
  return (
    <button className={clsx(styles.btn, styles[variant], styles[size], className)} {...rest}>
      {children}
    </button>
  );
}
