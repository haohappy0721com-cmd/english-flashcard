import { useEffect, useCallback } from 'react'
import { useReviewStore } from '../stores/useReviewStore'
import { useReviewSessionStore } from '../stores/useReviewSessionStore'
import { useWordStore } from '../stores/useWordStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { FlashCard } from '../components/review/FlashCard'
import { RatingButtons } from '../components/review/RatingButtons'
import { ReviewProgress } from '../components/review/ReviewProgress'
import { ReviewComplete } from '../components/review/ReviewComplete'
import { ReviewEmpty } from '../components/review/ReviewEmpty'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReviewQuality } from '../types/review'

export function ReviewPage() {
  const navigate = useNavigate()
  const words = useWordStore((s) => s.words)
  const settings = useSettingsStore((s) => s.settings)
  const getDueCards = useReviewStore((s) => s.getDueCards)
  const recordReview = useReviewStore((s) => s.recordReview)
  const session = useReviewSessionStore((s) => s.session)
  const startSession = useReviewSessionStore((s) => s.startSession)
  const revealCard = useReviewSessionStore((s) => s.revealCard)
  const rateCard = useReviewSessionStore((s) => s.rateCard)
  const advanceCard = useReviewSessionStore((s) => s.advanceCard)
  const endSession = useReviewSessionStore((s) => s.endSession)

  useEffect(() => {
    if (!session) {
      const dueWords = getDueCards(words, settings.dailyNewWords, settings.maxReviewsPerDay)
      if (dueWords.length > 0) startSession(dueWords)
    }
  }, [])

  const handleReveal = useCallback(() => {
    if (!session || session.isRevealed) return
    revealCard()
  }, [session, revealCard])

  const handleRate = useCallback((quality: ReviewQuality) => {
    if (!session || !session.isRevealed) return
    const sw = session.sessionWords[session.currentIndex]
    recordReview(sw.word.id, quality)
    rateCard(quality)
    setTimeout(() => advanceCard(), 300)
  }, [session, recordReview, rateCard, advanceCard])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!session || session.isComplete) return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!session.isRevealed) handleReveal() }
      if (session.isRevealed) {
        const keyMap: Record<string, ReviewQuality> = { '1': 0, '2': 2, '3': 3, '4': 5 }
        if (e.key in keyMap) { e.preventDefault(); handleRate(keyMap[e.key]) }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [session, handleReveal, handleRate])

  if (!session && words.length === 0) return <ReviewEmpty />
  if (!session) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-500">加载中...</p></div>
  if (session.isComplete) return <ReviewComplete total={session.sessionWords.length} ratings={session.ratings} />

  const sw = session.sessionWords[session.currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => { endSession(); navigate('/') }} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
        <span className="text-sm text-gray-400">复习</span>
        <div className="w-9" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <ReviewProgress current={session.currentIndex + 1} total={session.sessionWords.length} />
        <div onClick={handleReveal} className="cursor-pointer w-full max-w-lg"><FlashCard sessionWord={sw} isRevealed={session.isRevealed} /></div>
        <div className="mt-8">
          {session.isRevealed ? <RatingButtons onRate={handleRate} /> : <p className="text-sm text-gray-400">点击卡片或按空格键翻牌</p>}
        </div>
      </div>
    </div>
  )
}
