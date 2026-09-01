import { SiteLayout } from '@/components/layouts/SiteLayout'
import { getSitePhones } from '@/lib/site-phones.server'

export default async function SiteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const phones = await getSitePhones()

  return <SiteLayout phones={phones}>{children}</SiteLayout>
}
