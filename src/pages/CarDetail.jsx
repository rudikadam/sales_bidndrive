import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Car, MapPin, User, Fuel, Calendar, Tag,
  CheckCircle2, TrendingUp, Users, ShieldCheck, Clock,
  DollarSign, Sparkles, AlertCircle
} from 'lucide-react'
import { cars, bidders } from '../data/mockData'

export default function CarDetail() {
  const { id } = useParams()
  const car = cars.find(c => c.id === Number(id))

  if (!car) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div
          className="card"
          style={{ maxWidth: 440, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}
        >
          <Car size={56} style={{ color: '#86868b', opacity: 0.3, marginBottom: 16 }} />
          <h2 style={{ color: '#1d1d1f', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>Vehicle Not Found</h2>
          <p style={{ color: '#86868b', fontSize: 13, marginBottom: 20 }}>
            The vehicle listing you are searching for does not exist or may have been removed from the auction floor.
          </p>
          <Link to="/all-cars">
            <button className="btn btn-primary">
              <ArrowLeft size={14} /> Back to Vehicles
            </button>
          </Link>
        </div>
      </div>
    )
  }

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
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/all-cars">
            <button className="btn btn-outline btn-sm" style={{ padding: '6px 12px' }}>
              <ArrowLeft size={14} /> Back
            </button>
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="page-title" style={{ fontSize: 20, margin: 0 }}>{car.name}</h1>
              {car.type && (
                <span className="badge blue" style={{ fontSize: 11 }}>
                  {car.type}
                </span>
              )}
            </div>
            <div className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Enquiry ID: <strong style={{ color: '#1d1d1f' }}>{car.appId}</strong></span>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={12} /> {car.location}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline">
            Compare Vehicle
          </button>
          <button className="btn btn-primary">
            <DollarSign size={15} /> Place Live Bid
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Visual & Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Visual Showcase Card */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div
              style={{
                height: 240,
                background: `linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(241,245,249,0.75) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 50%, ${car.color_hex}22 0%, transparent 70%)`
                }}
              />
              <Car size={96} color={car.color_hex || '#0071e3'} strokeWidth={1.5} />

              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  color: '#1d1d1f',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  padding: '4px 10px',
                  borderRadius: 6,
                  textTransform: 'uppercase'
                }}
              >
                BID N DRIVE PRO
              </div>

              {car.acceptance && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 14,
                    background: 'rgba(52, 199, 89, 0.15)',
                    backdropFilter: 'blur(12px)',
                    color: '#15803d',
                    border: '1px solid rgba(52, 199, 89, 0.3)',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <CheckCircle2 size={13} color="#15803d" />
                  <span>{car.acceptance}</span>
                </div>
              )}
            </div>

            <div className="card-body" style={{ padding: '16px 20px' }}>
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

          {/* Vehicle Information Matrix */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Technical Specifications & History</span>
              <span className="badge green" style={{ gap: 4 }}>
                <ShieldCheck size={12} /> 140+ Points Inspected
              </span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Make', value: car.make, icon: Car },
                  { label: 'Model', value: car.model, icon: Car },
                  { label: 'Year of Registration', value: car.year, icon: Calendar },
                  { label: 'Fuel Type', value: car.fuel, icon: Fuel },
                  { label: 'Ownership', value: car.owner, icon: User },
                  { label: 'Location & RTO', value: car.location, icon: MapPin },
                  { label: 'Auction Enquiry ID', value: car.appId, icon: Tag },
                  { label: 'Condition Grade', value: 'Grade A (Pristine)', icon: CheckCircle2 },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(248, 250, 252, 0.7)',
                      borderRadius: 12,
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(0, 113, 227, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0071e3',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginTop: 1 }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bidding, Pricing & Top Bidders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Live Auction Countdown Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="sidebar-live-dot" style={{ background: '#ff3b30', boxShadow: '0 0 6px #ff3b30' }} />
                <span className="card-title">Live Auction Floor</span>
              </div>
              <span className="badge red">Ends Soon</span>
            </div>
            <div className="card-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                {[
                  ['00', 'HOURS'],
                  ['00', 'MINUTES'],
                  ['00', 'SECONDS']
                ].map(([val, lbl], i) => (
                  <div
                    key={i}
                    style={{
                      background: 'linear-gradient(180deg, #ff453a 0%, #ff3b30 100%)',
                      color: 'white',
                      borderRadius: 12,
                      padding: '12px 16px',
                      minWidth: 70,
                      boxShadow: '0 4px 14px rgba(255, 59, 48, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{val}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.9, marginTop: 4, letterSpacing: '0.6px' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14 }}
              >
                Place Live Bid Now
              </button>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Pricing Matrix</span>
            </div>
            <div className="card-body" style={{ padding: '8px 20px' }}>
              {[
                { label: 'Highest Nego Price', value: car.highestNego, highlight: false },
                { label: 'Seller Ask Price', value: car.sellerAsk, highlight: true },
                { label: 'Lead Price', value: car.leadPrice, highlight: false },
                { label: 'Target Price (TP)', value: car.targetPrice, highlight: true },
                { label: 'Token Date', value: car.tokenDate, highlight: false },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="profile-stat-row" style={{ padding: '12px 0' }}>
                  <span className="profile-stat-label" style={{ fontSize: 13 }}>{label}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: highlight ? '#0071e3' : '#1d1d1f',
                      fontSize: 14
                    }}
                  >
                    {value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bidders & Live Activity */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={15} color="#0071e3" /> Top Bidders
              </span>
              <Link to="/bidders">
                <span style={{ fontSize: 12, color: '#0071e3', fontWeight: 600, cursor: 'pointer' }}>
                  View All →
                </span>
              </Link>
            </div>
            <div className="card-body" style={{ padding: '14px 18px' }}>
              {carBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#86868b', fontSize: 13 }}>
                  <Users size={32} style={{ opacity: 0.3, marginBottom: 8, display: 'inline-block', color: '#0071e3' }} />
                  <div>No bids placed yet on this vehicle.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {carBids.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: b.status === 'Leading' ? 'rgba(52, 199, 89, 0.08)' : 'rgba(248, 250, 252, 0.7)',
                        border: `1px solid ${b.status === 'Leading' ? 'rgba(52, 199, 89, 0.25)' : 'rgba(0, 0, 0, 0.04)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>{b.bidderName}</div>
                        <div style={{ fontSize: 11, color: '#86868b' }}>{b.bidderCode} · {b.time}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: b.status === 'Leading' ? '#15803d' : '#1d1d1f' }}>
                          {b.bidAmount}
                        </div>
                        <span className={`badge ${b.status === 'Leading' ? 'green' : 'gray'}`} style={{ fontSize: 10, padding: '2px 7px' }}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/bidders" style={{ textDecoration: 'none', display: 'block', marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Users size={13} /> Manage Live Bidders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
