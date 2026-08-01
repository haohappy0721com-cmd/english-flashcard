import type { ReactNode } from 'react'

interface EmptyStateProps { icon: ReactNode; title: string; description: string; action?: ReactNode }

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-300 dark:text-gray-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  )
}
