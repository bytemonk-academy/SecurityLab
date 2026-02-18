import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type AdminData = {
  message?: string
  flag?: string
  users?: { id: number; username: string; email: string; role: string }[]
  error?: string
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/admin', { credentials: 'include' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: 'Request failed. Are you logged in?' }))
  }, [])

  if (data === null) {
    return (
      <div className="portal-page">
        <p style={{ color: 'var(--text-dim)' }}>Loading…</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="portal-logo" style={{ fontSize: '1.2rem', letterSpacing: '0.15em' }}>PORTAL</span>
          <Link
            to="/dashboard"
            style={{
              color: 'var(--purple-mid)',
              fontSize: '0.85rem',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            ← DASHBOARD
          </Link>
        </header>

        <div className="portal-card">
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.25rem', marginBottom: '1rem' }}>
            Admin Panel
          </h1>
          {data.error && (
            <p style={{ color: '#f87171', marginTop: '1rem' }}>{data.error}</p>
          )}
          {data.flag && (
            <div style={{ fontSize: '1rem', color: 'var(--accent-cyan)', padding: '1rem', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: 8, marginBottom: '1.5rem', wordBreak: 'break-all' }}>
              Flag: {data.flag}
            </div>
          )}
          {data.message && (
            <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>{data.message}</p>
          )}
          {data.users && data.users.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--text-dim)' }}>ID</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--text-dim)' }}>Username</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--text-dim)' }}>Email</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--text-dim)' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>{u.id}</td>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>{u.username}</td>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>{u.email}</td>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
