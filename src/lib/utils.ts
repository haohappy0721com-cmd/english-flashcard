import { clsx, type ClassValue } from 'clsx'
export function cn(...inputs: ClassValue[]) { return clsx(inputs) }
export function generateId(): string { return crypto.randomUUID() }
export function today(): string { return new Date().toISOString().split('T')[0] }
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr); d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}
