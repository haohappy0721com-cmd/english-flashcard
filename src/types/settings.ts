export interface AppSettings {
  dailyNewWords: number; maxReviewsPerDay: number
  newCardOrder: 'random' | 'sequential'; reviewCardOrder: 'random' | 'due-date'
  theme: 'light' | 'dark' | 'system'; fontSize: 'small' | 'medium' | 'large'
  showPhonetic: boolean
}
