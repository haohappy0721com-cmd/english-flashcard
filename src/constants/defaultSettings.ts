import type { AppSettings } from '../types/settings'
export const DEFAULT_SETTINGS: AppSettings = {
  dailyNewWords: 20, maxReviewsPerDay: 200, newCardOrder: 'random',
  reviewCardOrder: 'due-date', theme: 'system', fontSize: 'medium', showPhonetic: true,
}
