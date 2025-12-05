export const PRICE_RANGE = {
  MIN: 0,
  MAX: 100,
  STEP: 10,
} as const;

export const RATING_OPTIONS = [
  { value: 0, label: 'All ratings' },
  { value: 4.0, label: '4.0+ stars' },
  { value: 4.5, label: '4.5+ stars' },
  { value: 4.8, label: '4.8+ stars' },
  { value: 5.0, label: '5.0 stars' },
];