'use client'

interface Props {
  label: string
  slots: string[]
  selected: string | null
  onSelect: (time: string) => void
  disabledSlots?: string[]
}

export default function TimePicker({ label, slots, selected, onSelect, disabledSlots = [] }: Props) {
  return (
    <div
      dir="rtl"
      style={{
        background: 'white', borderRadius: 12,
        border: '1px solid #EFEFEF', width: 160, overflow: 'hidden',
      }}
    >
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#A0A0A0', letterSpacing: '0.05em' }}>
          {label}
        </p>
      </div>

      <div style={{ maxHeight: 240, overflowY: 'auto', padding: '4px 0' }}>
        {slots.map((slot) => {
          const disabled    = disabledSlots.includes(slot)
          const isSelected  = selected === slot

          return (
            <button
              key={slot}
              onClick={() => { if (!disabled) onSelect(slot) }}
              disabled={disabled}
              style={{
                width: '100%', padding: '10px 16px',
                textAlign: 'right', border: 'none',
                fontSize: 14, fontWeight: isSelected ? 700 : 400,
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: isSelected ? '#801A00' : 'transparent',
                color: isSelected ? 'white' : disabled ? '#D0D0D0' : '#171717',
                transition: 'all 100ms',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.background = '#FDF0F0'
                  e.currentTarget.style.color = '#801A00'
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#171717'
                }
              }}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}
