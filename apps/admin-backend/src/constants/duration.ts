export const DURATION_VALUES = ['3-4', '5-7', '8-10', '10-12'] as const;

export type Duration = (typeof DURATION_VALUES)[number];

export const DURATION_DAY_RANGE: Record<Duration, { min: number; max: number }> = {
  '3-4': { min: 3, max: 4 },
  '5-7': { min: 5, max: 7 },
  '8-10': { min: 8, max: 10 },
  '10-12': { min: 10, max: 12 },
};
