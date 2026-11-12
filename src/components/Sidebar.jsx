import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Car, Phone, Users, User,
  ChevronLeft, ChevronRight, LogOut, TrendingUp, FileText
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'All Cars', icon: Car, to: '/all-cars' },
  { label: 'Call Logs', icon: Phone, to: '/call-logs' },
]

export default function Sidebar({ collapsed, onToggle, onLogout }) {
  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">BN</div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            Sales BID N DRIVE
            
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-title">Main Menu</div>}
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : ''}
          >
            <Icon size={18} />
            {!collapsed && <span className="sidebar-item-label">{label}</span>}
          </NavLink>
        ))}

      
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`} title={collapsed ? 'Profile' : ''}>
          <User size={18} />
          {!collapsed && <span className="sidebar-item-label">Profile</span>}
        </NavLink>
        <div className="sidebar-item" onClick={onLogout} title={collapsed ? 'Logout' : ''}>
          <LogOut size={18} />
          {!collapsed && <span className="sidebar-item-label">Logout</span>}
        </div>
      </div>

      {/* Toggle */}
      <div className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </div>
    </div>
  )
}
