import { useMemo } from 'react'
import { useWordStore } from '../stores/useWordStore'
import { useReviewStore } from '../stores/useReviewStore'

export function StatsPage() {
  const words = useWordStore((s) => s.words)
  const cards = useReviewStore((s) => s.cards)
  const dailyReviewCounts = useReviewStore((s) => s.dailyReviewCounts)
  const totalReviews = Object.values(cards).reduce((s, c) => s + c.reviewCount, 0)
  const cardList = Object.values(cards)
  const mastered = cardList.filter((c) => c.interval > 90).length
  const learning = cardList.filter((c) => c.interval > 0 && c.interval <= 21).length
  const reviewing = cardList.filter((c) => c.interval > 21 && c.interval <= 90).length
  const newCount = words.length - cardList.length
  const avgQuality = cardList.length > 0 ? (cardList.reduce((s, c) => s + c.lastQuality, 0) / cardList.length).toFixed(1) : '-'

  const last30 = useMemo(() => {
    const result: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const ds = d.toISOString().split('T')[0]; result.push({ date: ds, count: dailyReviewCounts[ds] || 0 }) }
    return result
  }, [dailyReviewCounts])
  const maxCount = Math.max(1, ...last30.map((d) => d.count))

  const today = new Date(); const startDate = new Date(today); startDate.setDate(startDate.getDate() - startDate.getDay() - 11 * 7)
  const heatmapDays: { date: string; count: number; level: number }[] = []
  for (let i = 0; i < 84; i++) { const d = new Date(startDate); d.setDate(d.getDate() + i); const ds = d.toISOString().split('T')[0]; const count = dailyReviewCounts[ds] || 0; heatmapDays.push({ date: ds, count, level: count === 0 ? 0 : count <= 5 ? 1 : count <= 15 ? 2 : count <= 30 ? 3 : 4 }) }
  const weeks = Array.from({ length: 12 }, (_, wi) => heatmapDays.slice(wi * 7, wi * 7 + 7))

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">统计</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: '总单词', value: words.length }, { label: '累计复习', value: totalReviews }, { label: '平均评分', value: avgQuality }, { label: '已掌握', value: mastered }].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"><p className="text-2xl font-bold">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-4">词汇分布</h2>
        <div className="flex gap-3">
          {[{ label: '新', count: newCount, color: 'bg-gray-300' }, { label: '学习', count: learning, color: 'bg-amber-400' }, { label: '复习', count: reviewing, color: 'bg-blue-400' }, { label: '掌握', count: mastered, color: 'bg-emerald-400' }].map(({ label, count, color }) => (
            <div key={label} className="flex-1 text-center"><div className={`w-full h-3 rounded-full ${color} mb-1`} /><p className="text-xs text-gray-500">{label}</p><p className="font-semibold text-sm">{count}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-4">最近 30 天</h2>
        <div className="flex items-end gap-px h-24">
          {last30.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center" title={`${d.date}: ${d.count} 次`}>
              <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '1px', opacity: d.count > 0 ? 1 : 0.2 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-4">活跃度（12 周）</h2>
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div key={day.date} title={`${day.date}: ${day.count} 次`}
                  className={`w-3 h-3 rounded-sm ${['bg-gray-100 dark:bg-gray-800', 'bg-emerald-200 dark:bg-emerald-900', 'bg-emerald-400 dark:bg-emerald-600', 'bg-emerald-600', 'bg-emerald-800'][day.level]}`} />
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">少 &rarr; 多</p>
      </div>
    </div>
  )
}
