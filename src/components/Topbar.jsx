import { Bell, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Topbar({ user, collapsed }) {
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U'

  const handleRefreshWorkspace = () => {
    window.dispatchEvent(new CustomEvent('trigger-skeleton-splash'))
  }

  return (
    <div className="topbar" style={{ left: collapsed ? 72 : 240 }}>
      <div className="topbar-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span className="sidebar-live-dot" />
          <span style={{ fontWeight: 600, color: '#1d1d1f' }}>Auction Network Online</span>
          <span style={{ color: '#c7c7cc' }}>·</span>
          <span style={{ fontSize: 11, color: '#86868b' }}>Live Bidding Sync Active</span>
        </div>
      </div>
      <div className="topbar-right">
        {/* Manual 1.5-Second Skeleton Refresh Trigger Button */}
        <button
          onClick={handleRefreshWorkspace}
          title="Refresh Workspace (1.5-second live sync)"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 9999,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            color: '#1d1d1f',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.16s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#ffffff'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,113,227,0.15)'
            e.currentTarget.style.color = '#0071e3'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'
            e.currentTarget.style.color = '#1d1d1f'
          }}
        >
          <RefreshCw size={12} />
          <span>Sync Workspace</span>
        </button>

        <div className="topbar-notif">
          <Bell size={16} />
          <span className="notif-badge">9</span>
        </div>
        <Link to="/profile">
          <div className="topbar-avatar" title={user?.name}>{initials}</div>
        </Link>
      </div>
    </div>
  )
}
