'use client'

import { useState } from 'react'

export default function EventDescriptionExpand({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = description.length > 280 || description.split('\n').length > 3

  return (
    <div>
      <div style={{
        fontSize: 15,
        color: '#404040',
        lineHeight: 1.9,
        whiteSpace: 'pre-line',
        overflow: 'hidden',
        maxHeight: expanded || !isLong ? '2000px' : '5.7em',
        transition: 'max-height 400ms ease',
      }}>
        {description}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: 700,
            color: '#801A00',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'YekanBakh, Tahoma, sans-serif',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
        </button>
      )}
    </div>
  )
}
