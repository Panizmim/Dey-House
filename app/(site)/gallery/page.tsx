import { buildMetadata } from '@/lib/seo'
import GalleryClient from './GalleryClient'

export const metadata = buildMetadata({
  title:       'گالری دیـ‌ده | نمایشگاه هنر معاصر در خانه دی',
  description: 'گالری دیـ‌ده، فضای نمایش آثار هنرمندان معاصر و آوانگارد در خانه دی، تهران.',
  path:        '/gallery',
})

export default function GalleryPage() {
  return <GalleryClient />
}
