import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className, ...rest }: Props) {
  return (
    <label className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <input className={clsx(styles.input, className)} {...rest} />
    </label>
  );
}
