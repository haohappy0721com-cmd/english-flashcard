import { create } from 'zustand'; import { persist } from 'zustand/middleware'
import type { AppSettings } from '../types/settings'; import { DEFAULT_SETTINGS } from '../constants/defaultSettings'
interface SettingsStore { settings: AppSettings; updateSettings: (p: Partial<AppSettings>) => void; resetSettings: () => void }
export const useSettingsStore = create<SettingsStore>()(persist((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
}), { name: 'flashcard-settings', version: 1 }))
