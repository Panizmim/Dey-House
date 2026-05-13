import { Logo } from '@/components/ui/Logo'
import { toPersianNum } from '@/lib/utils'

const stats = [
  { value: '+۱۰', label: 'سال فعالیت' },
  { value: `+${toPersianNum(500)}`, label: 'رویداد' },
  { value: `+${toPersianNum(120)}`, label: 'هنرمند' },
]

export function AboutSection() {
  return (
    <section className="bg-neutral-50 border-t border-b border-neutral-200">
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-[900] text-neutral-900 leading-snug">
              فضایی زنده برای هنر و فرهنگ
            </h2>
            <p className="text-base font-light text-neutral-500 leading-loose">
              خانه دی، ترکیبی از کافه، گالری و پلاتوهای تمرین است. فضایی که هنرمندان،
              مخاطبان و دوستداران فرهنگ را گرد هم می‌آورد. ما باور داریم که هنر باید
              در دسترس همه باشد و هر فضایی می‌تواند صحنه‌ای برای خلق باشد.
            </p>
            <div className="flex items-center gap-10 pt-6 border-t border-neutral-200">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-brand font-[900] text-2xl">{s.value}</span>
                  <span className="text-neutral-500 text-sm font-light">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-brand-light border border-brand-border flex items-center justify-center">
              <Logo size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
