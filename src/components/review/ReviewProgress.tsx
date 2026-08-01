interface ReviewProgressProps { current: number; total: number }

export function ReviewProgress({ current, total }: ReviewProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1.5"><span>{current} / {total}</span><span>{pct}%</span></div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} /></div>
    </div>
  )
}
