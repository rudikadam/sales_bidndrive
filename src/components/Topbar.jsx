import { Bell, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Topbar({ user, collapsed }) {
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || 'U'

  return (
    <div className="topbar" style={{ left: collapsed ? 60 : 220 }}>
      <div className="topbar-left">
        <span style={{
          fontSize: 11, color: '#7c3aed', background: '#faf5ff',
          padding: '3px 10px', borderRadius: 20, fontWeight: 500
        }}></span>
      </div>
      <div className="topbar-right">
        <button className="btn btn-primary btn-sm">
          <Phone size={13} /> Call
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
