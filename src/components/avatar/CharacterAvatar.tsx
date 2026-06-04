import type { Character } from '@/types';
import clsx from 'clsx';
import styles from './CharacterAvatar.module.css';

type Props = {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
};

const moodFace: Record<Character['mood'], string> = {
  happy: '◡‿◡',
  excited: '✧◡✧',
  sleepy: '-_-',
  proud: '◠‿◠',
  cheering: '◕‿◕',
  calm: '◡  ◡',
};

export default function CharacterAvatar({ character, size = 'md', animated = true }: Props) {
  return (
    <div className={clsx(styles.wrap, styles[size], animated && styles.animated)}>
      <div className={styles.shadow} />
      <div className={styles.hat}>{character.hat}</div>
      <div className={styles.head} style={{ background: character.skinTone }}>
        <div className={styles.hair} style={{ background: character.hairColor }} />
        <div className={styles.face}>{moodFace[character.mood]}</div>
        <div className={styles.cheekL} />
        <div className={styles.cheekR} />
      </div>
      <div className={styles.body} style={{ background: character.outfitColor }}>
        <div className={styles.collar} />
      </div>
    </div>
  );
}
