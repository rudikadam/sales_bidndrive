import { useState, useRef } from 'react'
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight,
  Car, ShieldCheck, Sparkles, AlertCircle, CheckCircle2,
  TrendingUp, Users, Gavel
} from 'lucide-react'
import { DEMO_USERS } from '../data/mockData'

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)

  // Sign In Form state
  const [signInEmail, setSignInEmail] = useState('sales@bidndrive.com')
  const [signInPassword, setSignInPassword] = useState('sales123')
  const [showSignInPass, setShowSignInPass] = useState(false)
  const [signInError, setSignInError] = useState('')
  const [signInLoading, setSignInLoading] = useState(false)

  // Sign Up Form state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirm, setSignUpConfirm] = useState('')
  const [signUpRole, setSignUpRole] = useState('Sales Executive')
  const [showSignUpPass, setShowSignUpPass] = useState(false)
  const [signUpError, setSignUpError] = useState('')
  const [signUpLoading, setSignUpLoading] = useState(false)

  const toggle = () => {
    setIsSignUp(prev => !prev)
    setSignInError('')
    setSignUpError('')
  }

  // Handle Sign In submit
  const handleSignIn = (e) => {
    e.preventDefault()
    setSignInError('')
    setSignInLoading(true)

    setTimeout(() => {
      const q = signInEmail.trim().toLowerCase()
      const user = DEMO_USERS.find(
        u => (u.email.toLowerCase() === q || u.name.toLowerCase() === q) && u.password === signInPassword
      )

      if (user) {
        onLogin(user)
      } else {
        setSignInError('Invalid credentials. Select a quick demo account below or check password.')
      }
      setSignInLoading(false)
    }, 500)
  }

  // Handle Quick Demo User Click
  const handleQuickDemo = (user) => {
    setSignInEmail(user.email)
    setSignInPassword(user.password)
    setSignInError('')
    setSignInLoading(true)
    setTimeout(() => {
      onLogin(user)
      setSignInLoading(false)
    }, 350)
  }

  // Handle Sign Up submit
  const handleSignUp = (e) => {
    e.preventDefault()
    setSignUpError('')

    if (signUpPassword !== signUpConfirm) {
      setSignUpError('Passwords do not match. Please re-enter.')
      return
    }

    setSignUpLoading(true)
    setTimeout(() => {
      const newUser = {
        id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: signUpRole,
        password: signUpPassword
      }
      onLogin(newUser)
      setSignUpLoading(false)
    }, 600)
  }

  return (
    <div className={`login-page-container container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
      <style>{`
        /* ==========================================================================
           Apple Liquid Glass Sliding Auth Portal - BID N DRIVE
           ========================================================================== */
        .login-page-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: transparent;
        }

        .login-page-container .row {
          display: flex;
          flex-wrap: wrap;
          height: 100vh;
          position: relative;
          z-index: 2;
        }

        .login-page-container .col {
          width: 50%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .login-page-container .align-items-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .login-page-container .flex-col {
          flex-direction: column;
        }

        .login-page-container .form-wrapper {
          width: 100%;
          max-width: 28rem;
          padding: 1rem;
        }

        /* ── Liquid Glass Form Cards ── */
        .login-page-container .form {
          padding: 2.2rem 2.4rem;
          background: rgba(255, 255, 255, 0.55) !important;
          backdrop-filter: blur(32px) saturate(190%) !important;
          -webkit-backdrop-filter: blur(32px) saturate(190%) !important;
          border: 1px solid rgba(255, 255, 255, 0.75) !important;
          border-radius: 1.75rem;
          width: 100%;
          box-shadow: 0 16px 48px rgba(31, 38, 135, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1) !important;
          transform: scale(0);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: 0.6s;
          text-align: left;
        }

        .login-page-container.sign-in .form.sign-in {
          transform: scale(1);
          pointer-events: auto;
        }
        .login-page-container.sign-in .form.sign-up {
          transform: scale(0);
          pointer-events: none;
        }
        .login-page-container.sign-up .form.sign-up {
          transform: scale(1);
          pointer-events: auto;
        }
        .login-page-container.sign-up .form.sign-in {
          transform: scale(0);
          pointer-events: none;
        }

        /* ── Input Groups with Liquid Glass ── */
        .login-page-container .input-group {
          position: relative;
          width: 100%;
          margin: 0.85rem 0;
        }

        .login-page-container .input-group .input-icon {
          position: absolute;
          top: 50%;
          left: 1.1rem;
          transform: translateY(-50%);
          color: #86868b;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }

        .login-page-container .input-group input,
        .login-page-container .input-group select {
          width: 100%;
          padding: 0.85rem 2.8rem 0.85rem 3rem;
          font-size: 0.92rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 0.85rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          outline: none;
          color: #1d1d1f;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02), inset 0 1px 0 #ffffff;
          transition: all 0.16s ease;
        }

        .login-page-container .input-group input:focus,
        .login-page-container .input-group select:focus {
          background: #ffffff;
          border-color: #0071e3;
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.16), inset 0 1px 0 #ffffff;
        }

        .login-page-container .input-eye-btn {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #86868b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .login-page-container .input-eye-btn:hover {
          color: #1d1d1f;
        }

        /* ── Submit Button ── */
        .login-page-container .submit-btn {
          cursor: pointer;
          width: 100%;
          padding: 0.85rem 0;
          border-radius: 0.85rem;
          border: none;
          background: linear-gradient(180deg, #0077ed 0%, #0071e3 100%);
          color: #ffffff;
          font-size: 0.96rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 24px rgba(0, 113, 227, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
          transition: all 0.16s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1rem;
        }

        .login-page-container .submit-btn:hover {
          background: linear-gradient(180deg, #0081ff 0%, #0077ed 100%);
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(0, 113, 227, 0.45);
        }
        .login-page-container .submit-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .login-page-container .form p {
          margin: 1rem 0 0;
          font-size: 0.82rem;
          color: #6e6e73;
          text-align: center;
        }

        .login-page-container .pointer {
          cursor: pointer;
          color: #0071e3;
          font-weight: 700;
          transition: color 0.15s;
        }
        .login-page-container .pointer:hover {
          color: #005bb5;
          text-decoration: underline;
        }

        /* ── Liquid Curved Background Shape ── */
        .login-page-container::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          height: 100vh;
          width: 300vw;
          transform: translate(35%, 0);
          background: linear-gradient(135deg, rgba(0, 113, 227, 0.9) 0%, rgba(52, 199, 89, 0.8) 50%, rgba(0, 113, 227, 0.9) 100%);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          border-bottom-right-radius: max(50vw, 50vh);
          border-top-left-radius: max(50vw, 50vh);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .login-page-container.sign-in::before {
          transform: translate(0, 0);
          right: 50%;
        }

        .login-page-container.sign-up::before {
          transform: translate(100%, 0);
          right: 50%;
        }

        /* ── Content Section ── */
        .login-page-container .content-row {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 4;
          width: 100%;
          height: 100vh;
        }

        .login-page-container .text {
          margin: 3.5rem;
          color: #ffffff;
          max-width: 440px;
        }

        .login-page-container .text h2 {
          font-size: 3.2rem;
          font-weight: 800;
          margin: 1.2rem 0;
          line-height: 1.15;
          letter-spacing: -0.03em;
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
          text-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }

        .login-page-container .text p {
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.6;
          opacity: 0.95;
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: 0.2s;
        }

        .login-page-container .text.sign-in h2,
        .login-page-container .text.sign-in p,
        .login-page-container .text.sign-in .brand-metrics {
          transform: translateX(-250%);
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-page-container .text.sign-up h2,
        .login-page-container .text.sign-up p,
        .login-page-container .text.sign-up .brand-metrics {
          transform: translateX(250%);
          transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-page-container.sign-in .text.sign-in h2,
        .login-page-container.sign-in .text.sign-in p,
        .login-page-container.sign-in .text.sign-in .brand-metrics {
          transform: translateX(0);
        }

        .login-page-container.sign-up .text.sign-up h2,
        .login-page-container.sign-up .text.sign-up p,
        .login-page-container.sign-up .text.sign-up .brand-metrics {
          transform: translateX(0);
        }

        /* ── Demo User Chip ── */
        .login-page-container .quick-user-chip {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.16s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          text-align: left;
        }
        .login-page-container .quick-user-chip:hover {
          background: #ffffff;
          border-color: rgba(0, 113, 227, 0.35);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.1);
        }

        /* ── Responsive Mobile ── */
        @media only screen and (max-width: 820px) {
          .login-page-container::before,
          .login-page-container.sign-in::before,
          .login-page-container.sign-up::before {
            height: 100vh;
            border-bottom-right-radius: 0;
            border-top-left-radius: 0;
            transform: none !important;
            right: 0 !important;
            width: 100vw !important;
            display: none;
          }

          .login-page-container .content-row {
            display: none;
          }

          .login-page-container .col {
            width: 100%;
            height: 100vh;
            padding: 1.5rem;
          }

          .login-page-container.sign-in .col.sign-up {
            display: none;
          }
          .login-page-container.sign-up .col.sign-in {
            display: none;
          }

          .login-page-container .form {
            transform: scale(1) !important;
          }
        }
      `}</style>

      {/* FORM SECTION */}
      <div className="row">
        {/* SIGN UP FORM */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(145deg, #0077ed, #005bb5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 13
                  }}
                >
                  BN
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.2px' }}>
                  BID N DRIVE <span style={{ fontSize: 9, color: '#0071e3', background: 'rgba(0,113,227,0.1)', padding: '1px 5px', borderRadius: 4 }}>PRO</span>
                </div>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', margin: '4px 0 2px', letterSpacing: '-0.02em' }}>
                Join Sales Portal
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#86868b', textAlign: 'left' }}>
                Create a registered executive account to access live auctions
              </p>

              {signUpError && (
                <div style={{
                  background: 'rgba(255, 59, 48, 0.1)', border: '1px solid rgba(255, 59, 48, 0.25)',
                  borderRadius: 10, padding: '8px 12px', marginBottom: 12, color: '#dc2626',
                  fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <AlertCircle size={15} color="#ff3b30" />
                  <span>{signUpError}</span>
                </div>
              )}

              <form onSubmit={handleSignUp}>
                <div className="input-group">
                  <span className="input-icon"><User size={16} /></span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Executive Name"
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span className="input-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    required
                    placeholder="Work Email Address"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input
                    type={showSignUpPass ? 'text' : 'password'}
                    required
                    placeholder="Create Password"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-eye-btn"
                    onClick={() => setShowSignUpPass(s => !s)}
                  >
                    {showSignUpPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div className="input-group">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input
                    type={showSignUpPass ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={signUpConfirm}
                    onChange={e => setSignUpConfirm(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <select
                    value={signUpRole}
                    onChange={e => setSignUpRole(e.target.value)}
                  >
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="RA Associate">RA Associate</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn" disabled={signUpLoading}>
                  {signUpLoading ? 'Creating Account…' : 'Create Sales Account'}
                  <ArrowRight size={16} />
                </button>
              </form>

              <p>
                <span>Already registered on portal? </span>
                <b onClick={toggle} className="pointer">
                  Sign in here
                </b>
              </p>
            </div>
          </div>
        </div>

        {/* SIGN IN FORM */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(145deg, #0077ed, #005bb5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 13
                  }}
                >
                  BN
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.2px' }}>
                  BID N DRIVE <span style={{ fontSize: 9, color: '#0071e3', background: 'rgba(0,113,227,0.1)', padding: '1px 5px', borderRadius: 4 }}></span>
                </div>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1d1d1f', margin: '4px 0 2px', letterSpacing: '-0.02em' }}>
                Welcome back
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#86868b', textAlign: 'left' }}>
                Sign in with your sales executive
              </p>

              {signInError && (
                <div style={{
                  background: 'rgba(255, 59, 48, 0.1)', border: '1px solid rgba(255, 59, 48, 0.25)',
                  borderRadius: 10, padding: '8px 12px', marginBottom: 12, color: '#dc2626',
                  fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <AlertCircle size={15} color="#ff3b30" />
                  <span>{signInError}</span>
                </div>
              )}

              <form onSubmit={handleSignIn}>
                <div className="input-group">
                  <span className="input-icon"><Mail size={16} /></span>
                  <input
                    type="text"
                    required
                    placeholder="Work Email or Username"
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input
                    type={showSignInPass ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-eye-btn"
                    onClick={() => setShowSignInPass(s => !s)}
                  >
                    {showSignInPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <button type="submit" className="submit-btn" disabled={signInLoading}>
                  {signInLoading ? 'Signing in…' : 'Sign in '}
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* 1-Click Quick Demo Sign-In */}


              <p>
                <span>Don't have an account? </span>
                <b onClick={toggle} className="pointer">
                  Sign up here
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION (Animated Sliding Panels) */}
      <div className="row content-row">
        {/* SIGN IN CONTENT (Shows on Left when in Sign In view) */}
        <div className="col align-items-center flex-col">
          <div className="text sign-in">

            <h2>
              Welcome back to BID N DRIVE
            </h2>
            <p>
              Manage live vehicle auction pipelines, verified dealer allocations, real-time bidder negotiations, and token deposits across 28+ states.
            </p>


          </div>
        </div>

        {/* SIGN UP CONTENT (Shows on Right when in Sign Up view) */}
        <div className="col align-items-center flex-col">
          <div className="text sign-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', padding: '5px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              <Sparkles size={14} />
              Enterprise Onboarding
            </div>
            <h2>
              Join the BID N DRIVE team
            </h2>
            <p>
              Join our nationwide automotive sales network. Allocate high-margin vehicle inventories to verified bidders with instant token settlements.
            </p>

            <div className="brand-metrics" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Direct REST API Synchronization</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Role-Based Access Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
