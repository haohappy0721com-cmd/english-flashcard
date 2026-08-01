import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }

export function ConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">取消</button>
          <button onClick={() => { onConfirm(); onClose() }} className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">确认</button>
        </div>
      </div>
    </Modal>
  )
}
