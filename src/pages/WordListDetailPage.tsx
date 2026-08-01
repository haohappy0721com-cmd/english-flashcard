import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Plus, Trash2, Edit3, Play } from 'lucide-react'
import { useWordStore } from '../stores/useWordStore'
import { useWordListStore } from '../stores/useWordListStore'
import { useReviewStore } from '../stores/useReviewStore'
import { useReviewSessionStore } from '../stores/useReviewSessionStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { Modal } from '../components/ui/Modal'
import { WordForm } from '../components/words/WordForm'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

export function WordListDetailPage() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const words = useWordStore((s) => s.getWordsByList(listId || ''))
  const addWord = useWordStore((s) => s.addWord)
  const updateWord = useWordStore((s) => s.updateWord)
  const deleteWord = useWordStore((s) => s.deleteWord)
  const list = useWordListStore((s) => s.getList(listId || ''))
  const deleteList = useWordListStore((s) => s.deleteList)
  const getDueCards = useReviewStore((s) => s.getDueCards)
  const startSession = useReviewSessionStore((s) => s.startSession)
  const settings = useSettingsStore((s) => s.settings)
  const [showAdd, setShowAdd] = useState(false)
  const [editingWord, setEditingWord] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteWordId, setDeleteWordId] = useState<string | null>(null)

  if (!list) return <div className="text-center py-16 text-gray-400">词库不存在</div>

  const editWord = words.find((w) => w.id === editingWord)

  const handleReviewList = () => {
    const dueWords = getDueCards(words, settings.dailyNewWords, settings.maxReviewsPerDay)
    if (dueWords.length === 0) return
    startSession(dueWords); navigate('/review')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => navigate('/lists')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0"><h1 className="text-2xl font-bold">{list.name}</h1>{list.description && <p className="text-sm text-gray-500">{list.description}</p>}</div>
        <button onClick={handleReviewList} className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5"><Play className="w-4 h-4 fill-white" />复习此词库</button>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"><Plus className="w-4 h-4" />添加</button>
        <button onClick={() => setConfirmOpen(true)} className="px-3 py-2 text-sm rounded-lg border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1.5"><Trash2 className="w-4 h-4" />删除词库</button>
      </div>
      {words.length === 0 ? <EmptyState icon={<BookOpen className="w-16 h-16" />} title="词库中还没有单词" description="点击「添加」来添加单词" /> : null}
      <div className="space-y-2 mb-8">
        {words.map((w) => (
          <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold">{w.word}</span>{w.phonetic && <span className="text-xs text-gray-400">{w.phonetic}</span>}</div><p className="text-sm text-gray-500 truncate">{w.meaning}</p></div>
            <button onClick={() => setEditingWord(w.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Edit3 className="w-4 h-4 text-gray-400" /></button>
            <button onClick={() => setDeleteWordId(w.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="添加单词"><WordForm initial={{ listId: list.id }} onSubmit={(data) => { addWord({ ...data, listId: list.id }); setShowAdd(false) }} onCancel={() => setShowAdd(false)} /></Modal>
      <Modal open={!!editingWord} onClose={() => setEditingWord(null)} title="编辑单词">{editWord && <WordForm initial={editWord} onSubmit={(data) => { updateWord(editWord.id, data); setEditingWord(null) }} onCancel={() => setEditingWord(null)} />}</Modal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { deleteList(list.id); navigate('/lists') }} title="删除词库" message={`确定要删除「${list.name}」以及其中的所有单词吗？此操作不可撤销。`} />
      <ConfirmDialog open={deleteWordId !== null} onClose={() => setDeleteWordId(null)} onConfirm={() => { if (deleteWordId) { deleteWord(deleteWordId); setDeleteWordId(null) } }} title="删除单词" message="确定要删除这个单词吗？" />
    </div>
  )
}
