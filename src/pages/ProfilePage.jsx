import { useState } from 'react'
import {
  User, Mail, Phone, Shield, Car, TrendingUp, LogOut,
  Edit3, Save, X, Check, Users, Sparkles, Award
} from 'lucide-react'

export default function ProfilePage({ user, onLogout }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || 'Sales Administrator',
    email: user?.email || 'sales@bidndrive.com',
    phone: '+91 98765 43210',
    zone: 'North India & NCR',
    team: 'Enterprise Bidding Desk',
    city: 'New Delhi',
  })
  const [saved, setSaved] = useState(false)

  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SA'

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="page">
      {saved && (
        <div
          style={{
            background: 'rgba(52, 199, 89, 0.12)',
            border: '1px solid rgba(52, 199, 89, 0.3)',
            borderRadius: 12,
            padding: '12px 18px',
            marginBottom: 20,
            color: '#15803d',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backdropFilter: 'blur(16px)'
          }}
        >
          <Check size={16} /> Profile credentials updated successfully.
        </div>
      )}

      {/* Apple Liquid Hero Banner */}
      <div
        className="profile-hero"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 26, 40, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%)',
          backdropFilter: 'blur(32px) saturate(210%)',
          WebkitBackdropFilter: 'blur(32px) saturate(210%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 20px 48px -10px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="profile-avatar-big">{initials}</div>
        <div className="profile-info" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{form.name}</h2>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0077ed, #005bb5)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 9999,
                letterSpacing: '0.4px'
              }}
            >
              EXECUTIVE
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{form.email}</p>
          <div className="profile-badges" style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="profile-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#f1f5f9' }}>
              {user?.role || 'Sales Executive'}
            </span>
            <span className="profile-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              ID: {user?.id || 'BN-104'}
            </span>
            <span className="profile-badge" style={{ background: 'rgba(52, 199, 89, 0.15)', color: '#4ade80' }}>
              <span className="sidebar-live-dot" style={{ display: 'inline-block', marginRight: 5 }} /> Active On Desk
            </span>
            <span className="profile-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              📍 {form.zone}
            </span>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
          {!editing ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditing(true)}
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-success" onClick={handleSave}>
                <Save size={14} /> Save
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEditing(false)}
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal Details */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={15} color="#0071e3" /> Personal Information
            </span>
          </div>
          <div className="card-body">
            {editing ? (
              <>
                {[
                  { key: 'name', label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email Address', type: 'email' },
                  { key: 'phone', label: 'Direct Phone', type: 'text' },
                  { key: 'zone', label: 'Assigned Territory', type: 'text' },
                  { key: 'city', label: 'Base Location', type: 'text' },
                  { key: 'team', label: 'Sales Operations Team', type: 'text' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-input"
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { icon: User, label: 'Full Name', value: form.name },
                  { icon: Mail, label: 'Work Email', value: form.email },
                  { icon: Phone, label: 'Contact Phone', value: form.phone },
                  { icon: Shield, label: 'Access Tier', value: user?.role || 'Sales Executive' },
                  { icon: Car, label: 'Assigned Territory', value: form.zone },
                  { icon: TrendingUp, label: 'Operations Desk', value: form.team },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="profile-stat-row">
                    <span className="profile-stat-label">
                      <Icon size={14} color="#86868b" /> {label}
                    </span>
                    <span className="profile-stat-value">{value}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={15} color="#0071e3" /> Sales & Bidding Performance
            </span>
          </div>
          <div className="card-body">
            {[
              { label: 'Calls Logged This Month', value: '127', color: '#0071e3' },
              { label: 'Vehicles Evaluated', value: '48', color: '#34c759' },
              { label: 'Active Bidders Managed', value: '34', color: '#ff9f0a' },
              { label: 'Gross Token Volume', value: '₹4.2L', color: '#af52de' },
              { label: 'Average Bidder Talk Time', value: '5:23 min', color: '#0071e3' },
              { label: 'Negotiation Win Rate', value: '78%', color: '#34c759' },
            ].map(s => (
              <div key={s.label} className="profile-stat-row">
                <span className="profile-stat-label">{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Trail */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <span className="card-title">Recent Activity Log</span>
          </div>
          <div className="card-body">
            {[
              { time: 'Today 10:30 AM', action: 'Outbound negotiation with bidder SETHS AND SONS — 5:23 min', tag: 'Call', color: '#0071e3' },
              { time: 'Today 09:45 AM', action: 'Assigned enquiry for 2022 Hyundai Venue SX to Top Bidder', tag: 'Vehicle', color: '#34c759' },
              { time: 'Yesterday 4:00 PM', action: 'Marked bidder SHRI MOTORS as active on auction floor', tag: 'Bidder', color: '#ff9f0a' },
              { time: 'Yesterday 2:30 PM', action: 'Reviewed 5 competitive car bids on BID N DRIVE World', tag: 'Bidding', color: '#af52de' },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 0',
                  borderBottom: i < 3 ? '1px solid rgba(0, 0, 0, 0.04)' : 'none'
                }}
              >
                <span style={{ fontSize: 11, color: '#86868b', minWidth: 120, flexShrink: 0 }}>{a.time}</span>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#1d1d1f', flex: 1 }}>{a.action}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: a.color + '15',
                    color: a.color,
                    flexShrink: 0
                  }}
                >
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Out Action */}
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onLogout}
          style={{ padding: '10px 24px' }}
        >
          <LogOut size={15} /> Sign Out from BID N DRIVE
        </button>
      </div>
    </div>
  )
}
