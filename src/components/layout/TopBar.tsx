import { useApp } from '@/context/AppContext';
import styles from './TopBar.module.css';

export default function TopBar() {
  const { state } = useApp();
  const { character, loginStreak } = state;
  const xpPercent = Math.min(100, Math.round((character.xp / character.xpToNext) * 100));

  return (
    <header className={styles.bar}>
      <div className={styles.greeting}>
        <p className={styles.hello}>Hello, {character.name} ☀️</p>
        <p className={styles.sub}>You are growing day by day.</p>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.icon}>🌰</span>
          <span className={styles.value}>{character.coins}</span>
          <span className={styles.label}>acorns</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.icon}>🔥</span>
          <span className={styles.value}>{loginStreak}</span>
          <span className={styles.label}>day streak</span>
        </div>
        <div className={styles.levelBox}>
          <div className={styles.levelTop}>
            <span className={styles.levelLabel}>Lv {character.level}</span>
            <span className={styles.levelXp}>{character.xp} / {character.xpToNext} XP</span>
          </div>
          <div className={styles.bar2}>
            <div className={styles.fill} style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}
