import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import BookingClient from './BookingClient'

const STATIC_IDS = ['white-room', 'black-room-1', 'black-room-2'] as const

export default async function BookingPage({ params }: { params: { studioId: string } }) {
  const studioId = decodeURIComponent(params.studioId)
  const studio = await db.studio.findFirst({
    where: { OR: [{ slug: studioId }, { id: studioId }] },
  })

  if (!studio) notFound()
  if (studio.slug !== studioId) redirect(`/booking/${encodeURIComponent(studio.slug)}`)
  if (!STATIC_IDS.includes(studio.id as (typeof STATIC_IDS)[number])) notFound()

  return <BookingClient studioId={studio.id as (typeof STATIC_IDS)[number]} />
}
