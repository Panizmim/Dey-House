import { SiteLayout } from '@/components/layouts/SiteLayout'

export default function SiteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteLayout>{children}</SiteLayout>
}
