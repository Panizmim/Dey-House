'use client'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T extends object>({
  columns, data, loading, emptyMessage = 'هیچ موردی یافت نشد',
}: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ padding: '12px 16px', fontSize: 12, color: '#717171', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '12px 16px' }}>
                    <div className="animate-pulse rounded" style={{ height: 16, background: '#F3F4F6', width: '80%' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', fontSize: 14, color: '#717171' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                style={{ borderBottom: '1px solid #EFEFEF' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '12px 16px', fontSize: 14, color: '#171717', whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
