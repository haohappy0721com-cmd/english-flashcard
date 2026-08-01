import { useState, type FormEvent } from 'react'
import type { Word } from '../../types/word'

interface WordFormProps { initial?: Partial<Word>; onSubmit: (data: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }

export function WordForm({ initial, onSubmit, onCancel }: WordFormProps) {
  const [word, setWord] = useState(initial?.word || '')
  const [phonetic, setPhonetic] = useState(initial?.phonetic || '')
  const [meaning, setMeaning] = useState(initial?.meaning || '')
  const [example, setExample] = useState(initial?.example || '')
  const [tagsStr, setTagsStr] = useState(initial?.tags?.join(', ') || '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!word.trim() || !meaning.trim()) return
    onSubmit({ word: word.trim(), phonetic: phonetic.trim(), meaning: meaning.trim(), example: example.trim(), tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean), listId: initial?.listId ?? null })
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">单词 *</label><input type="text" value={word} onChange={(e) => setWord(e.target.value)} className={inputClass} placeholder="e.g. abandon" autoFocus /></div>
      <div><label className="block text-sm font-medium mb-1">音标</label><input type="text" value={phonetic} onChange={(e) => setPhonetic(e.target.value)} className={inputClass} placeholder="/əˈbændən/" /></div>
      <div><label className="block text-sm font-medium mb-1">释义 *</label><input type="text" value={meaning} onChange={(e) => setMeaning(e.target.value)} className={inputClass} placeholder="v. 放弃；抛弃" /></div>
      <div><label className="block text-sm font-medium mb-1">例句</label><input type="text" value={example} onChange={(e) => setExample(e.target.value)} className={inputClass} placeholder="He abandoned his plan." /></div>
      <div><label className="block text-sm font-medium mb-1">标签（逗号分隔）</label><input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputClass} placeholder="CET-4, verb" /></div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">取消</button>
        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">保存</button>
      </div>
    </form>
  )
}
