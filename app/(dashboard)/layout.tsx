import { DashboardSidebar }  from '@/components/dashboard/DashboardSidebar'
import { DashboardTopBar }   from '@/components/dashboard/DashboardTopBar'
import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>

      {/* Desktop */}
      <div className="hidden lg:flex gap-5 p-5 min-h-screen">
        <DashboardSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <DashboardTopBar />
          <main>{children}</main>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div style={{ padding: '12px 16px', background: '#F5F5F5' }}>
          <DashboardTopBar />
        </div>
        <main style={{ padding: '0 16px 88px' }}>{children}</main>
        <DashboardMobileNav />
      </div>

    </div>
  )
}
