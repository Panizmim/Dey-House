import PageHero from '@/components/ui/PageHero'

export const metadata = {
  title: 'ورکشاپ‌ها | خانه دی',
  description: 'ورکشاپ‌های خانه دی — فضایی برای یادگیری و خلق',
}

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero title="ورکشاپ‌ها" subtitle="به زودی" />
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <p style={{ fontSize: 16, color: '#717171', fontWeight: 300, lineHeight: 2 }}>
          اطلاعات ورکشاپ‌ها به زودی اینجا قرار می‌گیرد.
        </p>
      </div>
    </div>
  )
}
