import { useState, useMemo } from 'react'
import { useWordStore } from '../stores/useWordStore'
import { useToastStore } from '../stores/useToastStore'
import { Modal } from '../components/ui/Modal'
import { WordForm } from '../components/words/WordForm'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { BookOpen, Plus, Search, Trash2, Edit3, ChevronRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Word } from '../types/word'

export function WordsPage() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [deleteWordId, setDeleteWordId] = useState<string | null>(null)
  const words = useWordStore((s) => s.words)
  const addWord = useWordStore((s) => s.addWord)
  const updateWord = useWordStore((s) => s.updateWord)
  const deleteWord = useWordStore((s) => s.deleteWord)
  const importWords = useWordStore((s) => s.importWords)
  const addToast = useToastStore((s) => s.addToast)

  const filtered = useMemo(() => {
    if (!search.trim()) return words
    const q = search.toLowerCase()
    return words.filter((w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q) || w.tags.some((t) => t.toLowerCase().includes(q)))
  }, [words, search])

  const handleBulkImport = () => {
    if (!bulkText.trim()) return
    const lines = bulkText.trim().split('\n').filter(Boolean)
    const newWords = lines.map((line) => {
      const parts = line.split('\t').length > 1 ? line.split('\t') : line.split(',')
      return { word: (parts[0] || '').trim(), phonetic: (parts[1] || '').trim(), meaning: (parts[2] || '').trim(), example: (parts[3] || '').trim(), tags: (parts[4] || '').split('/').map((t) => t.trim()).filter(Boolean), listId: null as string | null }
    }).filter((w) => w.word && w.meaning)
    const added = importWords(newWords)
    const skipped = newWords.length - added
    addToast(`导入 ${added} 个单词${skipped > 0 ? `，跳过 ${skipped} 个重复` : ''}`)
    setBulkText(''); setShowBulk(false)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">全部单词</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowBulk(true)} className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">批量导入</button>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"><Plus className="w-4 h-4" />添加单词</button>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索单词、释义、标签..." className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"><X className="w-4 h-4" /></button>}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-16 h-16" />} title="还没有单词" description="添加你的第一个单词，或导入词库开始学习。"
          action={<button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">添加单词</button>} />
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => (
            <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="font-semibold text-gray-900 dark:text-gray-100">{w.word}</span>{w.phonetic && <span className="text-xs text-gray-400">{w.phonetic}</span>}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{w.meaning}</p>
                {w.tags.length > 0 && <div className="flex gap-1 mt-1">{w.tags.map((t) => <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">{t}</span>)}</div>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditingWord(w)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => setDeleteWordId(w.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="w-4 h-4 text-red-400" /></button>
                {w.listId && <Link to={`/words/${w.listId}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight className="w-4 h-4 text-gray-400" /></Link>}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="添加单词"><WordForm onSubmit={(data) => { addWord(data); setShowAdd(false) }} onCancel={() => setShowAdd(false)} /></Modal>
      <Modal open={!!editingWord} onClose={() => setEditingWord(null)} title="编辑单词">
        {editingWord && <WordForm initial={editingWord} onSubmit={(data) => { updateWord(editingWord.id, data); setEditingWord(null) }} onCancel={() => setEditingWord(null)} />}
      </Modal>
      <ConfirmDialog open={deleteWordId !== null} onClose={() => setDeleteWordId(null)} onConfirm={() => { if (deleteWordId) { deleteWord(deleteWordId); setDeleteWordId(null) } }} title="删除单词" message="确定要删除这个单词吗？" />
      <Modal open={showBulk} onClose={() => setShowBulk(false)} title="批量导入">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">每行一个单词，Tab 或逗号分隔：单词 | 音标 | 释义 | 例句 | 标签</p>
          <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={10} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
            placeholder={`abandon\t/əˈbændən/\tv. 放弃\tHe abandoned the plan.\tCET-4\nabrupt\t/əˈbrʌpt/\tadj. 突然的\tThe car stopped abrupt.\tCET-4`} />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowBulk(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">取消</button>
            <button onClick={handleBulkImport} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">导入</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
