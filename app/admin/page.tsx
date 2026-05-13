import { db } from '@/lib/db'
import StatCard from '@/components/admin/StatCard'
import { BookOpen, Users, Calendar, Palette } from 'lucide-react'

function statusLabel(s: string) {
  return s === 'PENDING' ? 'در انتظار' : s === 'CONFIRMED' ? 'تایید شده' : 'لغو شده'
}
function statusColor(s: string) {
  return s === 'PENDING' ? { bg: '#FEF3C7', color: '#92400E' }
    : s === 'CONFIRMED' ? { bg: '#D1FAE5', color: '#065F46' }
    : { bg: '#FEE2E2', color: '#991B1B' }
}
function subStatusLabel(s: string) {
  return s === 'PENDING' ? 'جدید' : s === 'REVIEWING' ? 'در بررسی' : s === 'ACCEPTED' ? 'پذیرفته' : 'رد شده'
}
function subStatusColor(s: string) {
  return s === 'PENDING' ? { bg: '#FEF3C7', color: '#92400E' }
    : s === 'REVIEWING' ? { bg: '#DBEAFE', color: '#1E40AF' }
    : s === 'ACCEPTED' ? { bg: '#D1FAE5', color: '#065F46' }
    : { bg: '#FEE2E2', color: '#991B1B' }
}

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ background: bg, color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  )
}

export default async function AdminPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [todayBookings, totalUsers, activeEvents, pendingSubmissions, recentBookings, recentSubmissions] =
    await Promise.all([
      db.booking.count({ where: { date: { gte: today, lt: tomorrow } } }),
      db.user.count(),
      db.event.count({ where: { isArchived: false } }),
      db.artistSubmission.count({ where: { status: 'PENDING' } }),
      db.booking.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true, studio: true } }),
      db.artistSubmission.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    ])

  return (
    <div>
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="رزروهای امروز"         value={todayBookings}       icon={<BookOpen size={20} />}  accentColor="#3B82F6" />
        <StatCard title="کل کاربران"            value={totalUsers}          icon={<Users size={20} />}     accentColor="#22C55E" />
        <StatCard title="رویدادهای فعال"        value={activeEvents}        icon={<Calendar size={20} />}  accentColor="#8B5CF6" />
        <StatCard title="درخواست‌های همکاری"   value={pendingSubmissions}   icon={<Palette size={20} />}   accentColor="#F97316" />
      </div>

      {/* جداول پایین */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* آخرین رزروها */}
        <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#171717', marginBottom: 16 }}>آخرین رزروها</p>
          {recentBookings.length === 0 ? (
            <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', padding: '24px 0' }}>هیچ رزروی ثبت نشده</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {['کاربر', 'پلاتو', 'تاریخ', 'وضعیت'].map((h) => (
                      <th key={h} style={{ padding: '8px 12px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => {
                    const sc = statusColor(b.status)
                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #FAFAFA' }}>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>{b.user.name}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>{b.studio.name}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>{new Date(b.date).toLocaleDateString('fa-IR')}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <Badge label={statusLabel(b.status)} bg={sc.bg} color={sc.color} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* درخواست‌های همکاری */}
        <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#171717', marginBottom: 16 }}>درخواست‌های همکاری جدید</p>
          {recentSubmissions.length === 0 ? (
            <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', padding: '24px 0' }}>هیچ درخواستی دریافت نشده</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentSubmissions.map((s) => {
                const sc = subStatusColor(s.status)
                return (
                  <div key={s.id} className="flex items-center justify-between" style={{ padding: '10px 0', borderBottom: '1px solid #FAFAFA' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>{s.name}</p>
                      <p style={{ fontSize: 12, color: '#717171' }}>{s.artField}</p>
                    </div>
                    <Badge label={subStatusLabel(s.status)} bg={sc.bg} color={sc.color} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
