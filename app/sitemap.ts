import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE = 'https://www.deyhouse.com'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE}`,                        priority: 1,   changeFrequency: 'weekly' },
  { url: `${BASE}/events`,                 priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/gallery`,                priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/cafe`,                   priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/artist`,                 priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/about`,                  priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/contact`,                priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/booking`,                priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/booking/white-room`,     priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/booking/black-room-1`,   priority: 0.8, changeFrequency: 'weekly' },
  { url: `${BASE}/booking/black-room-2`,   priority: 0.8, changeFrequency: 'weekly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, galleries] = await Promise.all([
    db.event.findMany({
      where:  { isArchived: false },
      select: { slug: true, updatedAt: true },
    }),
    db.gallery.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ])

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url:             `${BASE}/events/${e.slug}`,
    lastModified:    e.updatedAt,
    priority:        0.7,
    changeFrequency: 'monthly',
  }))

  const galleryRoutes: MetadataRoute.Sitemap = galleries.map((g) => ({
    url:             `${BASE}/gallery/${g.slug}`,
    lastModified:    g.updatedAt,
    priority:        0.7,
    changeFrequency: 'monthly',
  }))

  return [...STATIC_ROUTES, ...eventRoutes, ...galleryRoutes]
}
