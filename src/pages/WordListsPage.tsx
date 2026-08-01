import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Plus, BookOpen } from 'lucide-react'
import { useWordListStore } from '../stores/useWordListStore'
import { useToastStore } from '../stores/useToastStore'
import { BUILT_IN_LISTS } from '../constants/builtInLists'
import { Modal } from '../components/ui/Modal'

export function WordListsPage() {
  const lists = useWordListStore((s) => s.lists)
  const importedLists = useWordListStore((s) => s.importedBuiltInLists)
  const importBuiltInList = useWordListStore((s) => s.importBuiltInList)
  const createList = useWordListStore((s) => s.createList)
  const addToast = useToastStore((s) => s.addToast)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [importing, setImporting] = useState<string | null>(null)

  const handleImport = async (sourceFile: string, name: string, description: string) => {
    setImporting(sourceFile)
    try { const count = await importBuiltInList(sourceFile, name, description); addToast(`已导入「${name}」词库，共 ${count} 个单词`) }
    catch { addToast('导入失败，请重试', 'error') }
    setImporting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">词库</h1>
        <button onClick={() => setShowCreate(true)} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"><Plus className="w-4 h-4" />新建词库</button>
      </div>
      <h2 className="font-semibold text-sm text-gray-500 uppercase mb-3">内置词库</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {BUILT_IN_LISTS.map((l) => {
          const imported = importedLists.includes(l.sourceFile)
          return (
            <div key={l.sourceFile} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div><p className="font-semibold">{l.emoji} {l.name}</p><p className="text-xs text-gray-500">{l.description}</p></div>
              {imported ? <span className="text-xs text-emerald-600 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-full">已导入</span> :
                <button onClick={() => handleImport(l.sourceFile, l.name, l.description)} disabled={importing === l.sourceFile}
                  className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"><Download className="w-3 h-3" />{importing === l.sourceFile ? '导入中...' : '导入'}</button>}
            </div>
          )
        })}
      </div>
      <h2 className="font-semibold text-sm text-gray-500 uppercase mb-3">自定义词库</h2>
      {lists.length === 0 ? <p className="text-sm text-gray-400 py-8 text-center">还没有自定义词库，创建一个吧！</p> :
        <div className="space-y-2">
          {lists.map((l) => (
            <Link key={l.id} to={`/words/${l.id}`} className="block p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between"><div><p className="font-semibold">{l.name}</p>{l.description && <p className="text-xs text-gray-500">{l.description}</p>}</div><span className="text-sm text-gray-400">{l.wordCount} 词</span></div>
            </Link>
          ))}
        </div>}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="新建词库">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">名称</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div><label className="block text-sm font-medium mb-1">描述</label><input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">取消</button>
            <button onClick={() => { if (newName.trim()) { createList(newName.trim(), newDesc.trim()); setShowCreate(false); setNewName(''); setNewDesc('') } }} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">创建</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
