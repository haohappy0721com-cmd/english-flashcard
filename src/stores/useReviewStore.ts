import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SM2Card, ReviewQuality, SessionWord } from '../types/review'
import type { Word } from '../types/word'
import { createSM2Card, applyReview, isCardDue } from '../lib/sm2'

interface ReviewStats { totalCards: number; dueToday: number; newToday: number; averageEasiness: number; totalReviews: number; reviewsToday: number; streak: number; lastStudyDate: string | null }

interface ReviewStore {
  cards: Record<string, SM2Card>; dailyReviewCounts: Record<string, number>
  initCard: (wordId: string) => SM2Card
  recordReview: (wordId: string, quality: ReviewQuality) => SM2Card
  getDueCards: (words: Word[], dailyNewLimit: number, maxReviews: number) => SessionWord[]
  getStats: (totalWords: number) => ReviewStats
  getCardForWord: (wordId: string) => SM2Card | undefined
}

export const useReviewStore = create<ReviewStore>()(persist((set, get) => ({
  cards: {}, dailyReviewCounts: {},
  initCard: (wordId) => { const c = get().cards[wordId]; if (c) return c; const card = createSM2Card(wordId); set((s) => ({ cards: { ...s.cards, [wordId]: card } })); return card },
  recordReview: (wordId, quality) => {
    const old = get().cards[wordId] || createSM2Card(wordId)
    const updated = applyReview(old, quality)
    const today = new Date().toISOString().split('T')[0]
    set((s) => ({ cards: { ...s.cards, [wordId]: updated }, dailyReviewCounts: { ...s.dailyReviewCounts, [today]: (s.dailyReviewCounts[today] || 0) + 1 } }))
    return updated
  },
  getDueCards: (words, dailyNewLimit, maxReviews) => {
    const state = get()
    const today = new Date().toISOString().split('T')[0]
    const remaining = maxReviews - (state.dailyReviewCounts[today] || 0)
    if (remaining <= 0) return []
    const wordMap = new Map(words.map((w) => [w.id, w]))
    const dueCards: SessionWord[] = []; const newCards: SessionWord[] = []
    for (const word of words) {
      const card = state.cards[word.id]
      if (card && isCardDue(card)) dueCards.push({ word, sm2Card: card, isNew: card.reviewCount === 0 })
      else if (!card) newCards.push({ word, sm2Card: createSM2Card(word.id), isNew: true })
    }
    dueCards.sort((a, b) => a.sm2Card.nextReviewDate < b.sm2Card.nextReviewDate ? -1 : a.sm2Card.nextReviewDate > b.sm2Card.nextReviewDate ? 1 : a.sm2Card.easinessFactor - b.sm2Card.easinessFactor)
    const maxNew = Math.min(dailyNewLimit, remaining)
    return [...dueCards, ...newCards.slice(0, maxNew)].slice(0, remaining)
  },
  getStats: (totalWords) => {
    const state = get(); const today = new Date().toISOString().split('T')[0]
    const cards = Object.values(state.cards)
    const dueToday = cards.filter((c) => isCardDue(c)).length
    const totalReviews = cards.reduce((s, c) => s + c.reviewCount, 0)
    const avgEF = cards.length > 0 ? cards.reduce((s, c) => s + c.easinessFactor, 0) / cards.length : 2.5
    let streak = 0; const d = new Date(today)
    while (true) {
      const ds = d.toISOString().split('T')[0]
      if ((state.dailyReviewCounts[ds] || 0) > 0) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return { totalCards: cards.length, dueToday, newToday: totalWords - cards.length, averageEasiness: Math.round(avgEF * 100) / 100, totalReviews, reviewsToday: state.dailyReviewCounts[today] || 0, streak, lastStudyDate: cards.length > 0 ? today : null }
  },
  getCardForWord: (wordId) => get().cards[wordId],
}), { name: 'flashcard-reviews', version: 1 }))
