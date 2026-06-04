export type Mood = 'happy' | 'excited' | 'sleepy' | 'proud' | 'cheering' | 'calm';

export type QuestType = 'daily' | 'weekly' | 'epic';

export type CompletionState = 'early' | 'on-time' | 'grace' | 'missed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  questType: QuestType;
  projectId?: string;
  targetDate: string; // ISO date
  graceDays: number;
  completed: boolean;
  completedAt?: string;
  completionState?: CompletionState;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  milestones: Milestone[];
  createdAt: string;
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: HabitFrequency;
  streak: number;
  longestStreak: number;
  history: string[]; // ISO dates completed
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  category: 'productivity' | 'consistency' | 'exploration';
}

export interface WorldArea {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requiredLevel: number;
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  category: 'clothing' | 'accessory' | 'decoration';
  price: number;
  owned: boolean;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  mood: Mood;
  coins: number;
  hairColor: string;
  skinTone: string;
  outfitColor: string;
  hat: string;
}

export interface AppState {
  character: Character;
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  achievements: Achievement[];
  areas: WorldArea[];
  shop: ShopItem[];
  lastCheckIn?: string;
  totalTasksCompleted: number;
  loginStreak: number;
}
