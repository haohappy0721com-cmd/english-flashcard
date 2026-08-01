const PREFIX = 'flashcard-'
export function loadFromStorage<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) as T : fallback }
  catch { return fallback }
}
export function saveToStorage<T>(key: string, data: T): void {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(data)) }
  catch (e) { if (e instanceof DOMException && e.name === 'QuotaExceededError') alert('存储空间不足！') }
}
export function getStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX)) total += (localStorage.getItem(k) || '').length * 2
  }
  return Math.round(total / 1024)
}
