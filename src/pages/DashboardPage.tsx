import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Zap, BookOpen, TrendingUp, Flame } from 'lucide-react'
import { useWordStore } from '../stores/useWordStore'
import { useReviewStore } from '../stores/useReviewStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { useReviewSessionStore } from '../stores/useReviewSessionStore'

export function DashboardPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const words = useWordStore((s) => s.words)
  const getStats = useReviewStore((s) => s.getStats)
  const getDueCards = useReviewStore((s) => s.getDueCards)
  const startSession = useReviewSessionStore((s) => s.startSession)
  const settings = useSettingsStore((s) => s.settings)
  const addWord = useWordStore((s) => s.addWord)
  const [quickWord, setQuickWord] = useState('')
  const [quickMeaning, setQuickMeaning] = useState('')

  const stats = getStats(words.length)
  const newWordsAvailable = words.length - Object.keys(useReviewStore.getState().cards).length

  const handleStartReview = () => {
    const dueWords = getDueCards(words, settings.dailyNewWords, settings.maxReviewsPerDay)
    if (dueWords.length > 0) { startSession(dueWords); navigate('/review') }
  }

  const handleQuickAdd = () => {
    if (!quickWord.trim() || !quickMeaning.trim()) return
    addWord({ word: quickWord.trim(), phonetic: '', meaning: quickMeaning.trim(), example: '', tags: [], listId: null })
    setQuickWord(''); setQuickMeaning(''); inputRef.current?.focus()
  }

  const getLabel = () => {
    if (words.length === 0) return '请先添加单词'
    if (stats.dueToday > 0) return `开始复习（${stats.dueToday} 个待复习）`
    if (newWordsAvailable > 0) return `学习新单词（${Math.min(newWordsAvailable, settings.dailyNewWords)} 个可用）`
    return '暂无待复习单词'
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: '总单词', value: words.length, icon: BookOpen, color: 'text-blue-600' },
          { label: '今日待复习', value: stats.dueToday, icon: Zap, color: 'text-amber-600' },
          { label: '累计复习', value: stats.totalReviews, icon: TrendingUp, color: 'text-emerald-600' },
          { label: '连击', value: `${stats.streak}d`, icon: Flame, color: 'text-red-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Icon className={`w-5 h-5 ${color} mb-2`} /><p className="text-2xl font-bold">{value}</p><p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
      <button onClick={handleStartReview} disabled={stats.dueToday === 0 && newWordsAvailable === 0}
        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-8">
        <Play className="w-5 h-5 fill-white" />{getLabel()}
      </button>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-3">快速添加</h2>
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={quickWord} onChange={(e) => setQuickWord(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd() }} placeholder="单词"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="text" value={quickMeaning} onChange={(e) => setQuickMeaning(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd() }} placeholder="释义"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          <button onClick={handleQuickAdd} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">添加</button>
        </div>
      </div>
    </div>
  )
}
