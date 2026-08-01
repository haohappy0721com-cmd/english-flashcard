import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ReviewPage } from './pages/ReviewPage'
import { WordsPage } from './pages/WordsPage'
import { WordListDetailPage } from './pages/WordListDetailPage'
import { WordListsPage } from './pages/WordListsPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { useSettingsStore } from './stores/useSettingsStore'
import { ToastContainer } from './components/ui/Toast'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.settings.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else if (theme === 'light') root.classList.remove('dark')
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) root.classList.add('dark')
        else root.classList.remove('dark')
      }
      handler(mq)
      mq.addEventListener('change', handler as (e: MediaQueryListEvent) => void)
      return () => mq.removeEventListener('change', handler as (e: MediaQueryListEvent) => void)
    }
  }, [theme])
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename="/english-flashcard">
      <ThemeProvider>
        <Routes>
          <Route path="/review" element={<ReviewPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/words" element={<WordsPage />} />
            <Route path="/words/:listId" element={<WordListDetailPage />} />
            <Route path="/lists" element={<WordListsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </ThemeProvider>
    </BrowserRouter>
  )
}
