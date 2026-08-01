import { Link } from 'react-router-dom'
import type { ReviewQuality } from '../../types/review'
import { RATINGS } from '../../constants/ratings'

interface ReviewCompleteProps { total: number; ratings: Record<string, ReviewQuality> }

export function ReviewComplete({ total, ratings }: ReviewCompleteProps) {
  const vals = Object.values(ratings)
  const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
  const counts: Record<number, number> = {}
  for (const r of vals) counts[r] = (counts[r] || 0) + 1
  let msg = '继续加油！'
  if (avg >= 4) msg = '太棒了！'
  else if (avg >= 3) msg = '做得不错！'
  else if (avg >= 2) msg = '继续练习！'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-3xl font-bold mb-2">复习完成！</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">{msg}</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
        {RATINGS.map(({ quality, label, color }) => (
          <div key={quality} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
            <div className={`text-lg font-bold ${color.replace('bg-', 'text-').replace(/-\d+.*/, '-500')}`}>{counts[quality] || 0}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400 mb-6">已复习 {total} 个单词 · 平均评分: {avg.toFixed(1)}</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700">返回首页</Link>
    </div>
  )
}
