import { HeroSection }          from '@/components/sections/HeroSection'
import { AboutSection }         from '@/components/sections/AboutSection'
import { StudiosSection }       from '@/components/sections/StudiosSection'
import { EventsSection }        from '@/components/sections/EventsSection'
import { GallerySection }       from '@/components/sections/GallerySection'
import { ArtistSubmissionCTA }  from '@/components/sections/ArtistSubmissionCTA'
import { db }                   from '@/lib/db'

export default async function HomePage() {
  const banners = await db.heroBanner.findMany({
    where:   { isActive: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select:  { id: true, imageUrl: true, showText: true },
  })

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
