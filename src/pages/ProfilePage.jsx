import { useState } from 'react'
import { User, Mail, Phone, Shield, Car, TrendingUp, LogOut, Edit3, Save, X } from 'lucide-react'

export default function ProfilePage({ user, onLogout }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    zone: 'North India',
    team: 'Sales Team A',
    city: 'Delhi',
  })
  const [saved, setSaved] = useState(false)

  const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase() || 'U'

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page">
      {saved && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
          padding: '10px 16px', marginBottom: 16, color: '#16a34a', fontSize: 13
        }}>✓ Profile updated successfully!</div>
      )}

      {/* Hero Banner */}
      <div className="profile-hero">
        <div className="profile-avatar-big">{initials}</div>
        <div className="profile-info">
          <h2>{form.name}</h2>
          <p>{user?.email}</p>
          <div className="profile-badges">
            <span className="profile-badge">{user?.role}</span>
            <span className="profile-badge">ID: {user?.id}</span>
            <span className="profile-badge">🟢 Active</span>
            <span className="profile-badge">📍 {form.zone}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
          {!editing ? (
            <button
              className="btn" onClick={() => setEditing(true)}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            ><Edit3 size={14} /> Edit Profile</button>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleSave}><Save size={14} /> Save</button>
              <button className="btn" onClick={() => setEditing(false)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              ><X size={14} /></button>
            </>
          )}
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal Info */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><User size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Personal Information</span>
          </div>
          <div className="card-body">
            {editing ? (
              <>
                {[
                  { key: 'name', label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'phone', label: 'Phone', type: 'text' },
                  { key: 'zone', label: 'Zone', type: 'text' },
                  { key: 'city', label: 'City', type: 'text' },
                  { key: 'team', label: 'Team', type: 'text' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { icon: User, label: 'Full Name', value: form.name },
                  { icon: Mail, label: 'Email', value: form.email },
                  { icon: Phone, label: 'Phone', value: form.phone },
                  { icon: Shield, label: 'Role', value: user?.role },
                  { icon: Car, label: 'Zone', value: form.zone },
                  { icon: TrendingUp, label: 'Team', value: form.team },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="profile-stat-row">
                    <span className="profile-stat-label"><Icon size={13} />{label}</span>
                    <span className="profile-stat-value">{value}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Performance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><TrendingUp size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Performance Stats</span>
          </div>
          <div className="card-body">
            {[
              { label: 'Calls This Month', value: '127', color: '#4f46e5' },
              { label: 'Cars Processed', value: '48', color: '#22c55e' },
              { label: 'Dealers Managed', value: '34', color: '#f59e0b' },
              { label: 'Revenue MTD', value: '₹4.2L', color: '#a855f7' },
              { label: 'Avg Call Duration', value: '5:23 min', color: '#06b6d4' },
              { label: 'Success Rate', value: '78%', color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="profile-stat-row">
                <span className="profile-stat-label">{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header"><span className="card-title">Recent Activity</span></div>
          <div className="card-body">
            {[
              { time: 'Today 10:30 AM', action: 'Called dealer SETHS AND SONS — 5:23 min', tag: 'Call', color: '#4f46e5' },
              { time: 'Today 09:45 AM', action: 'Processed car: 2022 Hyundai Venue SX', tag: 'Car', color: '#22c55e' },
              { time: 'Yesterday 4:00 PM', action: 'Marked dealer SHRI MOTORS as contacted', tag: 'Dealer', color: '#f59e0b' },
              { time: 'Yesterday 2:30 PM', action: 'Reviewed 5 car bids on BND WORLD', tag: 'Bid', color: '#a855f7' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none'
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 100, flexShrink: 0 }}>{a.time}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#334155', flex: 1 }}>{a.action}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: a.color + '22', color: a.color, flexShrink: 0 }}>{a.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-danger" onClick={onLogout}>
          <LogOut size={14} /> Sign Out from BID N DRIVE
        </button>
      </div>
    </div>
  )
}
