import { create } from 'zustand'
import type { ReviewSession, SessionWord, ReviewQuality } from '../types/review'

interface ReviewSessionStore {
  session: ReviewSession | null
  startSession: (words: SessionWord[]) => void
  revealCard: () => void
  rateCard: (quality: ReviewQuality) => void
  advanceCard: () => void
  endSession: () => void
}

export const useReviewSessionStore = create<ReviewSessionStore>()((set, get) => ({
  session: null,
  startSession: (words) => set({ session: { sessionWords: words, currentIndex: 0, isRevealed: false, isComplete: false, ratings: {}, startTime: new Date().toISOString() } }),
  revealCard: () => set((s) => { if (!s.session) return s; return { session: { ...s.session, isRevealed: true } } }),
  rateCard: (quality) => { const { session } = get(); if (!session || !session.isRevealed) return; const wordId = session.sessionWords[session.currentIndex].word.id; set({ session: { ...session, ratings: { ...session.ratings, [wordId]: quality } } }) },
  advanceCard: () => set((s) => { if (!s.session) return s; const next = s.session.currentIndex + 1; if (next >= s.session.sessionWords.length) return { session: { ...s.session, isComplete: true } }; return { session: { ...s.session, currentIndex: next, isRevealed: false } } }),
  endSession: () => set({ session: null }),
}))
