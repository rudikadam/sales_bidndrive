import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Car, MapPin, User, Fuel, Calendar, Phone, Tag } from 'lucide-react'
import { cars } from '../data/mockData'

export default function CarDetail() {
  const { id } = useParams()
  const car = cars.find(c => c.id === Number(id))

  if (!car) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <Car size={56} style={{ color: '#cbd5e1', marginBottom: 16 }} />
      <h2 style={{ color: '#1e293b', marginBottom: 8 }}>Car not found</h2>
      <Link to="/all-cars"><button className="btn btn-primary">← Go Back</button></Link>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/all-cars">
            <button className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</button>
          </Link>
          <div>
            <div className="page-title" style={{ fontSize: 16 }}>{car.name}</div>
            <div className="page-subtitle">App ID: {car.appId} · {car.location}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline">Compare</button>
          <button className="btn btn-primary"><Phone size={14} /> Contact Dealer</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Visual */}
          <div className="card">
            <div style={{
              height: 220, background: `linear-gradient(135deg, ${car.color_hex}15, ${car.color_hex}35)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <Car size={90} color={car.color_hex} />
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: '#4f46e5', color: 'white', fontSize: 11,
                fontWeight: 700, padding: '4px 10px', borderRadius: 6
              }}>BID N DRIVE</div>
              {car.acceptance && (
                <div style={{
                  position: 'absolute', bottom: 12, left: 12,
                  background: '#dcfce7', color: '#16a34a', fontSize: 11,
                  fontWeight: 600, padding: '4px 10px', borderRadius: 6
                }}>✓ {car.acceptance}</div>
              )}
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge blue">⭐ Engine {car.engine}</span>
                <span className="badge gray">🛣 {car.km} km</span>
                <span className="badge green">{car.owner}</span>
                <span className="badge yellow">{car.fuel}</span>
                <span className="badge purple">{car.year}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="card">
            <div className="card-header"><span className="card-title">Vehicle Information</span></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Make', value: car.make, icon: Car },
                  { label: 'Model', value: car.model, icon: Car },
                  { label: 'Year', value: car.year, icon: Calendar },
                  { label: 'Fuel Type', value: car.fuel, icon: Fuel },
                  { label: 'Owner Type', value: car.owner, icon: User },
                  { label: 'Location', value: car.location, icon: MapPin },
                  { label: 'Dealer Code', value: car.dealerCode, icon: Tag },
                  { label: 'App ID', value: car.appId, icon: Tag },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{ padding: 12, background: '#f8fafc', borderRadius: 8, display: 'flex', gap: 10 }}>
                    <Icon size={15} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Bid timer */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🔴 Live Bid Status</span>
              <span className="badge red">Active</span>
            </div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                {[['00','hr'],['00','min'],['00','sec']].map(([v, l], i) => (
                  <div key={i} style={{ background: '#ef4444', color: 'white', borderRadius: 10, padding: '12px 16px', minWidth: 60 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 10, opacity: 0.9, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                🏷 Place Bid Now
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="card-header"><span className="card-title">Pricing Details</span></div>
            <div className="card-body">
              {[
                { label: 'Highest Nego Price', value: car.highestNego },
                { label: 'Seller Ask Price', value: car.sellerAsk, highlight: true },
                { label: 'Lead Price', value: car.leadPrice },
                { label: 'Target Price (TP)', value: car.targetPrice, highlight: true },
                { label: 'Token Date', value: car.tokenDate },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="profile-stat-row">
                  <span className="profile-stat-label">{label}</span>
                  <span style={{ fontWeight: 700, color: highlight ? '#4f46e5' : '#1e293b', fontSize: 13 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dealer */}
          <div className="card">
            <div className="card-header"><span className="card-title">Dealer Info</span></div>
            <div className="card-body">
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{car.dealerName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Code: {car.dealerCode}</div>
              </div>
              <div className="profile-stat-row"><span className="profile-stat-label">Location</span><span className="profile-stat-value">{car.location}</span></div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Phone size={14} /> Contact Dealer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
