import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '../../stores/useToastStore'

const config = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-200' },
  error:   { icon: AlertCircle,   bg: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',       text: 'text-red-800 dark:text-red-200' },
  info:    { icon: Info,          bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-200' },
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => {
        const { icon: Icon, bg, text } = config[t.type]
        return (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg ${bg} ${text}`} style={{ animation: 'slideIn 0.3s ease' }}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 p-0.5 rounded hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
          </div>
        )
      })}
    </div>
  )
}
