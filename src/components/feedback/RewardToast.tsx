import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { completionMessages } from '@/lib/encouragement';
import styles from './RewardToast.module.css';

export default function RewardToast() {
  const { reward, dismissReward } = useApp();

  useEffect(() => {
    if (!reward) return;
    const t = setTimeout(dismissReward, 3200);
    return () => clearTimeout(t);
  }, [reward, dismissReward]);

  if (!reward) return null;

  const sub =
    reward.state === 'habit' ? 'Tiny habit, big love. 💛' :
    reward.state === 'milestone' ? 'A milestone bloomed!' :
    completionMessages[reward.state]?.[0] ?? 'You did it.';

  return (
    <div className={styles.wrap} role="status" onClick={dismissReward}>
      <div className={styles.card}>
        <div className={styles.emoji}>🌟</div>
        <div>
          <p className={styles.title}>{reward.message}</p>
          <p className={styles.sub}>{sub}</p>
        </div>
      </div>
    </div>
  );
}
