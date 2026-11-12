import { useState, useRef } from 'react'
import { Eye, EyeOff, Car, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { DEMO_USERS } from '../data/mockData'

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');

.lp-wrap {
  --ink: #12202b;
  --muted: #64748b;
  --line: #dde4ea;
  --paper: #eef4ff;
  --petrol: #0a2f7a;
  --petrol-2:rgb(75, 124, 232);
  --amber:rgb(80, 71, 255);
  --amber-ink: #3a2500;
  --danger: #c2362b;
  --danger-bg: #fdeceb;

  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: 100vh;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
}
.lp-wrap *, .lp-wrap *::before, .lp-wrap *::after { box-sizing: border-box; }

/* ───── Left: brand text ───── */
.lp-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px clamp(32px, 6vw, 88px);
  color: #e8f0f5;
  background:
    radial-gradient(900px 500px at 90% -10%, rgba(255, 181, 71, 0.18), transparent 60%),
    linear-gradient(160deg, var(--petrol-2), var(--petrol) 60%);
  overflow: hidden;
}
.lp-brand::after {
  content: '';
  position: absolute;
  inset: auto -10% -30% -10%;
  height: 60%;
  background: repeating-linear-gradient(100deg, transparent 0 60px, rgba(255,255,255,0.045) 60px 64px);
  transform: perspective(500px) rotateX(55deg);
  pointer-events: none;
}
.lp-brand > * { position: relative; z-index: 1; }

.lp-mark {
  width: 56px; height: 56px;
  display: grid; place-items: center;
  border-radius: 16px;
  background: var(--amber);
  color: var(--amber-ink);
  margin-bottom: 36px;
}
.lp-sales {
  margin: 0 0 4px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: clamp(28px, 3vw, 40px);
  letter-spacing: -0.01em;
  color: #bcd0f5;
}
.lp-name {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #fff;
}
.lp-tag {
  margin: 28px 0 0;
  max-width: 38ch;
  font-size: 17px;
  line-height: 1.55;
  color: #bcd0f5;
}

/* ───── Right: form ───── */
.lp-panel { display: grid; place-items: center; padding: 40px 24px; }
.lp-card { width: 100%; max-width: 420px; }

.lp-mobile-logo { display: none; align-items: center; gap: 12px; margin-bottom: 28px; font-weight: 500; }
.lp-mobile-logo .lp-mark { width: 42px; height: 42px; border-radius: 12px; margin: 0; }
.lp-mobile-logo b { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: 0.05em; }

.lp-title {
  margin: 0 0 6px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 34px; font-weight: 700; letter-spacing: -0.02em;
}
.lp-subtitle { margin: 0 0 28px; color: var(--muted); font-size: 15px; }

.lp-error {
  display: flex; gap: 10px; align-items: flex-start;
  margin-bottom: 20px; padding: 12px 14px;
  border-radius: 12px;
  background: var(--danger-bg);
  color: var(--danger);
  font-size: 14px; line-height: 1.4;
  animation: lp-shake 0.4s;
}
.lp-error svg { flex-shrink: 0; margin-top: 1px; }

.lp-field { margin-bottom: 18px; }
.lp-field label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }

.lp-input { position: relative; }
.lp-input input {
  width: 100%; height: 50px;
  padding: 0 46px 0 44px;
  font: inherit; font-size: 15px; color: var(--ink);
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.lp-input input::placeholder { color: #9aa8b4; }
.lp-input input:hover { border-color: #c2ced8; }
.lp-input input:focus {
  outline: none;
  border-color: var(--petrol-2);
  box-shadow: 0 0 0 4px rgba(20, 86, 201, 0.16);
}
.lp-icon {
  position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
  color: #8697a5; pointer-events: none; transition: color 0.15s;
}
.lp-input:focus-within .lp-icon { color: var(--petrol-2); }

.lp-eye {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  width: 38px; height: 38px;
  display: grid; place-items: center;
  background: none; border: 0; border-radius: 9px;
  color: #8697a5; cursor: pointer;
}
.lp-eye:hover { color: var(--ink); background: #eef2f5; }
.lp-eye:focus-visible { outline: 2px solid var(--petrol-2); }

.lp-forgot { display: flex; justify-content: flex-end; margin: 4px 0 22px; font-size: 14px; }
.lp-link { color: var(--petrol-2); font-weight: 600; text-decoration: none; }
.lp-link:hover { text-decoration: underline; }
.lp-link:focus-visible { outline: 2px solid var(--petrol-2); outline-offset: 3px; border-radius: 4px; }

.lp-btn {
  width: 100%; height: 52px;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  font: inherit; font-size: 16px; font-weight: 600;
  color: var(--amber-ink);
  background: var(--amber);
  border: 0; border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 20px -8px rgba(255, 168, 30, 0.7);
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
}
.lp-btn:hover:not(:disabled) { filter: brightness(1.05); transform: translateY(-1px); }
.lp-btn:active:not(:disabled) { transform: translateY(0); }
.lp-btn:focus-visible { outline: 3px solid var(--petrol-2); outline-offset: 3px; }
.lp-btn:disabled { opacity: 0.75; cursor: progress; }

.lp-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid rgba(58, 37, 0, 0.25);
  border-top-color: var(--amber-ink);
  animation: lp-spin 0.7s linear infinite;
}

.lp-demo { margin-top: 30px; }
.lp-demo-title { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; color: var(--muted); }
.lp-demo-title::before, .lp-demo-title::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.lp-demo-list { display: grid; gap: 8px; }
.lp-demo-item {
  display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 10px 12px;
  font: inherit; text-align: left;
  background: #fff; border: 1.5px solid var(--line); border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.lp-demo-item:hover { border-color: var(--petrol-2); background: #eaf1ff; }
.lp-demo-item:focus-visible { outline: 2px solid var(--petrol-2); outline-offset: 2px; }
.lp-avatar {
  width: 34px; height: 34px; flex-shrink: 0;
  display: grid; place-items: center;
  border-radius: 50%;
  font-weight: 700; font-size: 14px;
  color: #fff; background: var(--petrol-2);
}
.lp-demo-text { display: flex; flex-direction: column; min-width: 0; }
.lp-demo-text strong { font-size: 14px; }
.lp-demo-text small { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }

.lp-copy { margin: 28px 0 0; text-align: center; font-size: 12px; color: #94a3b8; }

@keyframes lp-spin { to { transform: rotate(360deg); } }
@keyframes lp-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

@media (max-width: 900px) {
  .lp-wrap { grid-template-columns: 1fr; }
  .lp-brand { display: none; }
  .lp-mobile-logo { display: flex; }
  .lp-panel { align-items: start; padding-top: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  .lp-wrap *, .lp-wrap *::before, .lp-wrap *::after { animation: none !important; transition: none !important; }
}
`

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const passRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password)
      if (user) {
        onLogin(user)
      } else {
        setError('Invalid email or password. Use a demo account below.')
        setShakeKey(k => k + 1)
      }
      setLoading(false)
    }, 700)
  }

  const fillDemo = (u) => {
    setForm({ email: u.email, password: u.password })
    setError('')
    passRef.current?.focus()
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-wrap">
        {/* Left: brand text */}
        <aside className="lp-brand">
          <div className="lp-mark"><Car size={28} /></div>
          <p className="lp-sales">Sales</p>
          <h2 className="lp-name">BID N DRIVE</h2>
          <p className="lp-tag">
            Manage auctions, buyers and deals with your whole sales team in one place.
          </p>
        </aside>

        {/* Right: login form */}
        <main className="lp-panel">
          <div className="lp-card">
            <div className="lp-mobile-logo">
              <div className="lp-mark"><Car size={20} /></div>
              <span>Sales <b>BID N DRIVE</b></span>
            </div>

            <h1 className="lp-title">Welcome back</h1>
            <p className="lp-subtitle">Sign in to your account to continue</p>

            {error && (
              <div key={shakeKey} className="lp-error" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="lp-field">
                <label htmlFor="lp-email">Email address</label>
                <div className="lp-input">
                  <Mail size={17} className="lp-icon" />
                  <input
                    id="lp-email" type="email" autoComplete="username"
                    placeholder="you@bidndrive.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="lp-field">
                <label htmlFor="lp-pass">Password</label>
                <div className="lp-input">
                  <Lock size={17} className="lp-icon" />
                  <input
                    id="lp-pass" ref={passRef}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button" className="lp-eye"
                    onClick={() => setShowPass(s => !s)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="lp-forgot">
                {/* <a href="#" className="lp-link" onClick={e => e.preventDefault()}>Forgot password?</a> */}
              </div>

              <button className="lp-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="lp-spinner" /> Signing in…</>
                ) : (
                  <>Sign in <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            {DEMO_USERS?.length > 0 && (
              <div className="lp-demo">
                
              </div>
            )}

            <p className="lp-copy">© 2026 Sales BID N DRIVE. All rights reserved.</p>
          </div>
        </main>
      </div>
    </>
  )
}