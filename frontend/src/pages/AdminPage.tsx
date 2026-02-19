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

      <div className="dashboard-layout admin-layout">
        <header className="dashboard-header">
          <span className="portal-logo dashboard-logo">PORTAL</span>
          <Link to="/dashboard" className="dashboard-link">← DASHBOARD</Link>
        </header>

        <div className="portal-card admin-panel-card">
          <h1 className="admin-panel-title">Admin Panel</h1>

          {data.error && (
            <p className="admin-error">{data.error}</p>
          )}

          {data.flag && (
            <div className="admin-flag">
              <span className="admin-flag-label">Flag</span>
              <code className="admin-flag-value">{data.flag}</code>
            </div>
          )}

          {data.message && !data.error && (
            <p className="admin-message">{data.message}</p>
          )}

          {data.users && data.users.length > 0 && (
            <div className="admin-table-wrap">
              <h2 className="admin-table-title">Registered users</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td><span className={'admin-role admin-role-' + u.role}>{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
