import type { SM2Card, ReviewQuality } from '../types/review'
export function createSM2Card(wordId: string): SM2Card {
  return { wordId, repetitions: 0, easinessFactor: 2.5, interval: 0, nextReviewDate: new Date().toISOString().split('T')[0], lastReviewDate: '', lastQuality: 0, reviewCount: 0 }
}
export function applyReview(card: SM2Card, quality: ReviewQuality): SM2Card {
  let { repetitions, easinessFactor, interval } = card
  const today = new Date().toISOString().split('T')[0]
  easinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easinessFactor < 1.3) easinessFactor = 1.3
  if (quality < 3) { repetitions = 0; interval = 1 }
  else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easinessFactor)
    repetitions += 1
  }
  const d = new Date(today); d.setDate(d.getDate() + interval)
  return { ...card, repetitions, easinessFactor: Math.round(easinessFactor * 100) / 100, interval, nextReviewDate: d.toISOString().split('T')[0], lastReviewDate: today, lastQuality: quality, reviewCount: card.reviewCount + 1 }
}
export function isCardDue(card: SM2Card, date?: Date): boolean {
  return card.nextReviewDate <= (date || new Date()).toISOString().split('T')[0]
}
