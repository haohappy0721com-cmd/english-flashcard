import type { Word, WordList } from '../types/word'
import type { SM2Card } from '../types/review'
export interface ExportData { version: number; exportedAt: string; words: Word[]; cards: Record<string, SM2Card>; lists: WordList[] }
export function exportToJson(words: Word[], cards: Record<string, SM2Card>, lists: WordList[]): void {
  const data: ExportData = { version: 1, exportedAt: new Date().toISOString(), words, cards, lists }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = 'flashcard-export-' + new Date().toISOString().split('T')[0] + '.json'
  a.click(); URL.revokeObjectURL(url)
}
export function parseImportFile(content: string): ExportData | null {
  try { const data = JSON.parse(content); if (data.version && Array.isArray(data.words)) return data as ExportData; return null }
  catch { return null }
}
