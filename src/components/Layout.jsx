import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} onLogout={onLogout} />
      <Topbar user={user} collapsed={collapsed} />
      <div className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Outlet />
      </div>
    </div>
  )
}
