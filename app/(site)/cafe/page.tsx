import { buildMetadata } from '@/lib/seo'
import CafeClient from './CafeClient'

export const metadata = buildMetadata({
  title:       'کافه خانه دی | کافه‌گالری در تهران',
  description: 'کافه خانه دی، فضایی دنج برای نوشیدن قهوه در دل یک گالری هنری در تهران.',
  path:        '/cafe',
})

export default function CafePage() {
  return <CafeClient />
}
