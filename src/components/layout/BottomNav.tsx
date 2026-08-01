import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Library, BarChart3, Play } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '首页', end: true },
  { to: '/words', icon: BookOpen, label: '单词' },
  { to: '/lists', icon: Library, label: '词库' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/review', icon: Play, label: '复习' },
]

export function BottomNav() {
  const location = useLocation()
  if (location.pathname === '/review') return null

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex h-16">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 text-xs ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
