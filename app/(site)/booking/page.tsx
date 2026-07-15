import PageHero from '@/components/ui/PageHero'
import { StudiosSection } from '@/components/sections/StudiosSection'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title:       'رزرو پلاتو و فضای تمرین در خانه دی | تهران',
  description: 'اجاره و رزرو پلاتوهای تمرین خانه دی برای تمرین، ورکشاپ و رویداد در تهران.',
  path:        '/booking',
})

export default function BookingOverviewPage() {
  return (
    <>
      <PageHero title="رزرو پلاتو" subtitle="فضای مناسب تمرین، ورکشاپ و رویداد خود را انتخاب کنید" />
      <StudiosSection />
    </>
  )
}
