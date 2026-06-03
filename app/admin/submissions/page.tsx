'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Download, Globe, LinkIcon, ChevronDown, ChevronUp, ExternalLink } from '@/components/ui/icons'
import toast from 'react-hot-toast'

type ArtworkItem = { url: string; description: string }

type Submission = {
  id: string
  name: string
  email: string
  phone: string
  artField: string
  bio: string | null
  status: string
  resumeUrl: string | null
  artworkUrls: string
  createdAt: string
}

const STATUS_FILTERS = [
  { value: 'all',       label: 'همه'          },
  { value: 'PENDING',   label: 'جدید'         },
  { value: 'REVIEWING', label: 'در حال بررسی' },
  { value: 'ACCEPTED',  label: 'پذیرفته'      },
  { value: 'REJECTED',  label: 'رد شده'       },
]

function statusInfo(s: string) {
  return s === 'PENDING'   ? { label: 'جدید',           bg: '#FEF3C7', color: '#92400E' }
    : s === 'REVIEWING'    ? { label: 'در حال بررسی',   bg: '#DBEAFE', color: '#1E40AF' }
    : s === 'ACCEPTED'     ? { label: 'پذیرفته',        bg: '#D1FAE5', color: '#065F46' }
    :                        { label: 'رد شده',          bg: '#FEE2E2', color: '#991B1B' }
}

function parseArtworks(raw: string): ArtworkItem[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((a): a is ArtworkItem => typeof a === 'object' && a !== null)
  } catch { return [] }
}

function parseBio(bio: string | null): { website?: string; instagram?: string } {
  if (!bio) return {}
  const parts = bio.split(' | ')
  const result: { website?: string; instagram?: string } = {}
  for (const p of parts) {
    if (p.startsWith('http') || p.includes('.')) result.website = p
    else if (p.startsWith('@') || p.includes('instagram')) result.instagram = p
    else result.website = p
  }
  return result
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('all')
  const [expanded,    setExpanded]    = useState<string | null>(null)
  const [lightbox,    setLightbox]    = useState<string | null>(null)

  async function fetchSubmissions() {
    setLoading(true)
    const params = filter !== 'all' ? `?status=${filter}` : ''
    const res  = await fetch(`/api/admin/submissions${params}`)
    const data = await res.json()
    setSubmissions(data)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchSubmissions() }, [filter])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success('وضعیت بروز شد'); fetchSubmissions() }
    else toast.error('خطا')
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>همکاری هنرمندان</h1>

      {/* فیلتر */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              background: filter === f.value ? '#801A00' : 'white',
              color:      filter === f.value ? 'white' : '#404040',
              border:     filter === f.value ? 'none' : '1px solid #EFEFEF',
              fontWeight: filter === f.value ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl" style={{ border: '1px solid #EFEFEF', padding: 20, height: 120 }} />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', padding: '48px 0' }}>هیچ درخواستی یافت نشد</p>
      ) : (
        <div className="flex flex-col gap-4">
          {submissions.map((s) => {
            const si       = statusInfo(s.status)
            const artworks = parseArtworks(s.artworkUrls)
            const links    = parseBio(s.bio)
            const isOpen   = expanded === s.id

            return (
              <div
                key={s.id}
                style={{
                  background: 'white', border: '1px solid #EFEFEF',
                  borderRadius: 12, overflow: 'hidden',
                }}
              >
                {/* ─── هدر کارت ─── */}
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* آواتار */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: '#801A00', color: 'white', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700,
                      }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#171717' }}>{s.name}</p>
                        <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 2 }}>
                          {s.artField} · {new Date(s.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      background: si.bg, color: si.color,
                      borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {si.label}
                    </span>
                  </div>

                  {/* اطلاعات تماس */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginBottom: 12, fontSize: 12, color: '#717171' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Mail size={12} />{s.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Phone size={12} />{s.phone}
                    </span>
                    {links.website && (
                      <a href={links.website.startsWith('http') ? links.website : `https://${links.website}`}
                        target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1E40AF', textDecoration: 'none' }}>
                        <Globe size={12} />{links.website}
                      </a>
                    )}
                    {links.instagram && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <LinkIcon size={12} />{links.instagram}
                      </span>
                    )}
                  </div>

                  {/* فایل‌ها و دکمه باز کردن */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {s.resumeUrl ? (
                        <a
                          href={s.resumeUrl} target="_blank" rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px', borderRadius: 6,
                            border: '1px solid #801A00', fontSize: 12,
                            color: '#801A00', textDecoration: 'none', fontWeight: 600,
                          }}
                        >
                          <Download size={12} />
                          دانلود پرتفولیو
                        </a>
                      ) : (
                        <span style={{
                          padding: '5px 12px', borderRadius: 6,
                          border: '1px solid #E5E5E5', fontSize: 12, color: '#B0B0B0',
                        }}>
                          بدون پرتفولیو
                        </span>
                      )}

                      {artworks.length > 0 && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : s.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 12px', borderRadius: 6,
                            border: '1px solid #E5E5E5', fontSize: 12,
                            color: '#404040', background: isOpen ? '#F5F5F5' : 'white',
                            cursor: 'pointer', fontFamily: 'YekanBakh, Tahoma, sans-serif',
                          }}
                        >
                          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {artworks.length} نمونه کار
                        </button>
                      )}
                    </div>

                    {/* دکمه‌های وضعیت */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => updateStatus(s.id, 'REVIEWING')}
                        style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: '#FEF3C7', color: '#92400E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        در بررسی
                      </button>
                      <button onClick={() => updateStatus(s.id, 'ACCEPTED')}
                        style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: '#D1FAE5', color: '#065F46', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        پذیرفته
                      </button>
                      <button onClick={() => updateStatus(s.id, 'REJECTED')}
                        style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: '#FEE2E2', color: '#991B1B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        رد شده
                      </button>
                    </div>
                  </div>
                </div>

                {/* ─── نمونه کارها (قابل باز شدن) ─── */}
                {isOpen && artworks.length > 0 && (
                  <div style={{ borderTop: '1px solid #F0F0F0', padding: '20px', background: '#FAFAFA' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#171717', marginBottom: 16 }}>
                      نمونه کارها ({artworks.length})
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                      {artworks.map((aw, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'white', border: '1px solid #EFEFEF',
                            borderRadius: 10, overflow: 'hidden',
                          }}
                        >
                          {/* تصویر */}
                          {aw.url ? (
                            <div
                              style={{ position: 'relative', paddingTop: '66%', background: '#F0F0F0', cursor: 'pointer' }}
                              onClick={() => setLightbox(aw.url)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={aw.url}
                                alt={`نمونه کار ${idx + 1}`}
                                style={{
                                  position: 'absolute', inset: 0,
                                  width: '100%', height: '100%', objectFit: 'cover',
                                }}
                              />
                              <div style={{
                                position: 'absolute', top: 8, left: 8,
                                background: 'rgba(0,0,0,0.5)', borderRadius: 4,
                                padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 4,
                              }}>
                                <ExternalLink size={10} color="white" />
                                <span style={{ fontSize: 10, color: 'white' }}>بزرگ‌نمایی</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              paddingTop: '30%', background: '#F5F5F5',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              position: 'relative',
                            }}>
                              <span style={{
                                position: 'absolute', inset: 0, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, color: '#B0B0B0',
                              }}>
                                بدون تصویر
                              </span>
                            </div>
                          )}
                          {/* توضیحات */}
                          <div style={{ padding: '12px 14px' }}>
                            <p style={{ fontSize: 12, color: '#555', fontWeight: 700, marginBottom: 4 }}>
                              نمونه کار {idx + 1}
                            </p>
                            {aw.description ? (
                              <p style={{ fontSize: 12, color: '#717171', lineHeight: 1.7 }}>
                                {aw.description}
                              </p>
                            ) : (
                              <p style={{ fontSize: 12, color: '#B0B0B0' }}>بدون توضیحات</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ─── لایت‌باکس ─── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="نمونه کار"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              objectFit: 'contain', borderRadius: 8,
              cursor: 'default',
            }}
          />
        </div>
      )}
    </div>
  )
}
