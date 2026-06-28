interface PageHeroProps {
  title: string
  subtitle?: string
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 pt-14 pb-10">
      <h1
        className="font-black text-[#171717] flex items-center gap-3 justify-center"
        style={{ fontSize: 'clamp(26px, 4vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
      >
        <span style={{ display: 'inline-block', width: 12, height: 12, background: '#801A00', borderRadius: 2, flexShrink: 0 }} />
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 font-light text-[#777777]" style={{ fontSize: 14, maxWidth: 480, lineHeight: 1.8 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
