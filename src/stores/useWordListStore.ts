import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WordList, Word } from '../types/word'
import { generateId, today } from '../lib/utils'
import { useWordStore } from './useWordStore'

interface WordListStore {
  lists: WordList[]
  importedBuiltInLists: string[]
  createList: (name: string, description?: string) => WordList
  deleteList: (id: string) => void
  getList: (id: string) => WordList | undefined
  importBuiltInList: (sourceFile: string, name: string, description: string) => Promise<number>
  isBuiltInListImported: (sourceFile: string) => boolean
}

export const useWordListStore = create<WordListStore>()(persist((set, get) => ({
  lists: [], importedBuiltInLists: [],
  createList: (name, description = '') => {
    const list: WordList = { id: generateId(), name, description, isBuiltIn: false, sourceFile: null, wordCount: 0, createdAt: today(), updatedAt: today() }
    set((s) => ({ lists: [...s.lists, list] })); return list
  },
  deleteList: (id) => { useWordStore.getState().deleteWordsByList(id); set((s) => ({ lists: s.lists.filter((l) => l.id !== id) })) },
  getList: (id) => get().lists.find((l) => l.id === id),
  importBuiltInList: async (sourceFile, name, description) => {
    if (get().importedBuiltInLists.includes(sourceFile)) return 0
    const resp = await fetch('/english-flashcard/lists/' + sourceFile); if (!resp.ok) throw new Error('Failed'); const rawWords: { word: string; phonetic: string; meaning: string; example: string; tags: string[] }[] = await resp.json()
    const listId = generateId()
    const list: WordList = { id: listId, name, description, isBuiltIn: true, sourceFile, wordCount: rawWords.length, createdAt: today(), updatedAt: today() }
    const words: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>[] = rawWords.map((w) => ({ ...w, tags: w.tags || [], listId }))
    useWordStore.getState().importWords(words)
    const actualCount = useWordStore.getState().getWordsByList(listId).length; list.wordCount = actualCount
    set((s) => ({ lists: [...s.lists, list], importedBuiltInLists: [...s.importedBuiltInLists, sourceFile] }))
    return actualCount
  },
  isBuiltInListImported: (sourceFile) => get().importedBuiltInLists.includes(sourceFile),
}), { name: 'flashcard-lists', version: 1 }))
