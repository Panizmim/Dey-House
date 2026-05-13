interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  accentColor: string
}

export default function StatCard({ title, value, icon, accentColor }: StatCardProps) {
  return (
    <div style={{ border: '1px solid #EFEFEF', borderRadius: 8, padding: 20, background: 'white' }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 13, color: '#717171' }}>{title}</span>
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: '#171717' }}>{value}</p>
    </div>
  )
}
