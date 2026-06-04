import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState, Task, Habit, Project, ShopItem, CompletionState, Mood } from '@/types';
import { createInitialState } from '@/lib/seed';
import { loadState, saveState } from '@/lib/storage';
import { today, addDays, daysBetween, isSameDay } from '@/lib/date';

function computeCompletionState(task: Task, completedDate: string): CompletionState {
  const finalDate = addDays(task.targetDate, task.graceDays);
  const dToTarget = daysBetween(completedDate, task.targetDate); // positive if target in future
  if (dToTarget > 1) return 'early';
  if (daysBetween(completedDate, task.targetDate) >= 0) return 'on-time';
  if (daysBetween(completedDate, finalDate) >= 0) return 'grace';
  return 'missed';
}

function rewardsFor(state: CompletionState, questType: Task['questType']): { xp: number; coins: number } {
  const base = questType === 'epic' ? 40 : questType === 'weekly' ? 25 : 15;
  const baseCoin = questType === 'epic' ? 30 : questType === 'weekly' ? 18 : 10;
  switch (state) {
    case 'early': return { xp: Math.round(base * 1.5), coins: Math.round(baseCoin * 1.5) };
    case 'on-time': return { xp: base, coins: baseCoin };
    case 'grace': return { xp: Math.round(base * 0.6), coins: Math.round(baseCoin * 0.6) };
    case 'missed': return { xp: Math.round(base * 0.3), coins: Math.round(baseCoin * 0.3) };
  }
}

export interface RewardEvent {
  id: number;
  message: string;
  xp: number;
  coins: number;
  state: CompletionState | 'habit' | 'milestone';
  mood: Mood;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState<AppState>() ?? createInitialState());
  const [reward, setReward] = useState<RewardEvent | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Daily check-in handling
  useEffect(() => {
    const todayIso = today();
    if (!state.lastCheckIn) {
      setState(s => ({ ...s, lastCheckIn: todayIso }));
      return;
    }
    if (!isSameDay(state.lastCheckIn, todayIso)) {
      const gap = daysBetween(state.lastCheckIn, todayIso);
      const newStreak = gap === 1 ? state.loginStreak + 1 : 1;
      setState(s => ({
        ...s,
        lastCheckIn: todayIso,
        loginStreak: newStreak,
        character: { ...s.character, coins: s.character.coins + 10, mood: 'cheering' as Mood },
      }));
      setReward({
        id: Date.now(),
        message: 'Welcome back. We missed you. 💛',
        xp: 0,
        coins: 10,
        state: 'habit',
        mood: 'cheering',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grantXP = useCallback((xp: number, coins: number) => {
    setState(prev => {
      let { level, xp: curXp, xpToNext, coins: curCoins } = prev.character;
      curXp += xp;
      curCoins += coins;
      while (curXp >= xpToNext) {
        curXp -= xpToNext;
        level += 1;
        xpToNext = Math.round(xpToNext * 1.25);
      }
      // Unlock areas based on level
      const areas = prev.areas.map(a => a.unlocked || level >= a.requiredLevel ? { ...a, unlocked: true } : a);
      const unlockedExploration = areas.some(a => a.unlocked && a.id !== 'cottage');
      const achievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        if (a.id === 'a7' && unlockedExploration) return { ...a, unlocked: true };
        return a;
      });
      return {
        ...prev,
        character: { ...prev.character, level, xp: curXp, xpToNext, coins: curCoins },
        areas,
        achievements,
      };
    });
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task || task.completed) return prev;
      const todayIso = today();
      const compState = computeCompletionState(task, todayIso);
      const { xp, coins } = rewardsFor(compState, task.questType);
      const newTotal = prev.totalTasksCompleted + 1;
      const achievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        if (a.id === 'a1' && newTotal >= 1) return { ...a, unlocked: true };
        if (a.id === 'a2' && newTotal >= 100) return { ...a, unlocked: true };
        if (a.id === 'a3' && newTotal >= 1000) return { ...a, unlocked: true };
        return a;
      });
      const mood: Mood = compState === 'early' ? 'excited' : compState === 'on-time' ? 'happy' : compState === 'grace' ? 'calm' : 'cheering';
      setReward({
        id: Date.now(),
        message: `+${xp} XP   +${coins} 🌰`,
        xp,
        coins,
        state: compState,
        mood,
      });
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: true, completedAt: todayIso, completionState: compState } : t),
        totalTasksCompleted: newTotal,
        achievements,
        character: { ...prev.character, mood },
      };
    });
    // grant after state updates settle
    const task = state.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      const compState = computeCompletionState(task, today());
      const { xp, coins } = rewardsFor(compState, task.questType);
      grantXP(xp, coins);
    }
  }, [state.tasks, grantXP]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { ...task, id: `t-${Date.now()}`, completed: false, createdAt: new Date().toISOString() },
      ],
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const toggleHabit = useCallback((habitId: string) => {
    setState(prev => {
      const todayIso = today();
      const habit = prev.habits.find(h => h.id === habitId);
      if (!habit) return prev;
      const alreadyToday = habit.history.includes(todayIso);
      if (alreadyToday) return prev; // gentle: no un-doing
      const newStreak = habit.streak + 1;
      const updated: Habit = {
        ...habit,
        history: [...habit.history, todayIso],
        streak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak),
      };
      const xp = 12;
      const coins = 6;
      const achievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        if (a.id === 'a4' && newStreak >= 7) return { ...a, unlocked: true };
        if (a.id === 'a5' && newStreak >= 30) return { ...a, unlocked: true };
        if (a.id === 'a6' && newStreak >= 100) return { ...a, unlocked: true };
        return a;
      });
      setReward({
        id: Date.now(),
        message: `${habit.emoji} ${habit.title} — streak ${newStreak}!`,
        xp,
        coins,
        state: 'habit',
        mood: 'proud',
      });
      return {
        ...prev,
        habits: prev.habits.map(h => h.id === habitId ? updated : h),
        achievements,
        character: { ...prev.character, mood: 'proud' as Mood },
      };
    });
    grantXP(12, 6);
  }, [grantXP]);

  const addHabit = useCallback((title: string, emoji: string, frequency: Habit['frequency']) => {
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, {
        id: `h-${Date.now()}`, title, emoji, frequency,
        streak: 0, longestStreak: 0, history: [], createdAt: new Date().toISOString(),
      }],
    }));
  }, []);

  const toggleMilestone = useCallback((projectId: string, milestoneId: string) => {
    let unlockedXp = 0;
    setState(prev => {
      const project = prev.projects.find(p => p.id === projectId);
      if (!project) return prev;
      const ms = project.milestones.find(m => m.id === milestoneId);
      if (!ms) return prev;
      const becomeDone = !ms.done;
      if (becomeDone) unlockedXp = 20;
      const projects = prev.projects.map(p => p.id === projectId ? {
        ...p,
        milestones: p.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m),
      } : p);
      if (becomeDone) {
        setReward({
          id: Date.now(),
          message: `Milestone reached! +20 XP +10 🌰`,
          xp: 20,
          coins: 10,
          state: 'milestone',
          mood: 'proud',
        });
      }
      return { ...prev, projects, character: { ...prev.character, mood: becomeDone ? 'proud' as Mood : prev.character.mood } };
    });
    if (unlockedXp > 0) grantXP(20, 10);
  }, [grantXP]);

  const addProject = useCallback((data: Omit<Project, 'id' | 'createdAt' | 'milestones'> & { milestones?: Project['milestones'] }) => {
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: `p-${Date.now()}`,
        title: data.title,
        description: data.description,
        emoji: data.emoji,
        color: data.color,
        milestones: data.milestones ?? [],
        createdAt: new Date().toISOString(),
      }],
    }));
  }, []);

  const buyItem = useCallback((itemId: string) => {
    setState(prev => {
      const item = prev.shop.find(i => i.id === itemId);
      if (!item || item.owned) return prev;
      if (prev.character.coins < item.price) return prev;
      const decorated = item.category === 'decoration';
      const achievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        if (a.id === 'a8' && decorated) return { ...a, unlocked: true };
        return a;
      });
      return {
        ...prev,
        character: { ...prev.character, coins: prev.character.coins - item.price, mood: 'excited' as Mood },
        shop: prev.shop.map(i => i.id === itemId ? { ...i, owned: true } : i),
        achievements,
      };
    });
  }, []);

  const updateCharacter = useCallback((patch: Partial<AppState['character']>) => {
    setState(prev => ({ ...prev, character: { ...prev.character, ...patch } }));
  }, []);

  const dismissReward = useCallback(() => setReward(null), []);

  const stats = useMemo(() => {
    const tasksCompleted = state.totalTasksCompleted;
    const activeHabits = state.habits.length;
    const habitConsistency = state.habits.length
      ? Math.round((state.habits.filter(h => h.history.includes(today())).length / state.habits.length) * 100)
      : 0;
    const projectsProgress = state.projects.map(p => {
      const total = p.milestones.length || 1;
      const done = p.milestones.filter(m => m.done).length;
      return { id: p.id, title: p.title, percent: Math.round((done / total) * 100) };
    });
    return { tasksCompleted, activeHabits, habitConsistency, projectsProgress };
  }, [state]);

  return {
    state,
    reward,
    dismissReward,
    addTask,
    completeTask,
    deleteTask,
    toggleHabit,
    addHabit,
    toggleMilestone,
    addProject,
    buyItem,
    updateCharacter,
    stats,
  };
}

export type AppStateHook = ReturnType<typeof useAppState>;
