import { HeroSection }          from '@/components/sections/HeroSection'
import { AboutSection }         from '@/components/sections/AboutSection'
import { StudiosSection }       from '@/components/sections/StudiosSection'
import { EventsSection }        from '@/components/sections/EventsSection'
import { CafePreview }          from '@/components/sections/CafePreview'
import { ArtistSubmissionCTA }  from '@/components/sections/ArtistSubmissionCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StudiosSection />
      <EventsSection />
      <CafePreview />
      <section className="py-20 px-8 bg-[#FAFAFA] border-t border-[#EFEFEF] border-b">
        <ArtistSubmissionCTA />
      </section>
    </>
  )
}
