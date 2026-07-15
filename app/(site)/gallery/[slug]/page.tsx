import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/seo'
import GalleryDetailClient from './GalleryDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug    = decodeURIComponent(params.slug)
  const gallery = await db.gallery.findUnique({ where: { slug } })
  if (!gallery) return { title: 'اثر یافت نشد | گالری دیـ‌ده' }

  const description = (gallery.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 150)
    || `نمایش آثار ${gallery.artistName} در گالری دیـ‌ده، خانه دی`

  return buildMetadata({
    title:       `${gallery.title} - ${gallery.artistName} | گالری دیـ‌ده`,
    description,
    path:        `/gallery/${gallery.slug}`,
    type:        'article',
  })
}

export default function GalleryDetailPage() {
  return <GalleryDetailClient />
}
