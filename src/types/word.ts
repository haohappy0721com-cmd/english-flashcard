export interface Word {
  id: string; word: string; phonetic: string; meaning: string
  example: string; tags: string[]; listId: string | null
  createdAt: string; updatedAt: string
}
export interface WordList {
  id: string; name: string; description: string; isBuiltIn: boolean
  sourceFile: string | null; wordCount: number; createdAt: string; updatedAt: string
}
