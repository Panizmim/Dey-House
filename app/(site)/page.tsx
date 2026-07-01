import { HeroSection }          from '@/components/sections/HeroSection'
import { AboutSection }         from '@/components/sections/AboutSection'
import { StudiosSection }       from '@/components/sections/StudiosSection'
import { EventsSection }        from '@/components/sections/EventsSection'
import { GallerySection }       from '@/components/sections/GallerySection'
import { ArtistSubmissionCTA }  from '@/components/sections/ArtistSubmissionCTA'
import { db }                   from '@/lib/db'

export const revalidate = 0

export default async function HomePage() {
  const FALLBACK_BANNERS = [
    { id: 'f1', imageUrl: '/images/hero/slide1.JPG', showText: true  },
    { id: 'f2', imageUrl: '/images/hero/slide2.JPG', showText: false },
    { id: 'f3', imageUrl: '/images/hero/slide3.JPG', showText: false },
  ]

  let banners: { id: string; imageUrl: string; showText: boolean }[] = []
  try {
    const rows = await db.heroBanner.findMany({
      where:   { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select:  { id: true, imageUrl: true, showText: true },
    })
    banners = rows.length > 0 ? rows : FALLBACK_BANNERS
  } catch {
    banners = FALLBACK_BANNERS
  }

  return (
    <>
      <HeroSection initialSlides={banners} />
      <AboutSection />
      <section id="studios">
        <StudiosSection />
      </section>
      <EventsSection />
      <GallerySection />
      <ArtistSubmissionCTA />
    </>
  )
}
