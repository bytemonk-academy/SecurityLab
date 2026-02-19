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
      <div className="dashboard-layout">
        <header className="dashboard-header">
          <span className="portal-logo dashboard-logo">PORTAL</span>
          <div className="dashboard-nav">
            {user.role === 'admin' && (
              <Link to="/admin" className="dashboard-link dashboard-link-admin">ADMIN PANEL</Link>
            )}
            <Link to="/" className="dashboard-link">← SIGN OUT</Link>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="portal-card dashboard-welcome">
            <h1 className="dashboard-title">Welcome, {user.username ?? 'User'}.</h1>
            <p className="dashboard-subtitle">Good to see you here.</p>
            <div className="dashboard-credentials">
              {user.username && (
                <div className="dashboard-row">
                  <span className="dashboard-label">Username</span>
                  <span className="dashboard-value">{user.username}</span>
                </div>
              )}
              {user.email && (
                <div className="dashboard-row">
                  <span className="dashboard-label">Email</span>
                  <span className="dashboard-value">{user.email}</span>
                </div>
              )}
              {user.role && (
                <div className="dashboard-row">
                  <span className="dashboard-label">Role</span>
                  <span className="dashboard-value">{user.role}</span>
                </div>
              )}
            </div>
          </section>

          <section className="portal-card dashboard-search-card">
            <h2 className="dashboard-search-title">Search users</h2>
            <p className="dashboard-search-desc">Find team members by email address.</p>
            <div className="dashboard-search-row">
              <input
                type="text"
                className="portal-input dashboard-search-input"
                placeholder="Search by email address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              />
              <button type="button" className="portal-btn dashboard-search-btn" onClick={runSearch}>
                Search
              </button>
            </div>
            <div className="dashboard-results">
              <span className="dashboard-results-label">Results</span>
              <pre className="dashboard-results-pre">{searchResults}</pre>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
