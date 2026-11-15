import { useState, useRef, useEffect } from 'react'
import {
  Search, SlidersHorizontal, ArrowUpDown, Car, Grid3X3, List,
  MapPin, Fuel, Gauge, User, MessageSquare, Send, X, ChevronDown,
  Check, Clock, ShieldCheck, Zap, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars } from '../data/mockData'

const TYPE_FILTERS = ['ALL', 'Auction', 'BNB', 'Touch and Buy', 'Re-auction']

function CountdownBox() {
  return (
    <div className="countdown">
      {[['00', 'hr'], ['00', 'min'], ['00', 'sec']].map(([val, lbl], i) => (
        <div key={i} className="countdown-box">
          {val}
          <span className="countdown-label">{lbl}</span>
        </div>
      ))}
    </div>
  )
}

function CarImage({ car, height = '100%' }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: `linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(241,245,249,0.7) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${car.color_hex}18 0%, transparent 70%)`
        }}
      />
      <Car size={height === '100%' ? 32 : 54} color={car.color_hex || '#0071e3'} strokeWidth={1.75} />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#1d1d1f',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.8px',
          textAlign: 'center',
          padding: '2px 0',
          textTransform: 'uppercase'
        }}
      >
        BID N DRIVE
      </div>
    </div>
  )
}

const stop = e => { e.preventDefault(); e.stopPropagation() }

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
    <div className="type-dd" ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className={`type-dd-btn${value !== 'ALL' ? ' filtered' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 38,
          padding: '0 14px',
          borderRadius: 9999,
          background: value !== 'ALL' ? 'rgba(0, 113, 227, 0.1)' : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${value !== 'ALL' ? 'rgba(0, 113, 227, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`,
          color: value !== 'ALL' ? '#0071e3' : '#1d1d1f',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.16s ease'
        }}
      >
        <span>{value === 'ALL' ? 'All Types' : value}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 120,
            minWidth: 190,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: 14,
            padding: 5,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 1), 0 16px 36px -6px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          {TYPE_FILTERS.map(t => (
            <div
              key={t}
              role="option"
              aria-selected={value === t}
              onClick={() => { onChange(t); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: value === t ? 600 : 500,
                color: value === t ? '#0071e3' : '#1d1d1f',
                background: value === t ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.12s'
              }}
              onMouseEnter={e => { if (value !== t) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { if (value !== t) e.currentTarget.style.background = 'transparent' }}
            >
              <span>{t}</span>
              {value === t && <Check size={14} color="#0071e3" strokeWidth={2.5} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CommentsPanel({ comments, onAdd, onDelete }) {
  const [text, setText] = useState('')

  const submit = () => {
    const val = text.trim()
    if (!val) return
    onAdd(val)
    setText('')
  }

  return (
    <div
      style={{
        background: 'rgba(248, 250, 252, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '16px 24px 18px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#6e6e73', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          Auction Activity & Notes ({comments.length})
        </div>
      </div>

      {comments.length === 0 ? (
        <div style={{ fontSize: 13, color: '#86868b', padding: '6px 0 12px' }}>
          No comments yet on this vehicle. Add a remark for the bidding team.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, maxHeight: 180, overflowY: 'auto' }}>
          {comments.map(c => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: 10,
                padding: '9px 12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#86868b', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <strong style={{ color: '#1d1d1f' }}>{c.author}</strong>
                  <span>·</span>
                  <span>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{c.text}</div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(c.id)}
                aria-label="Delete comment"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#aeaeb2',
                  cursor: 'pointer',
                  padding: 3,
                  borderRadius: 6,
                  display: 'inline-flex'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ff3b30'; e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#aeaeb2'; e.currentTarget.style.background = 'transparent' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.09)',
            borderRadius: 9999,
            padding: '9px 16px',
            fontSize: 13,
            color: '#1d1d1f',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
          }}
          placeholder="Add an internal note or bidding update..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={submit}
          disabled={!text.trim()}
          style={{ padding: '8px 16px', gap: 6 }}
        >
          <Send size={12} /> Post
        </button>
      </div>
    </div>
  )
}

function CarRow({ car }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(car.comments || [])

  const addComment = text =>
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: 'You (Sales)',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])

  const deleteComment = id => setComments(prev => prev.filter(c => c.id !== id))

  const details = [
    { label: 'Highest Nego Price', value: car.highestNego },
    { label: 'Seller Ask Price', value: car.sellerAsk, isHighlight: true },
    { label: 'Lead Price', value: car.leadPrice },
    { label: 'Target Price (TP)', value: car.targetPrice, isHighlight: true },
    { label: 'Token Date', value: car.tokenDate }
  ]

  return (
    <div
      style={{
        marginBottom: 16,
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
        overflow: 'hidden',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease'
      }}
      className="apple-car-row-container"
    >
      <Link to={`/all-cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 20,
            padding: '20px 24px',
            cursor: 'pointer'
          }}
        >
          {/* Thumbnail */}
          <div style={{ width: 130, height: 96, flexShrink: 0, position: 'relative' }}>
            <CarImage car={car} height={96} />
            <button
              onClick={stop}
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 6,
                fontSize: 10,
                padding: '2px 6px',
                cursor: 'pointer',
                color: '#0071e3',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
              }}
            >
              Compare
            </button>
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.02em' }}>
                {car.name}
              </div>
              {car.type && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: 'rgba(0, 113, 227, 0.08)',
                    color: '#0071e3',
                    border: '1px solid rgba(0, 113, 227, 0.2)'
                  }}
                >
                  {car.type}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <span className="car-tag">Engine {car.engine}</span>
              <span className="car-tag">{car.km} km</span>
              <span className="car-tag">{car.owner}</span>
              <span className="car-tag">{car.fuel}</span>
              <span className="car-tag">{car.year}</span>
            </div>

            <div style={{ fontSize: 12, color: '#86868b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Enquiry ID: <strong style={{ color: '#475569' }}>{car.appId}</strong></span>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={11} /> {car.location}
              </span>
            </div>

            {/* Micro details grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px 16px',
                marginTop: 12,
                padding: '10px 14px',
                background: 'rgba(248, 250, 252, 0.65)',
                borderRadius: 12,
                border: '1px solid rgba(0, 0, 0, 0.04)'
              }}
            >
              {details.map(({ label, value, isHighlight }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isHighlight ? '#0071e3' : '#1d1d1f', marginTop: 2 }}>
                    {value || '—'}
                  </div>
                </div>
              ))}
            </div>

            {car.acceptance && (
              <div className="high-accept" style={{ marginTop: 10 }}>
                ✓ {car.acceptance}
              </div>
            )}
          </div>

          {/* Pricing & CTA Column */}
          <div
            style={{
              width: 190,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
              paddingLeft: 20
            }}
          >
            <div style={{ width: '100%', textAlign: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                <CountdownBox />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                <span className="sidebar-live-dot" style={{ background: '#ff3b30', boxShadow: '0 0 6px #ff3b30' }} />
                <span>Active Auction</span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={stop}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', padding: '9px 14px' }}
              >
                Place Bid Now
              </button>

              <button
                type="button"
                onClick={e => { stop(e); setShowComments(v => !v) }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '7px 10px',
                  borderRadius: 9999,
                  background: showComments ? 'rgba(0, 113, 227, 0.08)' : 'rgba(255, 255, 255, 0.65)',
                  border: `1px solid ${showComments ? 'rgba(0, 113, 227, 0.25)' : 'rgba(0, 0, 0, 0.08)'}`,
                  color: showComments ? '#0071e3' : '#6e6e73',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.16s ease'
                }}
              >
                <MessageSquare size={13} />
                <span>Notes{comments.length > 0 && ` (${comments.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showComments && (
        <CommentsPanel comments={comments} onAdd={addComment} onDelete={deleteComment} />
      )}
    </div>
  )
}

function CarCard({ car }) {
  const spec = (Icon, text) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 500 }}>
      <Icon size={12} color="#86868b" /> {text}
    </span>
  )

  return (
    <Link to={`/all-cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'all 0.18s ease'
        }}
      >
        {/* Image banner */}
        <div style={{ position: 'relative', height: 160 }}>
          <CarImage car={car} height={160} />
          <button
            onClick={stop}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 6,
              fontSize: 10,
              padding: '3px 7px',
              cursor: 'pointer',
              color: '#0071e3',
              fontWeight: 700,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          >
            Compare
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              color: '#ff3b30',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.3px'
            }}
          >
            00h : 00m : 00s
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {car.name}
            </div>
            <div style={{ fontSize: 11, color: '#86868b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} /> {car.location} · ID: {car.appId}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
            {spec(Gauge, `${car.km} km`)}
            {spec(Fuel, car.fuel)}
            {spec(User, car.owner)}
            {spec(Car, `Engine ${car.engine}`)}
          </div>

          {/* Price grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              background: 'rgba(248, 250, 252, 0.75)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(0, 0, 0, 0.04)'
            }}
          >
            {[
              ['Highest Nego', car.highestNego, false],
              ['Seller Ask', car.sellerAsk, true],
              ['Target Price', car.targetPrice, true],
              ['Token Date', car.tokenDate, false]
            ].map(([label, value, hl]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: '#86868b', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: hl ? '#0071e3' : '#1d1d1f' }}>{value || '—'}</div>
              </div>
            ))}
          </div>

          {car.acceptance && (
            <div className="high-accept" style={{ alignSelf: 'flex-start' }}>
              ✓ {car.acceptance}
            </div>
          )}

          <button
            onClick={stop}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', padding: '9px 0' }}
          >
            Place Bid Now
          </button>
        </div>
      </div>
    </Link>
  )
}

function ViewToggle({ view, onChange }) {
  const btn = (key, Icon, label) => {
    const active = view === key
    return (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        title={label}
        aria-label={label}
        aria-pressed={active}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 32,
          border: 'none',
          cursor: 'pointer',
          borderRadius: 9999,
          background: active ? '#ffffff' : 'transparent',
          color: active ? '#0071e3' : '#86868b',
          boxShadow: active ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
      </button>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        padding: 3,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 9999,
        background: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {btn('row', List, 'List view')}
      {btn('card', Grid3X3, 'Card view')}
    </div>
  )
}

export default function AllCars() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('row')
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Top Filter and Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
          gap: 16,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="world-badge">
            <Car size={14} />
            <span>All Vehicles ({filteredCars.length})</span>
          </div>

          {(typeFilter !== 'ALL' || search) && (
            <button
              type="button"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#ff3b30',
                background: 'rgba(255, 59, 48, 0.1)',
                padding: '4px 10px',
                borderRadius: 9999,
                border: '1px solid rgba(255, 59, 48, 0.2)',
                cursor: 'pointer'
              }}
              onClick={() => { setTypeFilter('ALL'); setSearch('') }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end', minWidth: 320 }}>
          <TypeDropdown value={typeFilter} onChange={setTypeFilter} />

          <div className="filter-search" style={{ flex: 1, maxWidth: 440, minWidth: 240, height: 38 }}>
            <Search size={15} color="#86868b" />
            <input
              placeholder="Search by car make, model, enquiry ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', padding: 2 }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Sub Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 28px',
          background: 'rgba(248, 250, 252, 0.5)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
          fontSize: 12,
          fontWeight: 600,
          color: '#86868b'
        }}
      >
        <span>{view === 'row' ? 'Live Vehicle Specifications & Token Matrix' : `Showing ${filteredCars.length} vehicles`}</span>
        {view === 'row' && <span>Pricing & Action</span>}
      </div>

      {/* Listing Content Area */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {filteredCars.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 60,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 480,
              margin: '40px auto'
            }}
          >
            <Car size={48} style={{ opacity: 0.25, marginBottom: 14, color: '#0071e3' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>No vehicles match your criteria</div>
            <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>
              Try searching with a different vehicle name, enquiry ID, or clear active filters.
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => { setTypeFilter('ALL'); setSearch('') }}
            >
              Reset Filters
            </button>
          </div>
        ) : view === 'row' ? (
          filteredCars.map(car => <CarRow key={car.id} car={car} />)
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20
            }}
          >
            {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  )
}
