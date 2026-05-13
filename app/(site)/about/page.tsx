import PageHero from '@/components/ui/PageHero'

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="خانه دی"
        subtitle="کافه‌گالری و فضای فرهنگی معاصر"
      />
      <div className="max-w-[860px] mx-auto px-8 py-16">
        <p className="text-[#404040]" style={{ fontSize: '15px', lineHeight: 2 }}>
          خانه دی فضایی است برای هنر، موسیقی، ادبیات و گفتگو — جایی که زندگی تازه‌ای که هنوز نزیسته‌ایم شکل می‌گیرد.
        </p>
      </div>
    </>
  )
}
