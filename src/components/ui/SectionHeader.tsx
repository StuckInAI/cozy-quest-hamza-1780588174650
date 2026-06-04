import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  emoji?: string;
};

export default function SectionHeader({ title, subtitle, action, emoji }: Props) {
  return (
    <div className={styles.wrap}>
      <div>
        <h2 className={styles.title}>
          {emoji && <span className={styles.emoji}>{emoji}</span>}
          {title}
        </h2>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
