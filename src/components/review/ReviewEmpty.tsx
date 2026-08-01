import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'

export function ReviewEmpty() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState icon={<BookOpen className="w-16 h-16" />} title="没有待复习的单词" description="全部搞定了！添加一些单词或等待已有单词到期再复习。"
        action={<Link to="/words" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">添加单词</Link>} />
    </div>
  )
}
