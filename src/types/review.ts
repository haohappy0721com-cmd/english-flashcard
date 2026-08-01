export type ReviewQuality = 0 | 2 | 3 | 5
export interface SM2Card {
  wordId: string; repetitions: number; easinessFactor: number
  interval: number; nextReviewDate: string; lastReviewDate: string
  lastQuality: ReviewQuality; reviewCount: number
}
export interface ReviewSession {
  sessionWords: SessionWord[]; currentIndex: number; isRevealed: boolean
  isComplete: boolean; ratings: Record<string, ReviewQuality>; startTime: string
}
export interface SessionWord { word: import('./word').Word; sm2Card: SM2Card; isNew: boolean }
