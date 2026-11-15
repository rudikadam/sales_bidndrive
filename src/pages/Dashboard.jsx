import { Car, Users, Phone, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars, callLogs } from '../data/mockData'

const stats = [
  { label: 'Total Cars', value: '248', change: '+12%', up: true, icon: Car, color: 'blue' },
  { label: 'Active Bidders', value: '34', change: '+3%', up: true, icon: Users, color: 'green' },
  { label: 'Calls Today', value: '56', change: '-5%', up: false, icon: Phone, color: 'yellow' },
  { label: 'Revenue MTD', value: '₹4.2L', change: '+18%', up: true, icon: TrendingUp, color: 'purple' },
]

function MiniCarCard({ car }) {
  return (
    <Link to={`/all-cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          display: 'flex', gap: 14, padding: '14px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer',
          transition: 'all 0.16s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 113, 227, 0.03)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: 52, height: 42, borderRadius: 10, flexShrink: 0,
          background: car.color_hex + '18',
          border: `1px solid ${car.color_hex}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
        }}>
          <Car size={20} color={car.color_hex} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {car.name}
          </div>
          <div style={{ fontSize: 11, color: '#86868b', marginTop: 3 }}>
            {car.location} · {car.fuel} · {car.km} km
          </div>
          {car.acceptance && (
            <div className="high-accept" style={{ fontSize: 10, padding: '2px 7px', marginTop: 4 }}>
              ✓ High acceptance
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
            {car.sellerAsk}
          </div>
          <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>Seller Ask</div>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard({ user }) {
  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            Good afternoon, {user?.name?.split(' ')[0] || 'Team'}
          </div>
          <div className="page-subtitle">
            Live overview of Sales BID N DRIVE auction operations
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/bidder-assigned-enquiry">
            <button className="btn btn-outline">Assigned Enquiries</button>
          </Link>
          <Link to="/bidders">
            <button className="btn btn-outline">View Bidders</button>
          </Link>
          <Link to="/all-cars">
            <button className="btn btn-primary">View All Cars</button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
                {s.up
                  ? <ArrowUpRight size={13} style={{ display: 'inline' }} />
                  : <ArrowDownRight size={13} style={{ display: 'inline' }} />
                }
                {' '}{s.change} this month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Cars Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Car size={16} color="#0071e3" /> Recent Car Listings
            </span>
            <Link to="/all-cars"><button className="btn btn-sm btn-outline">View All</button></Link>
          </div>
          {cars.slice(0, 4).map(car => <MiniCarCard key={car.id} car={car} />)}
        </div>

        {/* Calls Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={16} color="#34c759" /> Recent Communications
            </span>
            <Link to="/call-logs"><button className="btn btn-sm btn-outline">View All</button></Link>
          </div>
          {callLogs.slice(0, 5).map(log => (
            <div key={log.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)',
              transition: 'background 0.12s ease'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
                  {log.bidder || log.dealer}
                </div>
                <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
                  {log.date} · {log.time}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${log.status === 'Connected' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>
                  {log.status}
                </span>
                <div style={{ fontSize: 10, color: '#86868b', marginTop: 3 }}>{log.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
