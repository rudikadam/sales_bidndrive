import { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, Car, Grid3X3, List, MapPin, Fuel, Gauge, User, MessageSquare, Send, X, ChevronDown, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars } from '../data/mockData'

/* ---------- Config ---------- */

const TYPE_FILTERS = ['ALL', 'Auction', 'BNB', 'Touch and Buy', 'Re-auction']

/* ---------- Shared pieces ---------- */

function CountdownBox() {
  return (
    <div className="countdown">
      {[['00', 'hr'], ['00', 'min'], ['00', 'sec']].map(([v, l], i) => (
        <div key={i} className="countdown-box">{v}<span className="countdown-label">{l}</span></div>
      ))}
    </div>
  )
}

function CarImage({ car, height = '100%' }) {
  return (
    <div
      style={{
        width: '100%', height,
        background: `linear-gradient(135deg, ${car.color_hex}22, ${car.color_hex}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
      }}
    >
      <Car size={height === '100%' ? 30 : 56} color={car.color_hex} />
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#4f46e5', color: 'white', fontSize: 8,
          fontWeight: 700, textAlign: 'center', padding: '2px 0'
        }}
      >BID N DRIVE</div>
    </div>
  )
}

const stop = e => { e.preventDefault(); e.stopPropagation() }

/* ---------- Type dropdown ---------- */

function TypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="type-dd" ref={ref}>
      <button
        className={`type-dd-btn${value !== 'ALL' ? ' filtered' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value === 'ALL' ? 'ALL' : value}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>

      {open && (
        <div className="type-dd-menu" role="listbox">
          {TYPE_FILTERS.map(t => (
            <div
              key={t}
              role="option"
              aria-selected={value === t}
              className={`type-dd-item${value === t ? ' active' : ''}`}
              onClick={() => { onChange(t); setOpen(false) }}
            >
              <span>{t}</span>
              {value === t && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Comments ---------- */

function CommentsPanel({ comments, onAdd, onDelete }) {
  const [text, setText] = useState('')

  const submit = () => {
    const value = text.trim()
    if (!value) return
    onAdd(value)
    setText('')
  }

  return (
    <div className="car-comments">
      {comments.length === 0 ? (
        <div style={{ fontSize: 13, color: '#94a3b8', padding: '4px 0 8px' }}>No comments yet. Add the first one.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
          {comments.map(c => (
            <div key={c.id} className="car-comment">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>
                  <strong style={{ color: '#1e293b' }}>{c.author}</strong> · {c.time}
                </div>
                <div style={{ fontSize: 14, color: '#334155', whiteSpace: 'pre-wrap' }}>{c.text}</div>
              </div>
              <button className="comment-delete" onClick={() => onDelete(c.id)} aria-label="Delete comment" title="Delete">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="comment-input"
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
        />
        <button className="btn btn-primary btn-sm" onClick={submit} disabled={!text.trim()} style={{ gap: 4 }}>
          <Send size={13} /> Post
        </button>
      </div>
    </div>
  )
}

/* ---------- Row view ---------- */

function CarRow({ car }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(car.comments || [])

  const addComment = text =>
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: 'You',
        text,
        time: new Date().toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      }
    ])

  const deleteComment = id => setComments(prev => prev.filter(c => c.id !== id))

  const details = [
    ['Highest Nego Price', car.highestNego],
    ['Seller Ask Price', car.sellerAsk],
    ['Lead Price', car.leadPrice],
    ['Target Price (TP)', car.targetPrice],
    ['Token Date', car.tokenDate]
  ]

  return (
    <>
      <Link to={`/all-cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="car-row">
          <div className="car-img">
            <CarImage car={car} />
            <button
              onClick={stop}
              style={{
                position: 'absolute', top: 4, right: 4, background: 'white',
                border: 'none', borderRadius: 3, fontSize: 10, padding: '2px 5px',
                cursor: 'pointer', color: '#4f46e5', fontWeight: 600,
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
              }}
            >Compare</button>
          </div>

          <div className="car-info">
            <div className="car-name">{car.name}</div>

            <div className="car-tags">
              <span className="car-tag">Engine {car.engine}</span>
              <span className="car-tag">{car.km} km</span>
              <span className="car-tag">{car.owner}</span>
              <span className="car-tag">{car.fuel}</span>
              {car.type && <span className="car-tag" style={{ background: '#eef2ff', color: '#4f46e5' }}>{car.type}</span>}
            </div>

            <div className="car-meta">Enquiry ID: {car.appId} &nbsp;|&nbsp; {car.location}</div>

            <div className="detail-grid">
              {details.map(([label, value]) => (
                <div key={label} className="detail-item">
                  <div className="detail-label">{label}</div>
                  <div className="detail-value">{value}</div>
                </div>
              ))}
            </div>

            {car.acceptance && <div className="high-accept">✓ {car.acceptance}</div>}
          </div>

          <div className="car-pricing">
            <CountdownBox />
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Live Auction</div>
            <button onClick={stop} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Bid Now
            </button>
            <button
              onClick={e => { stop(e); setShowComments(v => !v) }}
              className={`comment-toggle${showComments ? ' active' : ''}`}
              aria-expanded={showComments}
            >
              <MessageSquare size={13} /> Comments{comments.length > 0 && ` (${comments.length})`}
            </button>
          </div>
        </div>
      </Link>

      {showComments && (
        <CommentsPanel comments={comments} onAdd={addComment} onDelete={deleteComment} />
      )}
    </>
  )
}

/* ---------- Card view ---------- */

function CarCard({ car }) {
  const spec = (Icon, text) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569' }}>
      <Icon size={12} color="#94a3b8" /> {text}
    </span>
  )

  return (
    <Link to={`/all-cars/${car.id}`} className="car-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="car-card">
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <CarImage car={car} height={150} />
          <button
            onClick={stop}
            style={{
              position: 'absolute', top: 8, right: 8, background: 'white', border: 'none',
              borderRadius: 4, fontSize: 11, padding: '3px 8px', cursor: 'pointer',
              color: '#4f46e5', fontWeight: 600, boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
          >Compare</button>
          <div
            style={{
              position: 'absolute', bottom: 22, right: 8, background: 'rgba(15,23,42,0.85)',
              color: 'white', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4
            }}
          >00h : 00m : 00s</div>
        </div>

        {/* Body */}
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>{car.name}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} /> {car.location}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
            {spec(Gauge, `${car.km} km`)}
            {spec(Fuel, car.fuel)}
            {spec(User, car.owner)}
            {spec(Car, `Engine ${car.engine}`)}
          </div>

          {/* Prices */}
          <div
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              background: '#f8fafc', borderRadius: 8, padding: 10
            }}
          >
            {[
              ['Highest Nego', car.highestNego],
              ['Seller Ask', car.sellerAsk],
              ['Target Price', car.targetPrice],
              ['Token Date', car.tokenDate]
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: '#64748b' }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#64748b' }}>
            Enquiry ID: {car.appId}
          </div>

          {car.acceptance && <div className="high-accept">✓ {car.acceptance}</div>}

          <button
            onClick={stop}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
          >Bid Now</button>
        </div>
      </div>
    </Link>
  )
}

/* ---------- View toggle ---------- */

function ViewToggle({ view, onChange }) {
  const btn = (key, Icon, label) => {
    const active = view === key
    return (
      <button
        key={key}
        onClick={() => onChange(key)}
        title={label}
        aria-label={label}
        aria-pressed={active}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 28, border: 'none', cursor: 'pointer', borderRadius: 6,
          background: active ? '#4f46e5' : 'transparent',
          color: active ? 'white' : '#64748b'
        }}
      >
        <Icon size={15} />
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', gap: 2, padding: 2, border: '1px solid #e2e8f0', borderRadius: 8, background: 'white' }}>
      {btn('row', List, 'Row view')}
      {btn('card', Grid3X3, 'Card view')}
    </div>
  )
}

/* ---------- Page ---------- */

export default function AllCars() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('row') // 'row' | 'card'
  const [typeFilter, setTypeFilter] = useState('ALL')

  const filteredCars = cars.filter(c => {
    const q = search.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      (c.appId && c.appId.toLowerCase().includes(q)) ||
      (c.make && c.make.toLowerCase().includes(q)) ||
      (c.model && c.model.toLowerCase().includes(q))

    const matchesType = typeFilter === 'ALL' || c.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="all-cars-page" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <style>{`
        /* ===== Row view: bold, large, full-width details ===== */
        .car-row .car-info { flex: 1; min-width: 0; }

        .car-row .car-name {
          font-size: 18px; font-weight: 600; color: #0f172a; line-height: 1.3;
        }
        .car-row .car-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .car-row .car-tag {
          font-size: 13px; font-weight: 500; color: #1e293b; padding: 4px 10px;
        }
        .car-row .car-meta {
          font-size: 13px; font-weight: 500; color: #64748b; margin-top: 6px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 14px 28px;
          margin-top: 14px;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          width: 100%;
          box-sizing: border-box;
        }
        .detail-label { font-size: 12px; font-weight: 500; color: #64748b; }
        .detail-value {
          font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 2px;
          word-break: break-word;
        }

        .car-row .high-accept { font-size: 13px; font-weight: 500; margin-top: 10px; }
        .car-row .car-pricing { width: 200px; flex-shrink: 0; }

        /* ===== Card view ===== */
        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          padding: 20px 24px;
          width: 100%;
          box-sizing: border-box;
        }
        .car-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: box-shadow .15s ease, border-color .15s ease;
        }
        .car-card-link { display: block; }
        .car-card-link:hover .car-card {
          border-color: #c7d2fe;
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.12);
        }
        .car-card-link:focus-visible .car-card {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }

        /* ===== Comments ===== */
        .comment-toggle {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          width: 100%; margin-top: 6px; padding: 5px 8px;
          border: 1px solid #e2e8f0; border-radius: 6px; background: #fff;
          color: #475569; font-size: 12px; font-weight: 600; cursor: pointer;
        }
        .comment-toggle:hover { border-color: #c7d2fe; color: #4f46e5; }
        .comment-toggle.active { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }
        .car-comments {
          background: #f8fafc; border-bottom: 1px solid #e2e8f0;
          padding: 12px 24px 14px 24px;
        }
        .car-comment {
          display: flex; gap: 8px; align-items: flex-start;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;
        }
        .comment-delete {
          border: none; background: transparent; color: #94a3b8; cursor: pointer;
          padding: 2px; border-radius: 4px; display: inline-flex;
        }
        .comment-delete:hover { color: #ef4444; background: #fef2f2; }
        .comment-input {
          flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px;
          font-size: 13px; outline: none; background: #fff;
        }
        .comment-input:focus { border-color: #4f46e5; }

        /* ===== Type dropdown ===== */
        .type-dd { position: relative; }
        .type-dd-btn {
          display: inline-flex; align-items: center; gap: 6px;
          height: 36px; padding: 0 12px; border: 1px solid #e2e8f0; border-radius: 8px;
          background: #fff; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer;
          white-space: nowrap;
        }
        .type-dd-btn:hover { border-color: #c7d2fe; color: #4f46e5; }
        .type-dd-btn.filtered { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }
        .type-dd-menu {
          position: absolute; top: calc(100% + 4px); left: 0; z-index: 50; min-width: 180px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
        .type-dd-item {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 8px 10px; border-radius: 6px; font-size: 13px; color: #334155; cursor: pointer;
        }
        .type-dd-item:hover { background: #f1f5f9; }
        .type-dd-item.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
      `}</style>

      {/* Top bar */}
      <div className="top-section" style={{ flexWrap: 'wrap', gap: 12, padding: '12px 24px' }}>
        <div className="top-section-left">
          <div className="world-badge"> All Vehicles ({filteredCars.length})</div>
          <button
            style={{ fontSize: 11, color: '#ef4444', background: '#fef2f2', padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer' }}
            onClick={() => { setTypeFilter('ALL'); setSearch('') }}
          >Clear Filters</button>
        </div>

        <div className="top-section-left" style={{ gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 320 }}>
          <TypeDropdown value={typeFilter} onChange={setTypeFilter} />
          <div className="search-box" style={{ flex: 1, maxWidth: 520, minWidth: 260, height: 36 }}>
            <Search size={16} color="#94a3b8" />
            <input
              style={{ fontSize: 14 }}
              placeholder="Search cars by name, model or enquiry ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Sub header: result count */}
      <div
        style={{
          display: 'flex', background: '#f8fafc',
          padding: '8px 24px',
          borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600,
          color: '#64748b', justifyContent: 'space-between'
        }}
      >
        <span>{view === 'row' ? 'Vehicle Information' : `Showing ${filteredCars.length} vehicles`}</span>
        {view === 'row' && <span>Pricing & Bid Details</span>}
      </div>

      {/* Listings */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredCars.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <Car size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div>No cars found matching your search</div>
          </div>
        ) : view === 'row' ? (
          filteredCars.map(car => <CarRow key={car.id} car={car} />)
        ) : (
          <div className="car-grid">
            {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  )
}
