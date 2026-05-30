import { HeroSection }          from '@/components/sections/HeroSection'
import { AboutSection }         from '@/components/sections/AboutSection'
import { StudiosSection }       from '@/components/sections/StudiosSection'
import { EventsSection }        from '@/components/sections/EventsSection'
import { GallerySection }       from '@/components/sections/GallerySection'
import { CafePreview }          from '@/components/sections/CafePreview'
import { ArtistSubmissionCTA }  from '@/components/sections/ArtistSubmissionCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <section id="studios">
        <StudiosSection />
      </section>
      <EventsSection />
      <GallerySection />
      <CafePreview />
      <ArtistSubmissionCTA />
    </>
  )
}
