import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Car, MapPin, User, Fuel, Calendar, Tag, CheckCircle2, TrendingUp, Users } from 'lucide-react'
import { cars, bidders } from '../data/mockData'

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

  // Find bidders actively bidding on this vehicle
  const carBids = bidders.flatMap(b =>
    (b.activeBids || [])
      .filter(ab => ab.carId === car.id)
      .map(ab => ({
        bidderName: b.name,
        bidderCode: b.code,
        bidderStatus: b.status,
        ...ab
      }))
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
            <div className="page-subtitle">Enquiry ID: {car.appId} · {car.location}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline">Compare</button>
          <button className="btn btn-primary">🏷 Place Bid</button>
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
                {car.type && <span className="badge gray">{car.type}</span>}
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
                  { label: 'Enquiry ID', value: car.appId, icon: Tag },
                  { label: 'Inspection Status', value: '140+ Points Certified', icon: CheckCircle2 },
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
              <span className="badge red">Active Auction</span>
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

          {/* Top Bidders & Live Activity */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={15} color="#4f46e5" /> Top Bidders
              </span>
              <Link to="/bidders">
                <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>View All Bidders →</span>
              </Link>
            </div>
            <div className="card-body" style={{ padding: '12px 16px' }}>
              {carBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: 13 }}>
                  <Users size={28} style={{ opacity: 0.4, marginBottom: 6, display: 'inline-block' }} />
                  <div>No bids placed yet. Be the first bidder!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {carBids.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: b.status === 'Leading' ? '#f0fdf4' : '#f8fafc',
                        border: `1px solid ${b.status === 'Leading' ? '#bbf7d0' : '#e2e8f0'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{b.bidderName}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{b.bidderCode} · {b.time}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: b.status === 'Leading' ? '#16a34a' : '#1e293b' }}>
                          {b.bidAmount}
                        </div>
                        <span className={`badge ${b.status === 'Leading' ? 'green' : 'gray'}`} style={{ fontSize: 10, padding: '2px 6px' }}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/bidders" style={{ textDecoration: 'none' }}>
                <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                  <Users size={13} /> Manage Bidders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
