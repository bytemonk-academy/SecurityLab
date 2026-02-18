import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type Tab = 'login' | 'signup'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [loginError, setLoginError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const body = new URLSearchParams({ email: loginEmail, password: loginPassword })
    try {
      const res = await fetch('/login', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
      })
      const data = await res.json()
      if (data.redirect) {
        navigate('/dashboard')
        return
      }
      if (data.error) setLoginError(data.error)
    } catch {
      setLoginError('Request failed.')
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setSignupError('')
    const body = new URLSearchParams({
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
    })
    try {
      const res = await fetch('/signup', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
      })
      const data = await res.json()
      if (data.redirect) {
        navigate('/dashboard')
        return
      }
      if (data.error) setSignupError(data.error)
    } catch {
      setSignupError('Request failed.')
    }
  }

  return (
    <>
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="portal-page">
        <h1 className="portal-logo">PORTAL</h1>
        <p className="portal-tagline">SQL INJECTION LAB — SIGN IN OR CREATE AN ACCOUNT</p>
        <div className="portal-card">
          <div className="portal-tabs">
            <button
              type="button"
              className={'portal-tab' + (tab === 'login' ? ' active' : '')}
              onClick={() => { setTab('login'); setLoginError(''); setSignupError('') }}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={'portal-tab' + (tab === 'signup' ? ' active' : '')}
              onClick={() => { setTab('signup'); setLoginError(''); setSignupError('') }}
            >
              SIGN UP
            </button>
          </div>
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="portal-form-group">
                <label>EMAIL</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="user@test.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="portal-form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  className="portal-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && <div className="portal-error">{loginError}</div>}
              <button type="submit" className="portal-btn">LOG IN</button>
            </form>
          )}
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="portal-form-group">
                <label>USERNAME</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="johndoe"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="portal-form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  className="portal-input"
                  placeholder="john@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="portal-form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  className="portal-input"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              {signupError && <div className="portal-error">{signupError}</div>}
              <button type="submit" className="portal-btn">CREATE ACCOUNT</button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
