import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': '首页', '/review': '复习', '/words': '单词', '/lists': '词库', '/stats': '统计', '/settings': '设置',
}

export function TopBar() {
  const location = useLocation()
  const base = '/' + (location.pathname.split('/')[1] || '')
  if (base === '/review') return null
  return (
    <header className="lg:hidden flex items-center h-14 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <h1 className="text-lg font-semibold">{titles[base] || '英语闪卡'}</h1>
    </header>
  )
}
