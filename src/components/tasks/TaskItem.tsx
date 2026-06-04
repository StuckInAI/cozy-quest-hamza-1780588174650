import type { Task } from '@/types';
import { Check, Trash2, Calendar, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { addDays, formatPretty, today, daysBetween } from '@/lib/date';
import styles from './TaskItem.module.css';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onComplete, onDelete }: Props) {
  const todayIso = today();
  const finalDate = addDays(task.targetDate, task.graceDays);
  const daysToTarget = daysBetween(todayIso, task.targetDate);
  const daysToFinal = daysBetween(todayIso, finalDate);

  let status: 'early' | 'on-track' | 'grace' | 'late' | 'done' = 'on-track';
  if (task.completed) status = 'done';
  else if (daysToTarget > 1) status = 'early';
  else if (daysToTarget >= 0) status = 'on-track';
  else if (daysToFinal >= 0) status = 'grace';
  else status = 'late';

  const statusText: Record<typeof status, string> = {
    early: `${daysToTarget} days to go — gentle pace`,
    'on-track': `Due ${formatPretty(task.targetDate)}`,
    grace: `In grace window · until ${formatPretty(finalDate)}`,
    late: `Whenever you're ready 💛`,
    done: 'Completed ✨',
  };

  const typeBadge: Record<Task['questType'], { label: string; cls: string }> = {
    daily: { label: 'Daily', cls: styles.daily },
    weekly: { label: 'Weekly', cls: styles.weekly },
    epic: { label: 'Epic', cls: styles.epic },
  };

  return (
    <div className={clsx(styles.item, task.completed && styles.completed)}>
      <button
        className={clsx(styles.check, task.completed && styles.checked)}
        onClick={() => onComplete(task.id)}
        disabled={task.completed}
        aria-label="Complete task"
      >
        {task.completed ? <Check size={16} /> : null}
      </button>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{task.title}</span>
          <span className={clsx(styles.badge, typeBadge[task.questType].cls)}>
            <Sparkles size={11} /> {typeBadge[task.questType].label}
          </span>
        </div>
        {task.notes && <p className={styles.notes}>{task.notes}</p>}
        <div className={styles.metaRow}>
          <span className={clsx(styles.status, styles[`s-${status}`])}>
            <Calendar size={12} /> {statusText[status]}
          </span>
          {!task.completed && task.graceDays > 0 && (
            <span className={styles.grace}>+{task.graceDays}d grace</span>
          )}
        </div>
      </div>
      <button className={styles.del} onClick={() => onDelete(task.id)} aria-label="Remove task">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
