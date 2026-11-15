import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Car, Phone, Users, User,
  ChevronLeft, ChevronRight, LogOut, FileText,
  Sparkles, Zap
} from 'lucide-react'

const navGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
      { label: 'All Cars', icon: Car, to: '/all-cars', badgeVariant: 'live' },
    ]
  },
  {
    title: 'Sales & Bidding',
    items: [
      { label: 'Bidders', icon: Users, to: '/bidders', badgeVariant: 'info' },
      { label: 'Assigned Enquiry', icon: FileText, to: '/bidder-assigned-enquiry', badgeVariant: 'warn' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { label: 'Call Logs', icon: Phone, to: '/call-logs' },
    ]
  }
]

export default function Sidebar({ collapsed, onToggle, onLogout, user }) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SA'

  // Keyboard shortcut Ctrl+B / Cmd+B for instant toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onToggle])

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <div className="sidebar-logo-glow" />
          <div className="sidebar-logo-icon">
            <span>BN</span>
          </div>
        </div>

        {!collapsed && (
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">
              BID N DRIVE
            </div>
            <div className="sidebar-brand-subtitle">

            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav sidebar-scroll">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title || groupIndex} className="sidebar-group">
            {!collapsed && (
              <div className="sidebar-group-title">
                {group.title}
              </div>
            )}

            <div className="sidebar-group-items">
              {group.items.map(({ label, icon: Icon, to, badge, badgeVariant }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `sidebar-item${isActive ? ' active' : ''}`
                  }
                >
                  <div className="sidebar-item-icon">
                    <Icon size={19} strokeWidth={2} />
                  </div>

                  {!collapsed ? (
                    <>
                      <span className="sidebar-item-label">{label}</span>
                      {badge && (
                        <span className={`sidebar-badge ${badgeVariant || 'default'}`}>
                          {badgeVariant === 'live' && <span className="sidebar-badge-dot" />}
                          {badge}
                        </span>
                      )}
                    </>
                  ) : (
                    /* Instant zero-lag tooltip when collapsed */
                    <div className="sidebar-tooltip">
                      <span className="sidebar-tooltip-text">{label}</span>
                      {badge && (
                        <span className={`sidebar-tooltip-badge ${badgeVariant || 'default'}`}>
                          {badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active indicator bar */}
                  <div className="sidebar-item-active-bar" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Footer Actions */}
      <div className="sidebar-footer">
        <div className="sidebar-user-box">
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-user-link${isActive ? ' active' : ''}`}
            title={collapsed ? 'Profile' : ''}
          >
            <div className="sidebar-avatar-wrap">
              <div className="sidebar-avatar">{initials}</div>
              <span className="sidebar-status-dot" title="Active Online" />
            </div>

            {!collapsed && (
              <div className="sidebar-user-details">
                <div className="sidebar-user-name" title={user?.name || 'Sales Representative'}>
                  {user?.name || 'Sales Rep'}
                </div>
                <div className="sidebar-user-role">
                  {user?.role || 'Sales Executive'}
                </div>
              </div>
            )}

            {collapsed && (
              <div className="sidebar-tooltip">
                <span className="sidebar-tooltip-text">Profile ({user?.name || 'User'})</span>
              </div>
            )}
          </NavLink>

          {!collapsed ? (
            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="sidebar-logout-btn-collapsed"
              onClick={onLogout}
              aria-label="Sign out"
            >
              <LogOut size={17} />
              <div className="sidebar-tooltip">
                <span className="sidebar-tooltip-text">Sign Out</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Smooth Collapse / Expand Toggle Button */}
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
        title={collapsed ? 'Expand (Ctrl+B)' : 'Collapse (Ctrl+B)'}
      >
        <div className="sidebar-toggle-inner">
          {collapsed ? <ChevronRight size={13} strokeWidth={2.5} /> : <ChevronLeft size={13} strokeWidth={2.5} />}
        </div>
      </button>
    </aside>
  )
}
