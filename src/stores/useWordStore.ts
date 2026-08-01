import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Word } from '../types/word'
import { generateId, today } from '../lib/utils'

interface WordStore {
  words: Word[]
  addWord: (data: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>) => Word
  updateWord: (id: string, data: Partial<Omit<Word, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteWord: (id: string) => void
  deleteWordsByList: (listId: string) => void
  getWordsByList: (listId: string) => Word[]
  importWords: (w: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>[]) => number
  getWordsByIds: (ids: string[]) => Word[]
}

export const useWordStore = create<WordStore>()(persist((set, get) => ({
  words: [],
  addWord: (data) => {
    const word: Word = { ...data, id: generateId(), createdAt: today(), updatedAt: today() }
    set((s) => ({ words: [...s.words, word] }))
    return word
  },
  updateWord: (id, data) => set((s) => ({ words: s.words.map((w) => w.id === id ? { ...w, ...data, updatedAt: today() } : w) })),
  deleteWord: (id) => set((s) => ({ words: s.words.filter((w) => w.id !== id) })),
  deleteWordsByList: (listId) => set((s) => ({ words: s.words.filter((w) => w.listId !== listId) })),
  getWordsByList: (listId) => get().words.filter((w) => w.listId === listId),
  importWords: (newWords) => {
    const existing = get().words
    const set_ = new Set(existing.map((w) => w.word.toLowerCase()))
    let added = 0
    const toAdd: Word[] = []
    for (const w of newWords) {
      if (!set_.has(w.word.toLowerCase())) {
        toAdd.push({ ...w, id: generateId(), createdAt: today(), updatedAt: today() })
        set_.add(w.word.toLowerCase()); added++
      }
    }
    if (toAdd.length > 0) set((s) => ({ words: [...s.words, ...toAdd] }))
    return added
  },
  getWordsByIds: (ids) => {
    const map = new Map(get().words.map((w) => [w.id, w]))
    return ids.map((id) => map.get(id)).filter(Boolean) as Word[]
  },
}), { name: 'flashcard-words', version: 1 }))
