import styles from './ProgressBar.module.css';

type Props = {
  percent: number;
  color?: string;
  label?: string;
};

export default function ProgressBar({ percent, color, label }: Props) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div className={styles.wrap}>
      {label && <div className={styles.label}><span>{label}</span><span>{pct}%</span></div>}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: color ?? undefined }}
        />
      </div>
    </div>
  );
}
