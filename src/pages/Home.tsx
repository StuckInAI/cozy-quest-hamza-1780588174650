import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeader from '@/components/ui/SectionHeader';
import CharacterAvatar from '@/components/avatar/CharacterAvatar';
import TaskItem from '@/components/tasks/TaskItem';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { pickEncouragement } from '@/lib/encouragement';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const { state, completeTask, deleteTask, toggleHabit, stats } = useApp();
  const message = useMemo(() => pickEncouragement(new Date().getDate()), []);
  const todayTasks = state.tasks.filter(t => !t.completed).slice(0, 5);
  const todayHabits = state.habits.slice(0, 4);
  const xpPercent = Math.round((state.character.xp / state.character.xpToNext) * 100);

  return (
    <div className={styles.wrap}>
      <Card variant="warm" className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.kicker}>Good day, friend</p>
          <h1 className={styles.heroTitle}>{message}</h1>
          <p className={styles.heroSub}>
            You are at <strong>Level {state.character.level}</strong> with <strong>{state.character.coins} acorns</strong>. Your cozy world is waiting.
          </p>
          <div className={styles.heroProgress}>
            <ProgressBar percent={xpPercent} label={`${state.character.xp} / ${state.character.xpToNext} XP`} />
          </div>
          <div className={styles.heroCta}>
            <Link to="/quests"><Button>View today's quests</Button></Link>
            <Link to="/world"><Button variant="soft">Visit your world</Button></Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <CharacterAvatar character={state.character} size="xl" />
          <p className={styles.moodChip}>Mood: <span>{state.character.mood}</span></p>
        </div>
      </Card>

      <div className={styles.grid}>
        <Card>
          <SectionHeader
            emoji="🌼"
            title="Today's quests"
            subtitle="A few gentle things to enjoy."
            action={<Link to="/quests"><Button size="sm" variant="soft"><Plus size={14} /> Add</Button></Link>}
          />
          {todayTasks.length === 0 ? (
            <p className={styles.empty}>You've finished your quests for now. Rest is part of the journey. 🌙</p>
          ) : (
            <div className={styles.list}>
              {todayTasks.map(t => (
                <TaskItem key={t.id} task={t} onComplete={completeTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </Card>

        <Card variant="soft">
          <SectionHeader emoji="🌿" title="Tiny habits" subtitle="Tap one to celebrate today's care." />
          <div className={styles.habits}>
            {todayHabits.map(h => (
              <button key={h.id} className={styles.habit} onClick={() => toggleHabit(h.id)}>
                <span className={styles.habitEmoji}>{h.emoji}</span>
                <span className={styles.habitTitle}>{h.title}</span>
                <span className={styles.habitStreak}>🔥 {h.streak}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card variant="sky">
          <SectionHeader emoji="✨" title="Your bloom" subtitle="A glance at this season's growth." />
          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniBig}>{stats.tasksCompleted}</span>
              <span className={styles.miniLabel}>tasks completed</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniBig}>{stats.activeHabits}</span>
              <span className={styles.miniLabel}>habits cared for</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniBig}>{stats.habitConsistency}%</span>
              <span className={styles.miniLabel}>habit consistency today</span>
            </div>
          </div>
        </Card>

        <Card variant="rose">
          <SectionHeader emoji="🗺️" title="Upcoming areas" subtitle="More cozy places to discover." />
          <ul className={styles.areaList}>
            {state.areas.filter(a => !a.unlocked).slice(0, 3).map(a => (
              <li key={a.id} className={styles.areaItem}>
                <span className={styles.areaEmoji}>{a.emoji}</span>
                <div>
                  <p className={styles.areaName}>{a.name}</p>
                  <p className={styles.areaSub}>Unlocks at Level {a.requiredLevel}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
