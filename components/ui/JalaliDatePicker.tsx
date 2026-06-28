'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft } from '@/components/ui/icons'
import {
  PERSIAN_MONTHS, PERSIAN_DAYS,
  daysInJalaliMonth, firstDayOfJalaliMonth,
  fromJalali, toJalali, toPersian, todayJalali,
  JalaliDate,
} from '@/lib/jalali'

interface Props {
  selected?: Date | null
  onSelect?: (date: Date) => void
  disablePast?: boolean
  multiSelect?: boolean
  selectedDates?: Date[]
  onSelectMultiple?: (dates: Date[]) => void
}

export default function JalaliDatePicker({
  selected, onSelect,
  disablePast = true,
  multiSelect = false,
  selectedDates = [],
  onSelectMultiple,
}: Props) {
  const today    = todayJalali()
  const initDate = selected ? toJalali(selected) : (selectedDates[0] ? toJalali(selectedDates[0]) : today)

  const [viewYear,  setViewYear]  = useState(initDate.jy)
  const [viewMonth, setViewMonth] = useState(initDate.jm)

  const selectedJ: JalaliDate | null = selected ? toJalali(selected) : null

  const selectedJDates: JalaliDate[] = selectedDates.map(toJalali)

  const daysCount = daysInJalaliMonth(viewYear, viewMonth)
  const firstDay  = firstDayOfJalaliMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const isPast = (jd: number) => {
    if (!disablePast) return false
    if (viewYear  < today.jy) return true
    if (viewYear  === today.jy && viewMonth  < today.jm) return true
    if (viewYear  === today.jy && viewMonth  === today.jm && jd < today.jd) return true
    return false
  }

  const isSelected = (jd: number) => {
    if (multiSelect) {
      return selectedJDates.some(d => d.jy === viewYear && d.jm === viewMonth && d.jd === jd)
    }
    return selectedJ?.jy === viewYear && selectedJ?.jm === viewMonth && selectedJ?.jd === jd
  }

  const isToday = (jd: number) =>
    today.jy === viewYear && today.jm === viewMonth && today.jd === jd

  const handleSelect = (jd: number) => {
    if (isPast(jd)) return
    const date = fromJalali(viewYear, viewMonth, jd)

    if (multiSelect && onSelectMultiple) {
      const already = selectedJDates.some(d => d.jy === viewYear && d.jm === viewMonth && d.jd === jd)
      if (already) {
        onSelectMultiple(selectedDates.filter((_, i) => {
          const j = selectedJDates[i]
          return !(j.jy === viewYear && j.jm === viewMonth && j.jd === jd)
        }))
      } else {
        onSelectMultiple([...selectedDates, date])
      }
    } else if (onSelect) {
      onSelect(date)
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        width: 320, background: 'white',
        borderRadius: 16, padding: 20,
        border: '1px solid #EFEFEF',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        userSelect: 'none',
      }}
    >
      {/* header ماه */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={nextMonth}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid #E5E5E5', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.color = '#801A00' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = 'inherit' }}
        >
          <ChevronRight size={14} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#171717' }}>
            {PERSIAN_MONTHS[viewMonth - 1]}
          </span>
          <span style={{ fontSize: 13, color: '#A0A0A0', fontWeight: 300, marginRight: 8 }}>
            {toPersian(viewYear)}
          </span>
        </div>

        <button
          onClick={prevMonth}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid #E5E5E5', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.color = '#801A00' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = 'inherit' }}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* روزهای هفته */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
        {PERSIAN_DAYS.map((day) => (
          <div
            key={day}
            style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#A0A0A0', paddingBottom: 4 }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* روزهای ماه */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

        {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
          const past = isPast(day)
          const sel  = isSelected(day)
          const tod  = isToday(day)

          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              disabled={past}
              style={{
                aspectRatio: '1', borderRadius: '50%',
                border: tod && !sel ? '1.5px solid #801A00' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: sel || tod ? 700 : 400,
                cursor: past ? 'not-allowed' : 'pointer',
                background: sel ? '#801A00' : 'transparent',
                color: sel ? 'white' : past ? '#D0D0D0' : tod ? '#801A00' : '#171717',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (!past && !sel) {
                  e.currentTarget.style.background = '#FDF0F0'
                  e.currentTarget.style.color = '#801A00'
                }
              }}
              onMouseLeave={(e) => {
                if (!past && !sel) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = tod ? '#801A00' : '#171717'
                }
              }}
            >
              {toPersian(day)}
            </button>
          )
        })}
      </div>

      {/* تاریخ‌های انتخابی */}
      {multiSelect && selectedDates.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
          <p style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 8, fontWeight: 600 }}>
            {toPersian(selectedDates.length)} روز انتخاب شده
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedDates
              .slice()
              .sort((a, b) => a.getTime() - b.getTime())
              .map((d, i) => {
                const j = toJalali(d)
                return (
                  <span key={i} style={{
                    fontSize: 11, background: '#FDF0F0', color: '#801A00',
                    padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                  }}>
                    {toPersian(j.jd)} {PERSIAN_MONTHS[j.jm - 1]}
                  </span>
                )
              })}
          </div>
        </div>
      )}

      {/* تاریخ انتخابی — حالت تکی */}
      {!multiSelect && selectedJ && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0', textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#801A00' }}>
            {toPersian(selectedJ.jd)} {PERSIAN_MONTHS[selectedJ.jm - 1]} {toPersian(selectedJ.jy)}
          </span>
        </div>
      )}
    </div>
  )
}
