import { useState, useEffect } from 'react'

/**
 * SkeletonSplash - Pure Apple Liquid Glass Skeleton Loading Splash Screen
 * Automatically shows on page load / refresh for 1.5 seconds (1500ms),
 * then smoothly dissolves with an authentic Apple visionOS blur & scale transition.
 */
export default function SkeletonSplash({ isLoggedIn = true, duration = 1500, onComplete }) {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTime = Math.max(100, duration - 300) // smooth 300ms exit fade

    // Trigger exit transition
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, exitTime)

    // Complete and unmount upon duration
    const completeTimer = setTimeout(() => {
      setVisible(false)
      if (onComplete) onComplete()
    }, duration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  if (!visible) return null

  return (
    <div
      className={`skeleton-splash-overlay ${isExiting ? 'skeleton-splash-exit' : ''}`}
      aria-hidden="true"
    >
      <style>{`
        /* ── Splash Overlay Base ── */
        .skeleton-splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(244, 247, 250, 0.72);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 1;
          transform: scale(1);
          filter: blur(0px);
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: all;
          user-select: none;
        }

        .skeleton-splash-overlay.skeleton-splash-exit {
          opacity: 0;
          transform: scale(1.015);
          filter: blur(10px);
          pointer-events: none;
        }

        /* ── Liquid Glass Shimmer Keyframes ── */
        @keyframes skLiquidShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* ── Shimmer Elements ── */
        .sk-bar,
        .sk-circle,
        .sk-box {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.65);
        }

        .sk-bar::after,
        .sk-circle::after,
        .sk-box::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: skLiquidShimmer 1.5s ease-in-out infinite;
        }

        .sk-bar {
          border-radius: 8px;
        }
        .sk-circle {
          border-radius: 50%;
        }
        .sk-box {
          border-radius: 12px;
        }

        /* ── Glass Card Skeleton Containers ── */
        .sk-glass {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        /* ── Responsiveness ── */
        @media (max-width: 820px) {
          .sk-sidebar { display: none !important; }
          .sk-topbar { left: 0 !important; width: 100% !important; }
          .sk-main { margin-left: 0 !important; padding: 16px !important; }
          .sk-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .sk-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {isLoggedIn ? (
        /* ═══════════════════════════════════════════════════════════════════
           AUTHENTICATED WORKSPACE SKELETON (Sidebar + Topbar + Dashboard)
           ═══════════════════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
          {/* Skeleton Sidebar (240px) */}
          <aside
            className="sk-sidebar sk-glass"
            style={{
              width: 240,
              minWidth: 240,
              height: '100vh',
              borderRadius: 0,
              borderRight: '1px solid rgba(255, 255, 255, 0.7)',
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 14px',
              gap: 20
            }}
          >
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="sk-box" style={{ width: 38, height: 38, borderRadius: 11 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div className="sk-bar" style={{ width: '80%', height: 14 }} />
                <div className="sk-bar" style={{ width: '50%', height: 9 }} />
              </div>
            </div>

            {/* Nav Group 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="sk-bar" style={{ width: '40%', height: 9, opacity: 0.6 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
            </div>

            {/* Nav Group 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="sk-bar" style={{ width: '55%', height: 9, opacity: 0.6 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
            </div>

            {/* Nav Group 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="sk-bar" style={{ width: '45%', height: 9, opacity: 0.6 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
            </div>

            {/* User Profile Card at Bottom */}
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sk-circle" style={{ width: 36, height: 36 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                <div className="sk-bar" style={{ width: '70%', height: 12 }} />
                <div className="sk-bar" style={{ width: '50%', height: 9 }} />
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Topbar Skeleton (h-64) */}
            <header
              className="sk-topbar sk-glass"
              style={{
                height: 64,
                borderRadius: 0,
                borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="sk-bar" style={{ width: 80, height: 14 }} />
                <span style={{ color: '#c7c7cc' }}>/</span>
                <div className="sk-bar" style={{ width: 110, height: 14 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="sk-bar" style={{ width: 180, height: 34, borderRadius: 9999 }} />
                <div className="sk-circle" style={{ width: 34, height: 34 }} />
                <div className="sk-circle" style={{ width: 34, height: 34 }} />
              </div>
            </header>

            {/* Main Content Area */}
            <main
              className="sk-main"
              style={{
                flex: 1,
                padding: '28px 32px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 24
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="sk-bar" style={{ width: 260, height: 26 }} />
                  <div className="sk-bar" style={{ width: 340, height: 14 }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="sk-bar" style={{ width: 130, height: 36, borderRadius: 10 }} />
                  <div className="sk-bar" style={{ width: 110, height: 36, borderRadius: 10 }} />
                  <div className="sk-bar" style={{ width: 120, height: 36, borderRadius: 10 }} />
                </div>
              </div>

              {/* 4 KPI Stat Cards */}
              <div
                className="sk-stats-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16
                }}
              >
                {[1, 2, 3, 4].map(idx => (
                  <div
                    key={idx}
                    className="sk-glass"
                    style={{
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="sk-box" style={{ width: 38, height: 38, borderRadius: 10 }} />
                      <div className="sk-bar" style={{ width: 44, height: 16, borderRadius: 9999 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="sk-bar" style={{ width: '60%', height: 26 }} />
                      <div className="sk-bar" style={{ width: '45%', height: 12 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Dual Content Grid */}
              <div
                className="sk-content-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.45fr 1fr',
                  gap: 20
                }}
              >
                {/* Left Large Panel (Table / Cars) */}
                <div className="sk-glass" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="sk-bar" style={{ width: 180, height: 18 }} />
                      <div className="sk-bar" style={{ width: 120, height: 12 }} />
                    </div>
                    <div className="sk-bar" style={{ width: 90, height: 28, borderRadius: 8 }} />
                  </div>

                  {/* 4 Row items */}
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.04)'
                      }}
                    >
                      <div className="sk-box" style={{ width: 50, height: 42, borderRadius: 10, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="sk-bar" style={{ width: '55%', height: 14 }} />
                        <div className="sk-bar" style={{ width: '35%', height: 10 }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <div className="sk-bar" style={{ width: 70, height: 16 }} />
                        <div className="sk-bar" style={{ width: 45, height: 10 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Activity Panel */}
                <div className="sk-glass" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div className="sk-bar" style={{ width: 140, height: 18 }} />
                      <div className="sk-bar" style={{ width: 100, height: 12 }} />
                    </div>
                    <div className="sk-bar" style={{ width: 70, height: 24, borderRadius: 9999 }} />
                  </div>

                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.04)'
                      }}
                    >
                      <div className="sk-circle" style={{ width: 36, height: 36, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div className="sk-bar" style={{ width: '65%', height: 13 }} />
                        <div className="sk-bar" style={{ width: '40%', height: 10 }} />
                      </div>
                      <div className="sk-bar" style={{ width: 50, height: 20, borderRadius: 6 }} />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════
           PORTAL AUTH SKELETON (Liquid Glass Login Layout)
           ═══════════════════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div
            className="sk-glass"
            style={{
              width: '100%',
              maxWidth: 440,
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}
          >
            {/* Logo & Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sk-box" style={{ width: 34, height: 34, borderRadius: 8 }} />
              <div className="sk-bar" style={{ width: 120, height: 16 }} />
            </div>

            {/* Title & Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="sk-bar" style={{ width: '65%', height: 22 }} />
              <div className="sk-bar" style={{ width: '85%', height: 13 }} />
            </div>

            {/* 2 Input Group Shimmers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
              <div className="sk-bar" style={{ width: '100%', height: 44, borderRadius: 12 }} />
              <div className="sk-bar" style={{ width: '100%', height: 44, borderRadius: 12 }} />
            </div>

            {/* Submit Button Shimmer */}
            <div className="sk-bar" style={{ width: '100%', height: 46, borderRadius: 12, marginTop: 4 }} />

            {/* Quick Demo Chips Shimmer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="sk-bar" style={{ width: '40%', height: 10 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
              <div className="sk-bar" style={{ width: '100%', height: 38, borderRadius: 10 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
