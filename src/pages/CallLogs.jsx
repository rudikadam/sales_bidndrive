import { useState } from 'react'
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  Search, Filter, Clock, CheckCircle2, XCircle, X,
  PhoneCall, ShieldCheck
} from 'lucide-react'
import { callLogs } from '../data/mockData'

function CallIcon({ type, status }) {
  if (status === 'Missed') return <PhoneMissed size={15} color="#ff3b30" />
  if (type === 'Incoming') return <PhoneIncoming size={15} color="#34c759" />
  return <PhoneOutgoing size={15} color="#0071e3" />
}

export default function CallLogs() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeCall, setActiveCall] = useState(null)

  const connected = callLogs.filter(c => c.status === 'Connected').length
  const missed = callLogs.filter(c => c.status === 'Missed').length

  const filteredLogs = callLogs.filter(log => {
    const bidderName = (log.bidder || 'Unknown Bidder').toLowerCase()
    const matchesSearch = bidderName.includes(search.toLowerCase()) || log.date.includes(search)
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bidder Call Logs</h1>
          <p className="page-subtitle">Track, filter, and review bidder communications across auctions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setActiveCall({ bidder: 'Quick Outbound Call', phone: '+91 98765 43210' })}
        >
          <Phone size={14} /> New Call
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Phone size={20} />
          </div>
          <div>
            <div className="stat-value">{callLogs.length}</div>
            <div className="stat-label">Total Calls Logged</div>
            <div className="stat-change up">↑ 12% vs last week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-value">{connected}</div>
            <div className="stat-label">Connected Calls</div>
            <div className="stat-change up">{(connected / callLogs.length * 100).toFixed(0)}% Connect Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red" style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
            <PhoneMissed size={20} />
          </div>
          <div>
            <div className="stat-value">{missed}</div>
            <div className="stat-label">Missed Inbounds</div>
            <div className="stat-change down" style={{ color: '#ff3b30' }}>Requires callback</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value">4:52</div>
            <div className="stat-label">Average Talk Duration</div>
            <div className="stat-change up">Healthy negotiation</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="card"
        style={{ marginBottom: 20, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}
      >
        <div className="filter-search" style={{ flex: 1, maxWidth: 360, minWidth: 240 }}>
          <Search size={15} color="#86868b" />
          <input
            placeholder="Search by bidder name or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', padding: 2 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="filter-tabs">
          {['All', 'Connected', 'Missed'].map(status => (
            <button
              key={status}
              type="button"
              className={`filter-tab${statusFilter === status ? ' active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>Call Type</th>
                <th>Bidder Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: '#86868b' }}>
                    No call logs match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr key={log.id}>
                    <td style={{ color: '#86868b', fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: log.status === 'Missed' ? 'rgba(255, 59, 48, 0.1)' : log.type === 'Incoming' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 113, 227, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CallIcon type={log.type} status={log.status} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#1d1d1f' }}>{log.type}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1d1d1f' }}>{log.bidder || 'Authorized Bidder'}</div>
                    </td>
                    <td style={{ color: '#6e6e73' }}>{log.date}</td>
                    <td style={{ color: '#6e6e73' }}>{log.time}</td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'SF Mono, Menlo, monospace',
                          background: 'rgba(0, 0, 0, 0.04)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          color: '#475569'
                        }}
                      >
                        {log.duration}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${log.status === 'Connected' ? 'green' : 'red'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ gap: 5 }}
                        onClick={() => setActiveCall({ bidder: log.bidder || 'Authorized Bidder', phone: '+91 98765 43210' })}
                      >
                        <Phone size={12} color="#0071e3" /> Call Back
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Call Drawer / Modal */}
      {activeCall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setActiveCall(null)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 380,
              padding: 32,
              textAlign: 'center',
              boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'rgba(0, 113, 227, 0.1)',
                border: '2px solid rgba(0, 113, 227, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0071e3',
                margin: '0 auto 16px',
                boxShadow: '0 0 20px rgba(0, 113, 227, 0.2)'
              }}
            >
              <PhoneCall size={30} />
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Connecting Live Outbound Call
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', marginTop: 6 }}>
              {activeCall.bidder}
            </div>

            <div style={{ fontSize: 13, color: '#86868b', marginTop: 4 }}>
              {activeCall.phone}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}
                onClick={() => setActiveCall(null)}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
