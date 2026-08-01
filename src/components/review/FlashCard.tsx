import type { SessionWord } from '../../types/review'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { speakWord } from '../../lib/speech'
import { Volume2 } from 'lucide-react'

interface FlashCardProps { sessionWord: SessionWord; isRevealed: boolean }

export function FlashCard({ sessionWord, isRevealed }: FlashCardProps) {
  const { word } = sessionWord
  const showPhonetic = useSettingsStore((s) => s.settings.showPhonetic)
  const fontSize = useSettingsStore((s) => s.settings.fontSize)
  const wordSize = { small: 'text-2xl', medium: 'text-3xl md:text-4xl', large: 'text-4xl md:text-5xl' }[fontSize]
  const meaningSize = { small: 'text-lg', medium: 'text-xl md:text-2xl', large: 'text-2xl md:text-3xl' }[fontSize]

  return (
    <div className="card-flip w-full max-w-lg mx-auto" style={{ perspective: '1000px' }}>
      <div className={`card-flip-inner relative w-full ${isRevealed ? 'revealed' : ''}`} style={{ minHeight: '280px' }}>
        <div className="card-flip-front absolute inset-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col items-center justify-center p-8">
          <p className={`${wordSize} font-bold text-center text-gray-900 dark:text-gray-100`}>{word.word}</p>
          {showPhonetic && word.phonetic && <p className="mt-3 text-lg text-gray-400 dark:text-gray-500">{word.phonetic}</p>}
          <button onClick={(e) => { e.stopPropagation(); speakWord(word.word) }} className="mt-4 p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-500 transition-colors" title="朗读"><Volume2 className="w-5 h-5" /></button>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">点击翻牌 / 空格键</p>
        </div>
        <div className="card-flip-back absolute inset-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col items-center justify-center p-8">
          <p className={`${meaningSize} font-semibold text-center text-indigo-700 dark:text-indigo-300`}>{word.meaning}</p>
          {word.example && <p className="mt-4 text-base text-gray-500 dark:text-gray-400 text-center italic">{word.example}</p>}
          {word.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {word.tags.map((tag) => <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
