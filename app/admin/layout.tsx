import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-6">{children}</div>
      </main>
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'YekanBakh, Tahoma, sans-serif', fontSize: 14 } }} />
    </div>
  )
}
