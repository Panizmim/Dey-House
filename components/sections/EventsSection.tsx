'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft } from '@/components/ui/icons'

const events = [
  {
    id: '1',
    title: 'نمایشگاه آثار هنرمندان معاصر',
    type: 'نمایشگاه',
    date: '۱۵ خرداد ۱۴۰۴',
    time: '۱۶:۰۰ تا ۲۱:۰۰',
    location: 'گالری خانه دی',
    description:
      'گردهمایی آثار ۱۲ هنرمند برجسته در گالری خانه دی — تجربه‌ای از نقاشی، عکاسی و چیدمان معاصر.',
    gradient: 'linear-gradient(135deg, #c8d4b8, #8fa87a)',
  },
  {
    id: '2',
    title: 'تئاتر تجربی «آستانه»',
    type: 'تئاتر',
    date: '۲۲ خرداد ۱۴۰۴',
    time: '۱۹:۳۰',
    location: 'پلاتو اصلی',
    description: 'یک اجرای تئاتری تجربی که مرزهای فضا و زمان را به چالش می‌کشد.',
    gradient: 'linear-gradient(135deg, #d4c8e8, #9882c8)',
  },
  {
    id: '3',
    title: 'شب شعر معاصر',
    type: 'ادبی',
    date: '۰۵ تیر ۱۴۰۴',
    time: '۲۰:۰۰',
    location: 'سالن اصلی',
    description: 'شبی با صدای شاعران معاصر ایران در فضای صمیمی خانه دی.',
    gradient: 'linear-gradient(135deg, #c8e8d4, #72b88a)',
  },
]

export function EventsSection() {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + events.length) % events.length), [])
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % events.length), [])

  const event = events[current]

  return (
    <section className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-20">
      {/* هدر */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-[800] text-neutral-900">رویدادها</h2>
        <Link
          href="/events"
          className="text-sm text-neutral-500 border border-neutral-200 rounded-lg px-4 py-2 hover:border-brand hover:text-brand transition-colors duration-200"
        >
          مشاهده همه
        </Link>
      </div>

      {/* اسلایدر */}
      <div className="flex gap-8 items-stretch min-h-[420px]">
        {/* تصویر — راست ۵۵٪ */}
        <div className="w-[55%] flex-shrink-0">
          <div
            className="w-full rounded-lg overflow-hidden"
            style={{ aspectRatio: '3/4', maxHeight: '520px', background: event.gradient }}
          />
        </div>

        {/* اطلاعات — چپ ۴۵٪ */}
        <div className="flex-1 flex flex-col justify-center gap-4 py-4">
          {/* badge نوع */}
          <span
            className="self-start text-[12px] font-[700] px-[10px] py-[3px] rounded-sm"
            style={{ border: '1px solid #8B1E1E', color: '#8B1E1E' }}
          >
            {event.type}
          </span>

          {/* عنوان */}
          <h3 className="font-[900] text-neutral-900 leading-snug" style={{ fontSize: '28px' }}>
            {event.title}
          </h3>

          {/* جزئیات */}
          <div className="flex flex-col gap-2 text-neutral-500" style={{ fontSize: '14px' }}>
            <span className="flex items-center gap-2">
              <Calendar size={15} className="flex-shrink-0" />
              {event.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={15} className="flex-shrink-0" />
              {event.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="flex-shrink-0" />
              {event.location}
            </span>
          </div>

          {/* توضیحات */}
          <p
            className="text-neutral-500 leading-loose overflow-hidden"
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {event.description}
          </p>

          <hr style={{ borderColor: '#EFEFEF' }} />

          {/* navigation */}
          <div className="flex items-center gap-3 mt-auto">
            <button
              onClick={next}
              aria-label="رویداد بعدی"
              className="flex items-center justify-center bg-white hover:bg-neutral-50 transition-colors"
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #EFEFEF',
                borderRadius: '8px',
              }}
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={prev}
              aria-label="رویداد قبلی"
              className="flex items-center justify-center bg-white hover:bg-neutral-50 transition-colors"
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #EFEFEF',
                borderRadius: '8px',
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* dots */}
            <div className="flex items-center gap-2 mr-2">
              {events.map((e, idx) => (
                <button
                  key={e.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`رویداد ${idx + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === current ? '20px' : '8px',
                    height: '8px',
                    background: idx === current ? '#171717' : '#D4D4D4',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
