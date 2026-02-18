import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type User = { username?: string; email?: string; role?: string }

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string>('(no results yet)')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({}),
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          navigate('/')
          return
        }
        setUser(data)
      })
      .catch(() => navigate('/'))
  }, [navigate])

  const runSearch = () => {
    if (!searchQuery.trim()) return
    fetch('/api/search?q=' + encodeURIComponent(searchQuery.trim()), { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setSearchResults(JSON.stringify(data, null, 2)))
      .catch((err) => setSearchResults('Error: ' + (err as Error).message))
  }

  if (user === null) {
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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', padding: '0.5rem 1rem', border: '1px solid var(--accent-cyan)', borderRadius: 6, textDecoration: 'none' }}>
                ADMIN PANEL
              </Link>
            )}
            <Link to="/" style={{ color: 'var(--purple-mid)', fontSize: '0.85rem', padding: '0.5rem 1rem', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 6, textDecoration: 'none' }}>
              ← SIGN OUT
            </Link>
          </div>
        </header>
        <div className="portal-card" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Welcome, {user.username ?? 'User'}.
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Good to see you here.</p>
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(139, 92, 246, 0.25)' }}>
            {user.username && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dim)', minWidth: '5rem' }}>Username</span>
                <span>{user.username}</span>
              </div>
            )}
            {user.email && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dim)', minWidth: '5rem' }}>Email</span>
                <span>{user.email}</span>
              </div>
            )}
            {user.role && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-dim)', minWidth: '5rem' }}>Role</span>
                <span>{user.role}</span>
              </div>
            )}
          </div>
        </div>
        <div className="portal-card">
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', marginBottom: '0.75rem' }}>User search (Part 5 – Data extraction)</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Try UNION injection: e.g. x&apos; UNION SELECT email, password FROM users --
          </p>
          <input
            type="text"
            className="portal-input"
            style={{ maxWidth: 400, marginBottom: '0.75rem' }}
            placeholder="e.g. test@example.com or injection payload"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="portal-btn" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={runSearch}>Search</button>
          <pre style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: '0.8rem', overflow: 'auto', color: 'var(--accent-cyan)' }}>{searchResults}</pre>
        </div>
      </div>
    </>
  )
}
