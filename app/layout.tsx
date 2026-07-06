import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.deyhouse.com'),
  title: 'خانه دی | Dey House',
  description: 'خانه دی، فضایی برای هنر، فرهنگ و خلاقیت — کافه‌گالری و پلاتوهای تمرین در تهران',
  other: {
    enamad: '1200843',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
