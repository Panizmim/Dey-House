export function AboutSection() {
  return (
    <section
      className="bg-neutral-50 border-t border-b border-neutral-200"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* ─── صندلی + خط ─── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/chair.png"
        alt=""
        style={{
          position:      'absolute',
          top:           '50%',
          left:          0,
          transform:     'translateY(-50%)',
          width:         '38%',
          height:        'auto',
          opacity:       0.18,
          mixBlendMode:  'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* ─── محتوا ─── */}
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12" style={{ position: 'relative', zIndex: 1, paddingTop: 88, paddingBottom: 88 }}>
        <div style={{ maxWidth: 600 }}>

          <h2
            style={{
              fontSize:      'clamp(28px, 3.2vw, 40px)',
              fontWeight:    900,
              color:         '#171717',
              letterSpacing: '-0.025em',
              lineHeight:    1.15,
              marginBottom:  28,
            }}
          >
            خانه دی
          </h2>

          <div
            style={{
              width:        48,
              height:       2,
              background:   '#8B1E1E',
              marginBottom: 28,
            }}
          />

          <p
            style={{
              fontSize:   'clamp(14px, 1.5vw, 16px)',
              fontWeight: 300,
              color:      '#717171',
              lineHeight: 2.3,
            }}
          >
            خانه‌دی، یک خانه‌ی قدیمی‌ست که با احیائ دوباره‌اش، جانی تازه گرفته تا بستری برای جریان هنر، گفت‌وگو و تجربه‌های جمعی باشد؛ جایی که کافه-‌گالری در کنار فضاهای دیگر، امکانِ مواجهه و زیستن در امتداد هنر را فراهم می‌کند. خانه دی در روزهایی متولد شد که ادامه‌دادن، خود شکلی از امید بود؛ و حالا تلاش می‌کند فضایی باشد برای روایت‌های تازه، برای دیدن، بودن و ادامه داشتن، برای زندگی تازه‌ای که هنوز نزیسته‌ایم.
          </p>

        </div>
      </div>
    </section>
  )
}
