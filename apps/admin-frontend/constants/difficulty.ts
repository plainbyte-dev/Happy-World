export const DIFFICULTY_VALUES = ['Easy', 'Moderate', 'Challenging'] as const;

export type Difficulty = (typeof DIFFICULTY_VALUES)[number];
