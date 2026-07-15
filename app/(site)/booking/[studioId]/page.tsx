import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import BookingClient from './BookingClient'
import { buildMetadata } from '@/lib/seo'

const STATIC_IDS = ['white-room', 'black-room-1', 'black-room-2'] as const

const STUDIO_META: Record<string, { title: string; description: string }> = {
  'white-room': {
    title:       'رزرو پلاتو دیـ‌وان | خانه دی',
    description: 'رزرو پلاتو دیـ‌وان در خانه دی؛ فضای مناسب تمرین، ورکشاپ و رویداد در تهران.',
  },
  'black-room-1': {
    title:       'رزرو پلاتو دیـ‌دار | خانه دی',
    description: 'رزرو پلاتو دیـ‌دار در خانه دی؛ فضای مناسب تمرین و اجرا در تهران.',
  },
  'black-room-2': {
    title:       'رزرو پلاتو دیـ‌جور | خانه دی',
    description: 'رزرو پلاتو دیـ‌جور در خانه دی؛ فضای مناسب تمرین و جلسات کوچک در تهران.',
  },
}

const getStudio = cache(async (studioId: string) => {
  return db.studio.findFirst({ where: { OR: [{ slug: studioId }, { id: studioId }] } })
})

export async function generateMetadata({ params }: { params: { studioId: string } }): Promise<Metadata> {
  const studioId = decodeURIComponent(params.studioId)
  const studio = await getStudio(studioId)
  if (!studio || studio.slug !== studioId) return {}

  const meta = STUDIO_META[studio.id] ?? {
    title:       `رزرو پلاتو ${studio.name} | خانه دی`,
    description: `رزرو پلاتو ${studio.name} در خانه دی؛ فضای مناسب تمرین در تهران.`,
  }
  return buildMetadata({ ...meta, path: `/booking/${studio.slug}` })
}

export default async function BookingPage({ params }: { params: { studioId: string } }) {
  const studioId = decodeURIComponent(params.studioId)
  const studio = await getStudio(studioId)

  if (!studio) notFound()
  if (studio.slug !== studioId) redirect(`/booking/${encodeURIComponent(studio.slug)}`)
  if (!STATIC_IDS.includes(studio.id as (typeof STATIC_IDS)[number])) notFound()

  return <BookingClient studioId={studio.id as (typeof STATIC_IDS)[number]} />
}
