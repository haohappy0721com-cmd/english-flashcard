export function speakWord(text: string): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1
  window.speechSynthesis.speak(u)
}
