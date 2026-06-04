const messages = [
  'You made progress today. 🌱',
  'Every little step counts.',
  'Your future self appreciates this. 💛',
  'Welcome back. We missed you.',
  'Look how far you have come.',
  'Tiny seeds grow into big gardens.',
  'Rest is part of the journey, too.',
  'You are exactly where you need to be.',
  'Soft progress is still progress.',
  'The garden remembers every drop of water.',
];

export function pickEncouragement(seed?: number): string {
  const i = seed === undefined ? Math.floor(Math.random() * messages.length) : seed % messages.length;
  return messages[i];
}

export const completionMessages: Record<string, string[]> = {
  early: ['Ahead of schedule! ✨', 'Wow, look at you go!', 'Future-you is beaming.'],
  'on-time': ['Nicely done. 🌼', 'Right on time.', 'Cozy and steady.'],
  grace: ['Better late than never, friend.', 'You showed up — that matters.', 'Soft win counts.'],
  missed: ['Welcome back. Onward gently.', 'No guilt here. Just growth.', 'You returned. That is everything.'],
};
