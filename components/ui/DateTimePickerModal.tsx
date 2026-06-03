'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, ChevronDown } from '@/components/ui/icons'
import {
  PERSIAN_MONTHS, PERSIAN_DAYS,
  daysInJalaliMonth, firstDayOfJalaliMonth,
  fromJalali, toPersian, todayJalali,
  TIME_SLOTS,
} from '@/lib/jalali'

const persianTimeToAscii = (persian: string): string => {
  const ascii = persian.replace(/[۰-۹]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x30)
  )
  const [h, m] = ascii.split(':')
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

interface JD { jy: number; jm: number; jd: number }

interface Props {
  open: boolean
  onClose: () => void
  studioId?: string
  mode?: 'single' | 'range'
  onConfirm: (result: {
    startDate: Date
    endDate: Date | null
    startTime: string | null
    endTime: string | null
  }) => void
}

const BRAND    = '#801A00'
const RANGE_BG = 'rgba(139,30,30,0.10)'
const CELL_H   = 36
const BTN_SIZE = 28

export default function DateTimePickerModal({ open, onClose, studioId, mode = 'range', onConfirm }: Props) {
  const today = todayJalali()

  const [leftYear, setLeftYear]   = useState(today.jy)
  const [leftMonth, setLeftMonth] = useState(today.jm)

  const rightYear     = leftYear
  const rightMonth    = leftMonth
  const leftNextMonth = leftMonth === 12 ? 1 : leftMonth + 1
  const leftNextYear  = leftMonth === 12 ? leftYear + 1 : leftYear

  const [hoverDate, setHoverDate] = useState<JD | null>(null)
  const [startDate, setStartDate] = useState<JD | null>(null)
  const [endDate, setEndDate]     = useState<JD | null>(null)
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')

  const [startTime, setStartTime]         = useState<string | null>(null)
  const [endTime, setEndTime]             = useState<string | null>(null)
  const [showStartList, setShowStartList] = useState(false)
  const [showEndList, setShowEndList]     = useState(false)
  const [busyDaysMap, setBusyDaysMap]     = useState<Record<string, number[]>>({})
  const [bookedSlots, setBookedSlots]     = useState<Set<string>>(new Set())
  const fetchedMonths                     = useRef<Set<string>>(new Set())

  const isMultiDay = !!(startDate && endDate &&
    !(startDate.jy === endDate.jy && startDate.jm === endDate.jm && startDate.jd === endDate.jd))

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!studioId || !open) return
    const months = isMobile
      ? [{ y: rightYear, m: rightMonth }]
      : [{ y: rightYear, m: rightMonth }, { y: leftNextYear, m: leftNextMonth }]
    months.forEach(({ y, m }) => {
      const key = `${y}-${m}`
      if (fetchedMonths.current.has(key)) return
      fetchedMonths.current.add(key)
      fetch(`/api/bookings/busy-days?studioId=${studioId}&year=${y}&month=${m}`)
        .then((r) => r.json())
        .then((data: { busyDays?: number[] }) => {
          if (Array.isArray(data.busyDays)) {
            setBusyDaysMap((p) => ({ ...p, [key]: data.busyDays as number[] }))
          }
        })
        .catch(() => { fetchedMonths.current.delete(key) })
    })
  }, [studioId, open, leftYear, leftMonth, isMobile])

  useEffect(() => {
    if (!studioId || !startDate || mode !== 'single') {
      setBookedSlots(new Set())
      return
    }
    const g = fromJalali(startDate.jy, startDate.jm, startDate.jd)
    const dateStr = [
      g.getFullYear(),
      String(g.getMonth() + 1).padStart(2, '0'),
      String(g.getDate()).padStart(2, '0'),
    ].join('-')
    fetch(`/api/bookings/slots?studioId=${studioId}&date=${dateStr}`)
      .then((r) => r.json())
      .then((data: { slots?: Array<{ time: string; available: boolean }> }) => {
        if (Array.isArray(data.slots)) {
          setBookedSlots(new Set(data.slots.filter((s) => !s.available).map((s) => s.time)))
        }
      })
      .catch(() => {})
  }, [studioId, startDate, mode])

  if (!open) return null

  const compareJD = (a: JD, b: JD) => {
    if (a.jy !== b.jy) return a.jy - b.jy
    if (a.jm !== b.jm) return a.jm - b.jm
    return a.jd - b.jd
  }

  const isPast = (jy: number, jm: number, jd: number) => {
    if (jy < today.jy) return true
    if (jy === today.jy && jm < today.jm) return true
    if (jy === today.jy && jm === today.jm && jd < today.jd) return true
    return false
  }

  const getEffectiveEnd = () => endDate || hoverDate

  const isInRange = (jy: number, jm: number, jd: number) => {
    if (!startDate) return false
    const end = getEffectiveEnd()
    if (!end) return false
    if (compareJD(startDate, end) >= 0) return false
    const d: JD = { jy, jm, jd }
    return compareJD(d, startDate) >= 0 && compareJD(d, end) <= 0
  }

  const isStart = (jy: number, jm: number, jd: number) =>
    startDate?.jy === jy && startDate?.jm === jm && startDate?.jd === jd

  const isEnd = (jy: number, jm: number, jd: number) =>
    endDate?.jy === jy && endDate?.jm === jm && endDate?.jd === jd

  const handleDayClick = (jy: number, jm: number, jd: number) => {
    if (isPast(jy, jm, jd)) return
    const clicked: JD = { jy, jm, jd }
    setShowStartList(false)
    setShowEndList(false)
    if (mode === 'single') {
      setStartDate(clicked)
      setEndDate(null)
      setStartTime(null)
      setEndTime(null)
      return
    }
    if (selecting === 'start' || !startDate) {
      setStartDate(clicked); setEndDate(null)
      setSelecting('end'); setStartTime(null); setEndTime(null)
    } else {
      if (compareJD(clicked, startDate) <= 0) {
        setStartDate(clicked); setEndDate(null); setSelecting('end')
        setStartTime(null); setEndTime(null)
      } else {
        setEndDate(clicked); setSelecting('start')
      }
    }
  }

  const prevMonthNav = () => {
    if (leftMonth === 1) { setLeftMonth(12); setLeftYear((y) => y - 1) }
    else setLeftMonth((m) => m - 1)
  }
  const nextMonthNav = () => {
    if (leftMonth === 12) { setLeftMonth(1); setLeftYear((y) => y + 1) }
    else setLeftMonth((m) => m + 1)
  }

  const handleConfirm = () => {
    if (!startDate) return
    const sd = fromJalali(startDate.jy, startDate.jm, startDate.jd)
    const ed = endDate ? fromJalali(endDate.jy, endDate.jm, endDate.jd) : null
    onConfirm({ startDate: sd, endDate: ed, startTime: isMultiDay ? null : startTime, endTime: isMultiDay ? null : endTime })
    onClose()
  }

  const canConfirm = !!startDate && (isMultiDay || (!!startTime && !!endTime))

  /* ── time picker: closed by default, opens on click (accordion) ── */
  const renderTimePicker = (
    label: string,
    selected: string | null,
    onSelect: (t: string) => void,
    showList: boolean,
    onToggle: () => void,
    disabled?: boolean,
    bookedTimes?: Set<string>,
  ) => {
    const isEndPicker = label === 'ساعت پایان'
    const slots = isEndPicker && startTime
      ? TIME_SLOTS.filter((s) => TIME_SLOTS.indexOf(s) > TIME_SLOTS.indexOf(startTime))
      : TIME_SLOTS

    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* toggle button — shows selected value, opens/closes list */}
        <button
          onClick={disabled ? undefined : onToggle}
          disabled={!!disabled}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            border: `1.5px solid ${showList ? BRAND : selected ? 'rgba(139,30,30,0.35)' : '#E5E5E5'}`,
            background: selected ? '#FDF8F8' : showList ? 'white' : '#F8F9FA',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            textAlign: 'right', opacity: disabled ? 0.45 : 1,
            transition: 'all 150ms', marginBottom: showList ? 6 : 0,
            fontFamily: 'YekanBakh, Tahoma, sans-serif',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#A0A0A0', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 15, fontWeight: selected ? 800 : 400, color: selected ? BRAND : '#B8B8B8' }}>
              {selected || '--:--'}
            </p>
          </div>
          <ChevronDown
            size={14}
            color={showList ? BRAND : '#B0B0B0'}
            style={{ transform: showList ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}
          />
        </button>

        {/* slot list — inside modal, no position tricks */}
        {showList && (
          <div style={{ border: '1.5px solid #EBEBEB', borderRadius: 10, maxHeight: 150, overflowY: 'auto', overscrollBehavior: 'contain', background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.07)' }}>
            {slots.map((slot) => {
              const asciiTime = persianTimeToAscii(slot)
              const isBooked  = !!(bookedTimes?.has(asciiTime))
              const isSel     = selected === slot && !isBooked
              return (
                <button
                  key={slot}
                  onClick={() => { if (!isBooked) onSelect(slot) }}
                  disabled={isBooked}
                  style={{
                    width: '100%', padding: '9px 14px',
                    border: 'none', borderBottom: '1px solid #F5F5F5',
                    fontSize: 13, cursor: isBooked ? 'not-allowed' : 'pointer',
                    background: isSel ? BRAND : isBooked ? '#FEF2F2' : 'white',
                    color: isSel ? 'white' : isBooked ? '#C08080' : '#1a1a2e',
                    fontWeight: isSel ? 700 : 400,
                    fontFamily: 'YekanBakh, Tahoma, sans-serif',
                    transition: 'background 100ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textAlign: 'right',
                  }}
                  onMouseEnter={(e) => { if (!isSel && !isBooked) { e.currentTarget.style.background = '#FDF0F0'; e.currentTarget.style.color = BRAND } }}
                  onMouseLeave={(e) => { if (!isSel && !isBooked) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1a2e' } }}
                >
                  <span style={{ textDecoration: isBooked ? 'line-through' : 'none' }}>{slot}</span>
                  {isBooked && <span style={{ fontSize: 10, color: '#C07070', fontWeight: 700, flexShrink: 0 }}>پر</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderMonth = (jy: number, jm: number, fullWidth = false) => {
    const daysCount    = daysInJalaliMonth(jy, jm)
    const firstDay     = firstDayOfJalaliMonth(jy, jm)
    const effectiveEnd = getEffectiveEnd()
    const hasRange     = !!(startDate && effectiveEnd && compareJD(startDate, effectiveEnd) < 0)

    return (
      <div style={{ width: fullWidth ? '100%' : 240, flexShrink: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>{PERSIAN_MONTHS[jm - 1]}</span>
          <span style={{ fontSize: 12, fontWeight: 300, color: '#A0A0A0', marginRight: 6 }}>{toPersian(jy)}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
          {PERSIAN_DAYS.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#B0B0B0', paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} style={{ height: CELL_H }} />
          ))}
          {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
            const past    = isPast(jy, jm, day)
            const start   = isStart(jy, jm, day)
            const end     = isEnd(jy, jm, day)
            const inRange = isInRange(jy, jm, day)
            const isToday = today.jy === jy && today.jm === jm && today.jd === day
            const isBusy  = busyDaysMap[`${jy}-${jm}`]?.includes(day) ?? false

            const showStartBand = start && hasRange
            const showEndBand   = end && hasRange
            const bandTop = (CELL_H - BTN_SIZE) / 2

            return (
              <div
                key={day}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: CELL_H, cursor: past ? 'default' : 'pointer' }}
                onMouseEnter={() => { if (mode !== 'single' && selecting === 'end' && startDate && !past) setHoverDate({ jy, jm, jd: day }) }}
                onMouseLeave={() => setHoverDate(null)}
                onClick={() => handleDayClick(jy, jm, day)}
              >
                {inRange && !start && !end && (
                  <div style={{ position: 'absolute', top: bandTop, bottom: bandTop, left: 0, right: 0, background: RANGE_BG }} />
                )}
                {showStartBand && (
                  <div style={{ position: 'absolute', top: bandTop, bottom: bandTop, left: 0, right: '50%', background: RANGE_BG, borderRadius: '0 4px 4px 0' }} />
                )}
                {showEndBand && (
                  <div style={{ position: 'absolute', top: bandTop, bottom: bandTop, right: 0, left: '50%', background: RANGE_BG, borderRadius: '4px 0 0 4px' }} />
                )}
                <button
                  disabled={past}
                  style={{
                    position: 'relative', zIndex: 1,
                    width: BTN_SIZE, height: BTN_SIZE,
                    borderRadius: (start || end) ? 7 : '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: (start || end || isToday) ? 700 : 400,
                    border: (isToday && !start && !end) ? `2px solid ${BRAND}` : 'none',
                    background: (start || end) ? BRAND : 'transparent',
                    color: (start || end) ? 'white' : past ? '#D0D0D0' : isToday ? BRAND : inRange ? BRAND : '#1a1a2e',
                    cursor: past ? 'not-allowed' : 'pointer',
                    transition: 'background 100ms',
                    fontFamily: 'YekanBakh, Tahoma, sans-serif',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { if (!past && !start && !end) e.currentTarget.style.background = '#F0F0F0' }}
                  onMouseLeave={(e) => { if (!start && !end) e.currentTarget.style.background = 'transparent' }}
                >
                  {toPersian(day)}
                </button>
                {isBusy && !past && (
                  <div style={{
                    position: 'absolute', bottom: 3, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%', zIndex: 1,
                    background: (start || end) ? 'rgba(255,255,255,0.75)' : '#D97070',
                    pointerEvents: 'none',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* modal */}
      <div
        dir="rtl"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101, background: 'white', borderRadius: 24,
          width: isMobile ? '94vw' : '580px', maxWidth: '92vw',
          maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── header ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid #F0F0F0' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a2e', marginBottom: 2 }}>انتخاب تاریخ و ساعت</h2>
            <p style={{ fontSize: 12, color: '#A0A0A0', fontWeight: 300 }}>تاریخ رزرو فضا را انتخاب کنید</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid #E5E5E5', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'border-color 150ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5' }}
          >
            <X size={14} color="#717171" />
          </button>
        </div>

        {/* ─── calendar card ─── */}
        <div style={{ margin: '16px 20px 0', border: '1.5px solid #EBEBEB', borderRadius: 16, padding: '14px 20px 18px' }}>
          {/* nav — direction:ltr so arrows stay physically correct */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, direction: 'ltr' }}>
            <button onClick={nextMonthNav} style={navBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.color = '#717171' }}>
              <ChevronLeft size={15} />
            </button>
            <button onClick={prevMonthNav} style={navBtnStyle}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.color = '#717171' }}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* calendar — one month on mobile, two on desktop */}
          {isMobile ? (
            <div style={{ width: '100%' }}>
              {renderMonth(rightYear, rightMonth, true)}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {renderMonth(rightYear, rightMonth)}
              <div style={{ width: 1, background: '#EBEBEB', flexShrink: 0, alignSelf: 'stretch', margin: '0 10px' }} />
              {renderMonth(leftNextYear, leftNextMonth)}
            </div>
          )}
        </div>

        {/* ─── time picker — single day only ─── */}
        {startDate && !isMultiDay && (
          <div style={{ padding: '14px 20px 4px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>انتخاب ساعت</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {renderTimePicker(
                'ساعت شروع', startTime,
                (t) => { setStartTime(t); setEndTime(null); setShowStartList(false) },
                showStartList,
                () => { setShowStartList((v) => !v); setShowEndList(false) },
                undefined,
                bookedSlots,
              )}
              {renderTimePicker(
                'ساعت پایان', endTime,
                (t) => { setEndTime(t); setShowEndList(false) },
                showEndList,
                () => { setShowEndList((v) => !v); setShowStartList(false) },
                !startTime,
              )}
            </div>
          </div>
        )}

        {/* multi-day note */}
        {isMultiDay && mode === 'range' && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#FDF0F0', borderRadius: 10, border: `1px solid rgba(139,30,30,0.15)` }}>
            <p style={{ fontSize: 12, color: BRAND, fontWeight: 500, textAlign: 'right' }}>
              برای رزرو چند روزه، نیازی به انتخاب ساعت نیست. تیم خانه دی با شما هماهنگ خواهد کرد.
            </p>
          </div>
        )}

        {/* ─── footer ─── */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px 20px', marginTop: 8 }}>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
              background: BRAND, color: 'white', fontSize: 14, fontWeight: 700,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.38,
              transition: 'opacity 200ms, background 150ms',
              fontFamily: 'YekanBakh, Tahoma, sans-serif',
            }}
            onMouseEnter={(e) => { if (canConfirm) e.currentTarget.style.background = '#A02424' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = BRAND }}
          >
            تایید و ادامه
          </button>
          <button
            onClick={() => {
              setStartDate(null); setEndDate(null)
              setStartTime(null); setEndTime(null)
              setSelecting('start')
              setShowStartList(false); setShowEndList(false)
            }}
            style={{
              padding: '12px 20px', borderRadius: 12,
              border: '1.5px solid #E5E5E5', background: 'white',
              fontSize: 13, color: '#717171', cursor: 'pointer',
              transition: 'all 150ms', fontFamily: 'YekanBakh, Tahoma, sans-serif',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#717171' }}
          >
            پاک کردن
          </button>
        </div>
      </div>
    </>
  )
}

const navBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: '50%',
  border: '1.5px solid #E0E0E0', background: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#717171', transition: 'all 150ms',
}
