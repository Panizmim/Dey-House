import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title:       'درباره ما | خانه دی',
  description: 'خانه‌دی، یک خانه‌ی قدیمی‌ست که با احیائ دوباره‌اش، جانی تازه گرفته تا بستری برای جریان هنر، گفت‌وگو و تجربه‌های جمعی باشد.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero title="درباره ما" />

      <div className="max-w-[860px] mx-auto px-8 py-16">

        {/* ─── عکس کافه ─── */}
        <div
          className="relative w-full mb-12"
          style={{ aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden' }}
        >
          <Image
            src="/images/about/about-main.jpg"
            alt="خانه دی"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ─── متن ─── */}
        <p
          className="text-[#1a1a1a]"
          style={{
            fontSize:   'clamp(15px, 1.8vw, 18px)',
            fontWeight: 400,
            lineHeight: 2.2,
            textAlign:  'justify',
          }}
        >
          خانه‌دی، یک خانه‌ی قدیمی‌ست که با احیائ دوباره‌اش، جانی تازه گرفته تا بستری برای جریان هنر، گفت‌وگو و تجربه‌های جمعی باشد؛ جایی که کافه-‌گالری در کنار فضاهای دیگر، امکانِ مواجهه و زیستن در امتداد هنر را فراهم می‌کند. خانه دی در روزهایی متولد شد که ادامه‌دادن، خود شکلی از امید بود؛ و حالا تلاش می‌کند فضایی باشد برای روایت‌های تازه، برای دیدن، بودن و ادامه داشتن، برای زندگی تازه‌ای که هنوز نزیسته‌ایم.
        </p>

      </div>
    </>
  )
}
