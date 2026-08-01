import { useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { useSettingsStore } from '../stores/useSettingsStore'
import { useWordStore } from '../stores/useWordStore'
import { useReviewStore } from '../stores/useReviewStore'
import { useWordListStore } from '../stores/useWordListStore'
import { exportToJson, parseImportFile } from '../lib/exportImport'
import { getStorageUsage } from '../lib/storage'

export function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const words = useWordStore((s) => s.words)
  const setWords = useWordStore.setState
  const cards = useReviewStore((s) => s.cards)
  const setCards = useReviewStore.setState
  const dailyCounts = useReviewStore((s) => s.dailyReviewCounts)
  const lists = useWordListStore((s) => s.lists)
  const setLists = useWordListStore.setState
  const importedBuiltIn = useWordListStore((s) => s.importedBuiltInLists)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => { exportToJson(words, cards, lists) }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const text = await file.text(); const data = parseImportFile(text)
    if (!data) { alert('文件格式无效'); return }
    if (confirm(`导入 ${data.words.length} 个单词和 ${Object.keys(data.cards).length} 条复习记录？`)) {
      setWords({ words: data.words }); setCards({ cards: data.cards, dailyReviewCounts: dailyCounts }); setLists({ lists: data.lists, importedBuiltInLists: importedBuiltIn })
      alert('导入完成！')
    }
    e.target.value = ''
  }

  const handleClear = () => {
    if (confirm('这将删除所有数据，确定吗？')) {
      if (confirm('最后确认：建议先导出备份。点击取消返回，点击确定清空。')) { localStorage.clear(); window.location.reload() }
    }
  }

  const rowClass = "flex items-center justify-between px-4 py-3"
  const inputClass = "px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">设置</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
        {[{ label: '每日新单词', key: 'dailyNewWords' as const, min: 1, max: 100 }, { label: '每日最大复习', key: 'maxReviewsPerDay' as const, min: 10, max: 999 }].map(({ label, key, min, max }) => (
          <div key={key} className={rowClass}><span className="text-sm">{label}</span><input type="number" value={settings[key]} min={min} max={max} onChange={(e) => updateSettings({ [key]: parseInt(e.target.value) || min })} className={`w-20 text-center ${inputClass}`} /></div>
        ))}
        <div className={rowClass}><span className="text-sm">主题</span>
          <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })} className={inputClass}>
            <option value="system">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option>
          </select>
        </div>
        <div className={rowClass}><span className="text-sm">字号</span>
          <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })} className={inputClass}>
            <option value="small">小</option><option value="medium">中</option><option value="large">大</option>
          </select>
        </div>
        <div className={rowClass}><span className="text-sm">显示音标</span>
          <button onClick={() => updateSettings({ showPhonetic: !settings.showPhonetic })} className={`w-10 h-6 rounded-full transition-colors ${settings.showPhonetic ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${settings.showPhonetic ? 'translate-x-4' : ''}`} />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-4">数据管理</h2>
        <p className="text-xs text-gray-500 mb-4">存储占用: ~{getStorageUsage()} KB</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"><Download className="w-4 h-4" />导出数据</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"><Upload className="w-4 h-4" />导入数据</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button onClick={handleClear} className="px-4 py-2 text-sm rounded-lg border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />清空所有数据</button>
        </div>
      </div>
    </div>
  )
}
