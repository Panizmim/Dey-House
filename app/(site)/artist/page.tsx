import { buildMetadata } from '@/lib/seo'
import ArtistClient from './ArtistClient'

export const metadata = buildMetadata({
  title:       'همکاری هنرمندان با خانه دی | فراخوان نمایش آثار',
  description: 'شرایط همکاری هنری و نمایش آثار هنرمندان در گالری دیـ‌ده و خانه دی.',
  path:        '/artist',
})

export default function ArtistPage() {
  return <ArtistClient />
}
