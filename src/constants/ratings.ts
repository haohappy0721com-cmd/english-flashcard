import type { ReviewQuality } from '../types/review'
export interface RatingInfo { quality: ReviewQuality; label: string; shortcut: string; color: string }
export const RATINGS: RatingInfo[] = [
  { quality: 0, label: 'Again', shortcut: '1', color: 'bg-red-500 hover:bg-red-600' },
  { quality: 2, label: 'Hard', shortcut: '2', color: 'bg-orange-500 hover:bg-orange-600' },
  { quality: 3, label: 'Good', shortcut: '3', color: 'bg-emerald-500 hover:bg-emerald-600' },
  { quality: 5, label: 'Easy', shortcut: '4', color: 'bg-blue-500 hover:bg-blue-600' },
]
