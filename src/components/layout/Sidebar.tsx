import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Library, BarChart3, Settings, Zap } from 'lucide-react'
import { useWordStore } from '../../stores/useWordStore'
import { useWordListStore } from '../../stores/useWordListStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '首页', end: true },
  { to: '/words', icon: BookOpen, label: '单词' },
  { to: '/lists', icon: Library, label: '词库' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/settings', icon: Settings, label: '设置' },
]

export function Sidebar() {
  const wordCount = useWordStore((s) => s.words.length)
  const listCount = useWordListStore((s) => s.lists.length)
  const builtInCount = useWordListStore((s) => s.importedBuiltInLists.length)
  const totalLists = listCount + builtInCount

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-2 h-14 px-4 border-b border-gray-200 dark:border-gray-800">
        <Zap className="w-6 h-6 text-indigo-600" />
        <span className="font-bold text-lg">英语闪卡</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => {
          const badge = to === '/words' ? wordCount : to === '/lists' ? totalLists : 0
          return (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{badge}</span>
              )}
            </NavLink>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400">英语单词学习 · 间隔重复记忆</div>
    </aside>
  )
}
