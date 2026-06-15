import Image from 'next/image'
import Link from 'next/link'

export function ArtistSubmissionCTA() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="grid items-center gap-16 grid-cols-1 md:grid-cols-2"
        >

          {/* ستون راست — متن */}
          <div>
            <h2
              className="text-[#171717] font-black mb-8"
              style={{
                fontSize:      'clamp(20px, 2.2vw, 28px)',
                letterSpacing: '-0.02em',
                lineHeight:    1.2,
              }}
            >
              هنرمند دیــ ده شوید
            </h2>

            <p
              className="text-[#404040] mb-10"
              style={{
                fontSize:   'clamp(14px, 1.5vw, 17px)',
                fontWeight: 400,
                lineHeight: 2.0,
              }}
            >
              دیــده همواره در جست‌وجوی نگاه‌های تازه، روایت‌های متفاوت و هنرمندانی‌ست که می‌خواهند اثرشان فراتر از فضای نمایشگاهی، وارد گفت‌وگوی روزمره با مخاطب شود.
              <br /><br />
              اگر احساس می‌کنید آثار شما می‌توانند با فضای دیــ ده و مخاطبان آن ارتباط برقرار کنند، خوشحال می‌شویم با شما آشنا شویم تا نگاه خود را با دیگران به اشتراک بگذارید و بخشی از جریان هنر معاصر دیــ ده باشید.
            </p>

            <Link
              href="/artist"
              className="inline-block px-8 py-4 text-white font-bold
                         transition-all duration-200 hover:opacity-90
                         hover:-translate-y-px"
              style={{
                background:   '#801A00',
                borderRadius: '8px',
                fontSize:     '15px',
              }}
            >
              همکاری هنری با خانه دی
            </Link>
          </div>

          {/* ستون چپ — عکس (در موبایل اول نمایش داده می‌شود) */}
          <div
            className="relative overflow-hidden order-first md:order-last"
            style={{ borderRadius: '12px', aspectRatio: '4/3' }}
          >
            <Image
              src="/images/artist-cta.jpg"
              alt="همکاری هنری با خانه دی"
              fill
              className="object-cover"
            />
            {/* fallback gradient */}
            <div
              className="absolute inset-0 -z-10"
              style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #e8c9a0 100%)' }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
