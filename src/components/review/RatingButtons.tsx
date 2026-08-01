import type { ReviewQuality } from '../../types/review'
import { RATINGS } from '../../constants/ratings'
import { cn } from '../../lib/utils'

interface RatingButtonsProps { onRate: (quality: ReviewQuality) => void; disabled?: boolean }

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {RATINGS.map(({ quality, label, shortcut, color }) => (
        <button key={quality} onClick={() => onRate(quality)} disabled={disabled}
          className={cn('px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed', color)}>
          {label}<span className="ml-2 text-xs opacity-70">({shortcut})</span>
        </button>
      ))}
    </div>
  )
}
