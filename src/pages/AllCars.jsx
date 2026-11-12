import { useState } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, Car, Grid3X3, List } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars, dealers } from '../data/mockData'

function CountdownBox() {
  return (
    <div className="countdown">
      {[['00','hr'],['00','min'],['00','sec']].map(([v, l], i) => (
        <div key={i} className="countdown-box">{v}<span className="countdown-label">{l}</span></div>
      ))}
    </div>
  )
}

function CarRow({ car }) {
  return (
    <Link to={`/all-cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="car-row">
        <input type="checkbox" className="car-checkbox" onClick={e => e.stopPropagation()} onChange={() => {}} />

        {/* Car Image placeholder */}
        <div className="car-img">
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${car.color_hex}22, ${car.color_hex}44)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <Car size={30} color={car.color_hex} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: '#4f46e5', color: 'white', fontSize: 8,
              fontWeight: 700, textAlign: 'center', padding: '2px 0'
            }}>BID N DRIVE</div>
          </div>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            style={{
              position: 'absolute', top: 4, right: 4, background: 'white',
              border: 'none', borderRadius: 3, fontSize: 10, padding: '2px 5px',
              cursor: 'pointer', color: '#4f46e5', fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
          >Compare</button>
        </div>

        {/* Info */}
        <div className="car-info">
          <div className="car-name">{car.name}</div>
          <div className="car-tags">
            <span className="car-tag">Engine {car.engine}</span>
            <span className="car-tag">{car.km} km</span>
            <span className="car-tag">{car.owner}</span>
            <span className="car-tag">{car.fuel}</span>
          </div>
          <div className="car-meta">App ID: {car.appId} 🔗 &nbsp;|&nbsp; {car.location}</div>
          <div className="car-meta">Dealer Name: {car.dealerName} &nbsp;·&nbsp; Dealer Code: {car.dealerCode}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 20px', marginTop: 8, fontSize: 12 }}>
            <div style={{ color: '#64748b' }}>Highest Nego Price</div>
            <div style={{ color: '#64748b' }}>Seller Ask Price</div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{car.highestNego}</div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{car.sellerAsk}</div>
            <div style={{ color: '#64748b', marginTop: 4 }}>Lead Price</div>
            <div style={{ color: '#64748b', marginTop: 4 }}>Target Price (TP)</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{car.leadPrice}</div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{car.targetPrice}</div>
            <div style={{ color: '#64748b', marginTop: 4 }}>Token Date</div>
            <div />
            <div style={{ fontSize: 12, color: '#475569' }}>{car.tokenDate}</div>
          </div>
          {car.acceptance && <div className="high-accept">✓ {car.acceptance}</div>}
        </div>

        {/* Right side */}
        <div className="car-pricing">
          <CountdownBox />
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 10 }}>No Car high...</div>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >Bid Now</button>
        </div>
      </div>
    </Link>
  )
}

export default function AllCars() {
  const [search, setSearch] = useState('')
  const [dealerSearch, setDealerSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Dealers')

  const filteredCars = cars.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dealerName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDealers = dealers.filter(d =>
    d.name.toLowerCase().includes(dealerSearch.toLowerCase())
  )

  return (
    <div className="two-panel">
      {/* ---- Dealer Panel (left) ---- */}
      <div className="dealer-panel">

        <div className="dealer-search">
          <div className="filter-search" style={{ maxWidth: '100%', flex: 1 }}>
            <Search size={14} color="#94a3b8" />
            <input placeholder="Search..." value={dealerSearch} onChange={e => setDealerSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center' }}><ArrowUpDown size={12} /></button>
            <button className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center' }}><SlidersHorizontal size={12} /></button>
          </div>
        </div>

        <div className="dealer-tabs">
          {['Dealers', 'Reassigned Dealers'].map(tab => (
            <div key={tab} className={`dealer-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredDealers.map(dealer => (
            <div key={dealer.id} className="dealer-card">
              <div className="dealer-online">
                <span className="dot" style={{ background: dealer.status === 'online' ? '#22c55e' : '#94a3b8' }} />
                {dealer.status === 'online' ? 'Online' : 'Offline'}
              </div>
              <div className="dealer-name">{dealer.name}</div>
              <div className="dealer-actions">
                <span className="badge gray" style={{ fontSize: 10 }}>{dealer.type}</span>
                {!dealer.contacted
                  ? <span className="badge red" style={{ fontSize: 10 }}>Not Contacted</span>
                  : <span className="badge green" style={{ fontSize: 10 }}>Contacted</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="page-btn" style={{ width: 'auto', padding: '0 10px', fontSize: 12 }}>← Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn" style={{ width: 'auto', padding: '0 10px', fontSize: 12 }}>Next →</button>
        </div>
      </div>

      {/* ---- Car Listings (right) ---- */}
      <div className="panel-main">
        {/* Top bar */}
        <div className="top-section">
          <div className="top-section-left">
            <div className="world-badge">🌐 BND WORLD</div>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>A2-2</span>
            <button style={{ fontSize: 11, color: '#ef4444', background: '#fef2f2', padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          <div className="top-section-left" style={{ gap: 8 }}>
            <button className="btn btn-sm btn-outline">Touch & Buy ▾</button>
            <button className="btn btn-sm btn-outline">Reco Info ▾</button>
            <div className="search-box">
              <Search size={14} color="#94a3b8" />
              <input placeholder="Search cars by name or appointment..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display: 'flex', background: '#f8fafc', padding: '8px 20px 8px 54px',
          borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 600,
          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px',
          justifyContent: 'space-between'
        }}>
          <span>Basic Info</span>
          <span>Details</span>
        </div>

        {/* Car rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredCars.length === 0
            ? <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                <Car size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <div>No cars found matching your search</div>
              </div>
            : filteredCars.map(car => <CarRow key={car.id} car={car} />)
          }
        </div>
      </div>
    </div>
  )
}
