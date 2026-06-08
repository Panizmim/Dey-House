interface PageHeroProps {
  title: string
  subtitle?: string
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center text-center px-8 h-[260px] lg:h-[320px]"
      style={{ background: '#801A00' }}
    >
      {/* صندلی تزئینی */}
      <div className="absolute bottom-0 right-0 w-full lg:w-[65%] max-w-[640px] h-full pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/chair.png"
          alt=""
          className="w-full h-full object-contain object-right-bottom"
          style={{ opacity: 0.15, filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* محتوا */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="font-black text-white"
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="mt-3 font-light"
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '480px',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* خط پایین */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}
      />
    </div>
  )
}
