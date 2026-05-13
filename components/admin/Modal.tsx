'use client'

import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full mx-4 overflow-y-auto"
        style={{ maxWidth: 540, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid #EFEFEF' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>{title}</p>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[#F5F5F5]"
            style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer' }}
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
