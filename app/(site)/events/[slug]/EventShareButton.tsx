'use client'

import { Share2 } from '@/components/ui/icons'
import toast from 'react-hot-toast'

export default function EventShareButton({ title }: { title: string }) {
  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => null)
    } else {
      await navigator.clipboard.writeText(url).catch(() => null)
      toast.success('لینک کپی شد')
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: '#717171', fontSize: 13,
        border: '1px solid #E5E5E5', borderRadius: 8, padding: '6px 14px',
        background: 'white', cursor: 'pointer', transition: 'all 150ms',
        fontFamily: 'YekanBakh, Tahoma, sans-serif',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B1E1E'; e.currentTarget.style.color = '#8B1E1E' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#717171' }}
    >
      <Share2 size={14} />
      اشتراک‌گذاری
    </button>
  )
}
