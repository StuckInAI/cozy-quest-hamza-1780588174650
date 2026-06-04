import type { SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Select.module.css';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: ReactNode;
};

export default function Select({ label, children, ...rest }: Props) {
  return (
    <label className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <select className={styles.select} {...rest}>{children}</select>
    </label>
  );
}
