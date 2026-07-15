import { buildMetadata } from '@/lib/seo'
import EventsClient from './EventsClient'

export const metadata = buildMetadata({
  title:       'رویدادها و برنامه‌های خانه دی در تهران',
  description: 'تقویم رویدادها، نمایشگاه‌ها و برنامه‌های فرهنگی و هنری خانه دی در تهران.',
  path:        '/events',
})

export default function EventsPage() {
  return <EventsClient />
}
