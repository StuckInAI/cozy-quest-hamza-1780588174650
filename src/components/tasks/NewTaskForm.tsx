import { useState, type FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { today } from '@/lib/date';
import type { QuestType } from '@/types';
import styles from './NewTaskForm.module.css';

export default function NewTaskForm({ onDone }: { onDone?: () => void }) {
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [questType, setQuestType] = useState<QuestType>('daily');
  const [targetDate, setTargetDate] = useState(today());
  const [graceDays, setGraceDays] = useState(2);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), notes: notes.trim() || undefined, questType, targetDate, graceDays });
    setTitle(''); setNotes(''); setQuestType('daily'); setTargetDate(today()); setGraceDays(2);
    onDone?.();
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <Input label="What would you like to do?" placeholder="e.g. Water the basil" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Notes (optional)" placeholder="A gentle reminder…" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className={styles.row}>
        <Select label="Quest type" value={questType} onChange={(e) => setQuestType(e.target.value as QuestType)}>
          <option value="daily">🌼 Daily quest</option>
          <option value="weekly">🌿 Weekly quest</option>
          <option value="epic">✨ Epic quest</option>
        </Select>
        <Input label="Target date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        <Input label="Grace days" type="number" min={0} max={30} value={graceDays} onChange={(e) => setGraceDays(parseInt(e.target.value || '0', 10))} />
      </div>
      <div className={styles.actions}>
        <Button type="submit">Plant the quest 🌱</Button>
      </div>
    </form>
  );
}
