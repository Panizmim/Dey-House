'use client'

import { X } from '@/components/ui/icons'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: number
}

export default function Modal({ open, title, onClose, children, footer, maxWidth = 540 }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full mx-4 overflow-y-auto"
        style={{ maxWidth, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid #EFEFEF' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>{title}</p>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, lineHeight: 0 }}
          >
            <X size={18} color="#717171" />
          </button>
        </div>

        {/* بدنه */}
        <div style={{ padding: 20 }}>{children}</div>

        {/* فوتر */}
        {footer && (
          <div
            className="flex justify-end gap-2"
            style={{ padding: '12px 20px', borderTop: '1px solid #EFEFEF' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
