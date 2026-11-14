import { useState, useEffect } from 'react'
import {
  Users, Search, Plus, Phone, PhoneCall, CheckCircle2,
  AlertCircle, ArrowUpDown, X, Gavel, ShieldCheck,
  TrendingUp, Clock, DollarSign, MapPin, Mail, ExternalLink,
  ChevronRight, RefreshCw, Filter, Eye, Check, FileText, Trash2,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── API Configuration & Helper ─────────────────────────────────────────────
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/biders`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken") || "YOUR_TOKEN_HERE"}`,
});

// ─── API helper ─────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { headers: getHeaders(), ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Helper to normalize columns from the API ───────────────────────────────
function normalizeBidder(b) {
  if (!b) return null;
  const id = b.id || b._id || b.biderId || b.bidderId || String(Math.random());
  const code = b.code || b.biderCode || b.bidderCode || (b._id ? `BDR-${String(b._id).slice(-6)}` : 'BDR-1001');
  const name = b.name || b.biderName || b.bidderName || b.dealershipName || b.businessName || 'Unnamed Bidder';
  const contactPerson = b.contactPerson || b.contact_person || b.ownerName || b.personName || name;
  const phone = b.phone || b.mobile || b.contactNumber || b.phoneNumber || 'N/A';
  const email = b.email || b.mail || 'N/A';
  const city = b.city || b.location || b.address || b.state || 'India';
  const type = b.type || b.biderType || b.bidderType || b.plan || 'Touch & Buy';

  let status = 'offline';
  if (typeof b.status === 'string') {
    status = b.status.toLowerCase() === 'online' ? 'online' : 'offline';
  } else if (b.isOnline || b.isActive) {
    status = 'online';
  }

  const contacted = Boolean(b.contacted || b.isContacted);
  const reassigned = Boolean(b.reassigned || b.isReassigned);

  const walletBalance = b.walletBalance || b.deposit || b.securityDeposit || b.balance
    ? (typeof b.walletBalance === 'number'
        ? `₹${b.walletBalance.toLocaleString('en-IN')}`
        : String(b.walletBalance || b.deposit || b.securityDeposit || b.balance))
    : '₹0';

  const carsWon = Number(b.carsWon || b.totalWon || b.wonCarsCount || 0);
  const totalBidsPlaced = Number(b.totalBidsPlaced || b.totalBids || b.bidsCount || 0);
  const activeBids = Array.isArray(b.activeBids) ? b.activeBids : [];
  const activeBidsCount = Number(b.activeBidsCount ?? activeBids.length ?? 0);
  const lastActive = b.lastActive || (b.updatedAt ? new Date(b.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently');
  const assignedTo = b.assignedTo || b.assignedExecutive || 'Unassigned';

  return {
    ...b,
    id,
    _rawId: b._id || b.id,
    code,
    name,
    contactPerson,
    phone,
    email,
    city,
    type,
    status,
    contacted,
    reassigned,
    walletBalance,
    carsWon,
    totalBidsPlaced,
    activeBids,
    activeBidsCount,
    lastActive,
    assignedTo
  };
}

export default function Bidders() {
  const [biddersList, setBiddersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [selectedBidder, setSelectedBidder] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [callingBidder, setCallingBidder] = useState(null)
  const [notes, setNotes] = useState({})
  const [newNoteText, setNewNoteText] = useState('')

  // Form state for adding new bidder
  const [newBidder, setNewBidder] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    type: 'Touch & Buy',
    walletBalance: '₹5,00,000',
  })

  // ─── Fetch Bidders from API ────────────────────────────────────────────────
  const fetchBidders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(BASE_URL)
      // Extract array from response (support direct array, data, biders, bidders)
      const list = Array.isArray(res)
        ? res
        : (res?.data || res?.biders || res?.bidders || res?.results || [])
      setBiddersList(list.map(normalizeBidder))
    } catch (err) {
      console.error('Failed to fetch bidders from API:', err)
      setError(err.message || 'Failed to load bidders from server.')
      setBiddersList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBidders()
  }, [])

  // ─── Statistics ────────────────────────────────────────────────────────────
  const totalBidders = biddersList.length
  const onlineBidders = biddersList.filter(b => b.status === 'online').length
  const activeBidsCount = biddersList.reduce((acc, b) => acc + (b.activeBidsCount || 0), 0)
  const contactedCount = biddersList.filter(b => b.contacted).length
  const contactedRate = totalBidders ? Math.round((contactedCount / totalBidders) * 100) : 0

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredBidders = biddersList.filter(b => {
    const q = search.toLowerCase()
    const matchesSearch =
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.contactPerson.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q)

    let matchesTab = true
    if (activeTab === 'Online Now') matchesTab = b.status === 'online'
    else if (activeTab === 'Touch & Buy') matchesTab = b.type === 'Touch & Buy'
    else if (activeTab === 'Reco Buy') matchesTab = b.type === 'Reco Buy'
    else if (activeTab === 'Reassigned') matchesTab = b.reassigned === true
    else if (activeTab === 'Not Contacted') matchesTab = !b.contacted

    return matchesSearch && matchesTab
  })

  // ─── Toggle Contacted Status ──────────────────────────────────────────────
  const toggleContacted = async (bidder, e) => {
    if (e) e.stopPropagation()
    const targetId = bidder._rawId || bidder.id
    const newContactedVal = !bidder.contacted

    // Optimistic UI update
    setBiddersList(prev =>
      prev.map(b => (b.id === bidder.id ? { ...b, contacted: newContactedVal } : b))
    )
    if (selectedBidder && selectedBidder.id === bidder.id) {
      setSelectedBidder(prev => ({ ...prev, contacted: newContactedVal }))
    }

    try {
      await apiFetch(`${BASE_URL}/${targetId}`, {
        method: 'PUT',
        body: JSON.stringify({ contacted: newContactedVal, isContacted: newContactedVal })
      })
    } catch (err) {
      console.warn('API update contacted warning (optimistic UI maintained):', err.message)
    }
  }

  // ─── Delete Bidder ─────────────────────────────────────────────────────────
  const handleDeleteBidder = async (bidder, e) => {
    if (e) e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete bidder "${bidder.name}"?`)) return
    const targetId = bidder._rawId || bidder.id

    try {
      await apiFetch(`${BASE_URL}/${targetId}`, { method: 'DELETE' })
      setBiddersList(prev => prev.filter(b => b.id !== bidder.id))
      if (selectedBidder && selectedBidder.id === bidder.id) {
        setSelectedBidder(null)
      }
    } catch (err) {
      alert(`Failed to delete bidder: ${err.message}`)
    }
  }

  // ─── Handle Call Simulation ───────────────────────────────────────────────
  const startCall = (bidder, e) => {
    if (e) e.stopPropagation()
    setCallingBidder(bidder)
    toggleContacted(bidder)
  }

  // ─── Add Note ──────────────────────────────────────────────────────────────
  const handleAddNote = (bidderId) => {
    if (!newNoteText.trim()) return
    const currentNotes = notes[bidderId] || []
    const updated = [
      {
        id: Date.now(),
        text: newNoteText.trim(),
        time: 'Just now',
        author: 'You (Sales)'
      },
      ...currentNotes
    ]
    setNotes(prev => ({ ...prev, [bidderId]: updated }))
    setNewNoteText('')
  }

  // ─── Add Bidder Submit (POST to API) ───────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (!newBidder.name || !newBidder.phone) return

    setSubmitting(true)
    try {
      const payload = {
        name: newBidder.name,
        biderName: newBidder.name,
        contactPerson: newBidder.contactPerson || newBidder.name,
        phone: newBidder.phone,
        mobile: newBidder.phone,
        email: newBidder.email || 'info@bidder.com',
        city: newBidder.city || 'India',
        type: newBidder.type,
        biderType: newBidder.type,
        status: 'online',
        walletBalance: newBidder.walletBalance || '₹5,00,000',
        deposit: newBidder.walletBalance || '₹5,00,000',
        contacted: false
      }

      const res = await apiFetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const created = normalizeBidder(res?.data || res?.bider || res?.bidder || res)
      setBiddersList(prev => [created, ...prev])
      setShowAddModal(false)
      setNewBidder({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
        type: 'Touch & Buy',
        walletBalance: '₹5,00,000',
      })
    } catch (err) {
      alert(`Failed to add bidder: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page" style={{ padding: '24px 32px' }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#eef2ff', color: '#4f46e5',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Gavel size={20} />
            </div>
            <div>
              <div className="page-title" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                Bidders
              </div>
              <div className="page-subtitle" style={{ fontSize: 13, color: '#64748b' }}>
                Manage live auction bidders via API ({BASE_URL})
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/bidder-assigned-enquiry">
            <button className="btn btn-outline" style={{ gap: 6 }}>
              <FileText size={14} /> Assigned Enquiries
            </button>
          </Link>
          <button
            className="btn btn-outline"
            onClick={fetchBidders}
            disabled={loading}
            title="Refresh from API"
            style={{ gap: 6 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ gap: 6, fontWeight: 600 }}
          >
            <Plus size={16} /> Add New Bidder
          </button>
        </div>
      </div>

      {/* API Error Notification */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
          padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', color: '#991b1b', fontSize: 13
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} color="#dc2626" />
            <span><strong>API Error:</strong> {error}</span>
          </div>
          <button
            onClick={fetchBidders}
            className="btn btn-sm btn-outline"
            style={{ borderColor: '#dc2626', color: '#dc2626', background: '#fff' }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={20} /></div>
          <div>
            <div className="stat-value">{loading ? '…' : totalBidders}</div>
            <div className="stat-label">Total Bidders</div>
            <div className="stat-change up">From API database</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green" style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', top: 8, right: 8, width: 8, height: 8,
              borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e'
            }} />
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{loading ? '…' : onlineBidders}</div>
            <div className="stat-label">Online Now</div>
            <div className="stat-change up" style={{ color: '#16a34a' }}>Active bidders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><Gavel size={20} /></div>
          <div>
            <div className="stat-value">{loading ? '…' : activeBidsCount}</div>
            <div className="stat-label">Active Bids</div>
            <div className="stat-change up">In live auctions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow"><PhoneCall size={20} /></div>
          <div>
            <div className="stat-value">{loading ? '…' : `${contactedRate}%`}</div>
            <div className="stat-label">Outreach Rate</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
              {contactedCount} of {totalBidders} contacted
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card" style={{ border: '1px solid #e2e8f0', borderRadius: 12 }}>
        {/* Controls Bar */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { label: 'All', count: totalBidders },
              { label: 'Online Now', count: onlineBidders },
              { label: 'Touch & Buy', count: biddersList.filter(b => b.type === 'Touch & Buy').length },
              { label: 'Reco Buy', count: biddersList.filter(b => b.type === 'Reco Buy').length },
              { label: 'Reassigned', count: biddersList.filter(b => b.reassigned).length },
              { label: 'Not Contacted', count: biddersList.filter(b => !b.contacted).length },
            ].map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                style={{
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === tab.label ? '#4f46e5' : '#f8fafc',
                  color: activeTab === tab.label ? '#fff' : '#64748b',
                  transition: 'all .15s'
                }}
              >
                {tab.label} <span style={{
                  fontSize: 11,
                  opacity: 0.85,
                  marginLeft: 4,
                  padding: '2px 6px',
                  borderRadius: 10,
                  background: activeTab === tab.label ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: activeTab === tab.label ? '#fff' : '#475569'
                }}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search + View Toggle */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="filter-search" style={{ maxWidth: 280 }}>
              <Search size={14} color="#94a3b8" />
              <input
                placeholder="Search bidders by name, code, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '8px 12px', border: 'none', cursor: 'pointer',
                  background: viewMode === 'table' ? '#4f46e5' : '#fff',
                  color: viewMode === 'table' ? '#fff' : '#64748b',
                  fontSize: 12, fontWeight: 600
                }}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '8px 12px', border: 'none', cursor: 'pointer',
                  background: viewMode === 'cards' ? '#4f46e5' : '#fff',
                  color: viewMode === 'cards' ? '#fff' : '#64748b',
                  fontSize: 12, fontWeight: 600
                }}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div style={{ padding: 80, textAlign: 'center', color: '#64748b' }}>
            <div style={{
              width: 44, height: 44, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5',
              borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Loading Bidders from API…</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Connecting to {BASE_URL}</div>
          </div>
        ) : filteredBidders.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <Users size={44} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: '#334155' }}>No bidders found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {error ? 'API connection issue — check server status or retry' : 'No records returned from the API database'}
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={14} /> Add First Bidder
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>Status</th>
                  <th>Bidder / Company Name</th>
                  <th>Contact Person</th>
                  <th>Location</th>
                  <th>Plan / Type</th>
                  <th>Deposit / Balance</th>
                  <th>Active Bids</th>
                  <th>Outreach</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBidders.map(bidder => (
                  <tr
                    key={bidder.id}
                    onClick={() => setSelectedBidder(bidder)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Status dot */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={bidder.status}>
                        <span
                          style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: bidder.status === 'online' ? '#22c55e' : '#cbd5e1',
                            display: 'inline-block',
                            boxShadow: bidder.status === 'online' ? '0 0 6px #22c55e' : 'none'
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & Code */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                        {bidder.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        {bidder.code} {bidder.reassigned && <span style={{ color: '#f59e0b', fontWeight: 600 }}>• Reassigned</span>}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td>
                      <div style={{ fontWeight: 600, color: '#334155', fontSize: 13 }}>
                        {bidder.contactPerson}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {bidder.phone}
                      </div>
                    </td>

                    {/* Location */}
                    <td>
                      <span style={{ fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#94a3b8" /> {bidder.city}
                      </span>
                    </td>

                    {/* Type badge */}
                    <td>
                      <span className={`badge ${
                        bidder.type === 'Touch & Buy' ? 'blue' :
                        bidder.type === 'Reco Buy' ? 'yellow' : 'purple'
                      }`} style={{ fontSize: 11 }}>
                        {bidder.type}
                      </span>
                    </td>

                    {/* Wallet balance */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>
                        {bidder.walletBalance}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>
                        Won: {bidder.carsWon} cars
                      </div>
                    </td>

                    {/* Active bids */}
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedBidder(bidder) }}
                        style={{
                          border: 'none',
                          background: bidder.activeBidsCount > 0 ? '#eef2ff' : '#f1f5f9',
                          color: bidder.activeBidsCount > 0 ? '#4f46e5' : '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Gavel size={12} /> {bidder.activeBidsCount} Active
                      </button>
                    </td>

                    {/* Outreach toggle */}
                    <td>
                      <button
                        onClick={(e) => toggleContacted(bidder, e)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: bidder.contacted ? '#f0fdf4' : '#fef2f2',
                          color: bidder.contacted ? '#16a34a' : '#dc2626',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        {bidder.contacted ? <>✓ Contacted</> : <>! Not Contacted</>}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => startCall(bidder, e)}
                          title="Call bidder"
                          style={{ padding: '5px 10px' }}
                        >
                          <Phone size={12} /> Call
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={(e) => { e.stopPropagation(); setSelectedBidder(bidder) }}
                          style={{ padding: '5px 10px' }}
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          onClick={(e) => handleDeleteBidder(bidder, e)}
                          title="Delete bidder from API"
                          style={{
                            border: 'none', background: '#fef2f2', color: '#dc2626',
                            borderRadius: 6, padding: '5px 8px', cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16, padding: 20
          }}>
            {filteredBidders.map(bidder => (
              <div
                key={bidder.id}
                onClick={() => setSelectedBidder(bidder)}
                style={{
                  border: '1px solid #e2e8f0', borderRadius: 12, padding: 18,
                  background: '#fff', cursor: 'pointer', transition: 'all .15s',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c7d2fe'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: bidder.status === 'online' ? '#22c55e' : '#cbd5e1'
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 600, color: bidder.status === 'online' ? '#16a34a' : '#94a3b8' }}>
                        {bidder.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                      {bidder.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {bidder.code} · {bidder.city}
                    </div>
                  </div>

                  <span className={`badge ${
                    bidder.type === 'Touch & Buy' ? 'blue' : 'yellow'
                  }`} style={{ fontSize: 10 }}>
                    {bidder.type}
                  </span>
                </div>

                {/* Info row */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                  background: '#f8fafc', padding: 10, borderRadius: 8, fontSize: 12
                }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>Contact Person</div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{bidder.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>Deposit Balance</div>
                    <div style={{ fontWeight: 700, color: '#4f46e5' }}>{bidder.walletBalance}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>Active Bids</div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{bidder.activeBidsCount} cars</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>Total Won</div>
                    <div style={{ fontWeight: 600, color: '#16a34a' }}>{bidder.carsWon} cars</div>
                  </div>
                </div>

                {/* Footer actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
                  <button
                    onClick={(e) => toggleContacted(bidder, e)}
                    style={{
                      border: 'none', background: bidder.contacted ? '#f0fdf4' : '#fef2f2',
                      color: bidder.contacted ? '#16a34a' : '#dc2626',
                      borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {bidder.contacted ? '✓ Contacted' : '! Not Contacted'}
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => startCall(bidder, e)}
                    >
                      <Phone size={12} /> Call
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedBidder(bidder) }}
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => handleDeleteBidder(bidder, e)}
                      style={{
                        border: 'none', background: '#fef2f2', color: '#dc2626',
                        borderRadius: 6, padding: '5px 8px', cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer: Bidder Details & Active Bids */}
      {selectedBidder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000,
          display: 'flex', justifyContent: 'flex-end'
        }} onClick={() => setSelectedBidder(null)}>
          <div
            style={{
              width: 520, maxWidth: '90vw', background: '#fff', height: '100%',
              display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: selectedBidder.status === 'online' ? '#22c55e' : '#cbd5e1'
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: selectedBidder.status === 'online' ? '#16a34a' : '#64748b' }}>
                    {selectedBidder.status === 'online' ? 'Online Now' : 'Offline'}
                  </span>
                  <span className="badge blue" style={{ fontSize: 10 }}>{selectedBidder.type}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 6 }}>
                  {selectedBidder.name}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  {selectedBidder.code} · Assigned: {selectedBidder.assignedTo}
                </div>
              </div>

              <button
                onClick={() => setSelectedBidder(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick action bar */}
            <div style={{
              padding: '14px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0',
              display: 'flex', gap: 10
            }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => startCall(selectedBidder)}
              >
                <Phone size={14} /> Call Bidder ({selectedBidder.phone})
              </button>
              <button
                className="btn btn-outline"
                onClick={() => toggleContacted(selectedBidder)}
              >
                {selectedBidder.contacted ? '✓ Contacted' : 'Mark Contacted'}
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Contact Info Card */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                  Contact Information (API Columns)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Contact Person</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedBidder.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedBidder.phone}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Email</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedBidder.email}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>City / Location</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedBidder.city}</div>
                  </div>
                </div>
              </div>

              {/* Financial & Bid Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 11, color: '#1e40af' }}>Deposit Balance</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e3a8a', marginTop: 2 }}>
                    {selectedBidder.walletBalance}
                  </div>
                </div>
                <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 11, color: '#166534' }}>Cars Won</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#14532d', marginTop: 2 }}>
                    {selectedBidder.carsWon}
                  </div>
                </div>
                <div style={{ padding: 12, background: '#faf5ff', borderRadius: 8, border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: 11, color: '#6b21a8' }}>Total Bids</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#581c87', marginTop: 2 }}>
                    {selectedBidder.totalBidsPlaced}
                  </div>
                </div>
              </div>

              {/* Raw API Columns Viewer (Expandable) */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  Database Columns (Raw Record)
                </div>
                <pre style={{
                  fontSize: 11, background: '#fff', padding: 10, borderRadius: 6,
                  border: '1px solid #e2e8f0', overflowX: 'auto', maxHeight: 150
                }}>
                  {JSON.stringify(selectedBidder, null, 2)}
                </pre>
              </div>

              {/* Outreach & Sales Notes */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
                  Sales Outreach Notes
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    placeholder="Add a remark / preference note..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddNote(selectedBidder.id) }}
                    style={{
                      flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0',
                      borderRadius: 8, fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddNote(selectedBidder.id)}
                  >
                    Post Note
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(notes[selectedBidder.id] || []).length === 0 ? (
                    <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                      No notes logged yet.
                    </div>
                  ) : (
                    (notes[selectedBidder.id] || []).map(n => (
                      <div key={n.id} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 10 }}>
                          <span>{n.author}</span>
                          <span>{n.time}</span>
                        </div>
                        <div style={{ color: '#1e293b', marginTop: 2 }}>{n.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Bidder (Sends POST to API) */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setShowAddModal(false)}>
          <div
            style={{
              width: 500, maxWidth: '100%', background: '#fff', borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc'
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Register New Bidder via API
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ padding: 24 }}>
              <div className="form-group">
                <label className="form-label">Dealership / Bidder Business Name *</label>
                <input
                  required
                  className="form-input"
                  placeholder="e.g. Apex Auto Wheels"
                  value={newBidder.name}
                  onChange={e => setNewBidder({ ...newBidder, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Rajesh Kumar"
                    value={newBidder.contactPerson}
                    onChange={e => setNewBidder({ ...newBidder, contactPerson: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={newBidder.phone}
                    onChange={e => setNewBidder({ ...newBidder, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. contact@apex.in"
                    value={newBidder.email}
                    onChange={e => setNewBidder({ ...newBidder, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City, State</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mumbai, MH"
                    value={newBidder.city}
                    onChange={e => setNewBidder({ ...newBidder, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Bidder Type</label>
                  <select
                    className="form-input"
                    value={newBidder.type}
                    onChange={e => setNewBidder({ ...newBidder, type: e.target.value })}
                  >
                    <option value="Touch & Buy">Touch & Buy</option>
                    <option value="Reco Buy">Reco Buy</option>
                    <option value="Open Auction">Open Auction</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Deposit Limit</label>
                  <input
                    className="form-input"
                    placeholder="₹5,00,000"
                    value={newBidder.walletBalance}
                    onChange={e => setNewBidder({ ...newBidder, walletBalance: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating…' : 'Create Bidder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Call Modal */}
      {callingBidder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', zIndex: 1100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: 380, textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              border: '3px solid #bbf7d0'
            }}>
              <PhoneCall size={32} />
            </div>
            <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Connecting call...</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {callingBidder.name}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              {callingBidder.contactPerson} · {callingBidder.phone}
            </div>

            <div style={{
              marginTop: 20, padding: 12, background: '#f8fafc', borderRadius: 8,
              fontSize: 12, color: '#475569'
            }}>
              Outreach status automatically updated to <strong>Contacted</strong> ✓
            </div>

            <button
              className="btn btn-danger"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '10px 0' }}
              onClick={() => setCallingBidder(null)}
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
