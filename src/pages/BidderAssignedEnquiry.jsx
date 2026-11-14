import { useState } from 'react'
import {
  FileText, Search, Plus, Phone, PhoneCall, CheckCircle2,
  Clock, AlertCircle, ArrowUpDown, X, Gavel, Car, ShieldCheck,
  TrendingUp, DollarSign, MapPin, Mail, ExternalLink,
  ChevronRight, RefreshCw, Filter, Eye, Check, Tag, UserCheck,
  Calendar, ArrowRight, Sparkles, MessageSquare
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { assignedEnquiries as initialEnquiries, cars, bidders } from '../data/mockData'

export default function BidderAssignedEnquiry() {
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [callingBidder, setCallingBidder] = useState(null)
  const [newNote, setNewNote] = useState('')

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    carId: cars[0]?.id || 1,
    bidderId: bidders[0]?.id || 1,
    bidderOffer: '₹7,50,000',
    status: 'Negotiation Active',
    priority: 'High',
    assignedExecutive: 'Rahul Sharma',
    nextFollowUp: 'Tomorrow, 11:00 AM'
  })

  // Statistics
  const totalCount = enquiries.length
  const activeNegoCount = enquiries.filter(e => e.status === 'Negotiation Active').length
  const tokenCount = enquiries.filter(e => e.status === 'Token Confirmed').length
  const followUpCount = enquiries.filter(e => e.status === 'Follow-up Due' || e.nextFollowUp.toLowerCase().includes('today')).length
  const reassignedCount = enquiries.filter(e => e.reassigned).length

  // Filter logic
  const filteredEnquiries = enquiries.filter(e => {
    const q = search.toLowerCase()
    const matchesSearch =
      e.enquiryId.toLowerCase().includes(q) ||
      e.carName.toLowerCase().includes(q) ||
      e.bidderName.toLowerCase().includes(q) ||
      e.bidderCode.toLowerCase().includes(q) ||
      e.contactPerson.toLowerCase().includes(q) ||
      e.assignedExecutive.toLowerCase().includes(q)

    let matchesTab = true
    if (activeTab === 'In Negotiation') matchesTab = e.status === 'Negotiation Active'
    else if (activeTab === 'Token Confirmed') matchesTab = e.status === 'Token Confirmed'
    else if (activeTab === 'Follow-up Due') matchesTab = e.status === 'Follow-up Due' || e.nextFollowUp.toLowerCase().includes('today')
    else if (activeTab === 'Reassigned') matchesTab = e.reassigned === true
    else if (activeTab === 'Inspection') matchesTab = e.status === 'Inspection Scheduled'
    else if (activeTab === 'Closed Deals') matchesTab = e.status === 'Deal Closed'

    return matchesSearch && matchesTab
  })

  // Start simulated phone call
  const handleCall = (enquiry, e) => {
    if (e) e.stopPropagation()
    setCallingBidder({
      name: enquiry.bidderName,
      contactPerson: enquiry.contactPerson,
      phone: enquiry.bidderPhone,
      enquiryId: enquiry.enquiryId,
      carName: enquiry.carName
    })
  }

  // Add follow-up note
  const handleAddNote = (enquiryId) => {
    if (!newNote.trim()) return
    const noteObj = {
      id: Date.now(),
      text: newNote.trim(),
      time: 'Just now',
      author: 'You (Sales)'
    }
    setEnquiries(prev =>
      prev.map(e => e.id === enquiryId ? { ...e, notes: [noteObj, ...(e.notes || [])] } : e)
    )
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(prev => ({
        ...prev,
        notes: [noteObj, ...(prev.notes || [])]
      }))
    }
    setNewNote('')
  }

  // Update enquiry status
  const handleStatusChange = (enquiryId, newStatus) => {
    setEnquiries(prev =>
      prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e)
    )
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(prev => ({ ...prev, status: newStatus }))
    }
  }

  // Reassign to another bidder
  const handleReassign = (enquiryId, newBidderId) => {
    const targetBidder = bidders.find(b => b.id === Number(newBidderId))
    if (!targetBidder) return

    setEnquiries(prev =>
      prev.map(e => {
        if (e.id === enquiryId) {
          const reassignNote = {
            id: Date.now(),
            text: `Enquiry reassigned from ${e.bidderName} to ${targetBidder.name}`,
            time: 'Just now',
            author: 'System'
          }
          return {
            ...e,
            bidderId: targetBidder.id,
            bidderName: targetBidder.name,
            bidderCode: targetBidder.code,
            contactPerson: targetBidder.contactPerson,
            bidderPhone: targetBidder.phone,
            bidderType: targetBidder.type,
            reassigned: true,
            status: 'Reassigned',
            notes: [reassignNote, ...(e.notes || [])]
          }
        }
        return e
      })
    )

    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(prev => ({
        ...prev,
        bidderId: targetBidder.id,
        bidderName: targetBidder.name,
        bidderCode: targetBidder.code,
        contactPerson: targetBidder.contactPerson,
        bidderPhone: targetBidder.phone,
        bidderType: targetBidder.type,
        reassigned: true,
        status: 'Reassigned'
      }))
    }
  }

  // Submit new assignment
  const handleCreateAssignment = (e) => {
    e.preventDefault()
    const selectedCar = cars.find(c => c.id === Number(newAssignment.carId)) || cars[0]
    const selectedBidder = bidders.find(b => b.id === Number(newAssignment.bidderId)) || bidders[0]

    const created = {
      id: Date.now(),
      enquiryId: `ENQ-${selectedCar.appId || Math.floor(10000000000 + Math.random() * 90000000000)}`,
      carId: selectedCar.id,
      carName: selectedCar.name,
      carDetails: {
        year: selectedCar.year,
        fuel: selectedCar.fuel,
        km: selectedCar.km,
        location: selectedCar.location,
        color_hex: selectedCar.color_hex || '#4f46e5'
      },
      bidderId: selectedBidder.id,
      bidderName: selectedBidder.name,
      bidderCode: selectedBidder.code,
      contactPerson: selectedBidder.contactPerson,
      bidderPhone: selectedBidder.phone,
      bidderType: selectedBidder.type,
      sellerAsk: selectedCar.sellerAsk,
      targetPrice: selectedCar.targetPrice,
      bidderOffer: newAssignment.bidderOffer,
      leadPrice: selectedCar.leadPrice,
      tokenDate: 'Pending',
      status: newAssignment.status,
      priority: newAssignment.priority,
      assignedDate: 'Today',
      nextFollowUp: newAssignment.nextFollowUp,
      assignedExecutive: newAssignment.assignedExecutive,
      reassigned: false,
      notes: [
        {
          id: Date.now(),
          text: `Enquiry assigned to ${selectedBidder.name} by ${newAssignment.assignedExecutive}`,
          time: 'Just now',
          author: newAssignment.assignedExecutive
        }
      ]
    }

    setEnquiries([created, ...enquiries])
    setShowAssignModal(false)
  }

  // Helper badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Negotiation Active':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      case 'Token Confirmed':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
      case 'Inspection Scheduled':
        return { bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff' }
      case 'Follow-up Due':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
      case 'Reassigned':
        return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' }
      case 'Deal Closed':
        return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' }
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
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
              <FileText size={20} />
            </div>
            <div>
              <div className="page-title" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                Bidder Assigned Enquiries
              </div>
              <div className="page-subtitle" style={{ fontSize: 13, color: '#64748b' }}>
                Track vehicle enquiries assigned to bidders, negotiate prices, manage follow-ups & tokens
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={() => setSearch('')}
            title="Reset filters"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAssignModal(true)}
            style={{ gap: 6, fontWeight: 600 }}
          >
            <Plus size={16} /> Assign Enquiry
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><FileText size={20} /></div>
          <div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total Assigned Enquiries</div>
            <div className="stat-change up">Active portfolio</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><TrendingUp size={20} /></div>
          <div>
            <div className="stat-value">{activeNegoCount}</div>
            <div className="stat-label">In Negotiation</div>
            <div className="stat-change up" style={{ color: '#4f46e5' }}>Active price discussion</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle2 size={20} /></div>
          <div>
            <div className="stat-value">{tokenCount}</div>
            <div className="stat-label">Token Confirmed</div>
            <div className="stat-change up">Ready for handover</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow"><Clock size={20} /></div>
          <div>
            <div className="stat-value">{followUpCount}</div>
            <div className="stat-label">Follow-ups Due</div>
            <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, marginTop: 4 }}>
              Requires attention
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
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { label: 'All', count: totalCount },
              { label: 'In Negotiation', count: activeNegoCount },
              { label: 'Token Confirmed', count: tokenCount },
              { label: 'Inspection', count: enquiries.filter(e => e.status === 'Inspection Scheduled').length },
              { label: 'Reassigned', count: reassignedCount },
              { label: 'Follow-up Due', count: followUpCount },
              { label: 'Closed Deals', count: enquiries.filter(e => e.status === 'Deal Closed').length },
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
                placeholder="Search enquiry ID, car, bidder..."
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

        {/* Listings Section */}
        {filteredEnquiries.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <FileText size={44} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: '#334155' }}>No assigned enquiries found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try clearing your search query or selecting another filter tab</div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Vehicle Details</th>
                  <th>Assigned Bidder</th>
                  <th>Offer vs Ask Price</th>
                  <th>Target Price</th>
                  <th>Status</th>
                  <th>Next Follow-up</th>
                  <th>Executive</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map(enquiry => {
                  const badgeStyle = getStatusBadge(enquiry.status)
                  return (
                    <tr
                      key={enquiry.id}
                      onClick={() => setSelectedEnquiry(enquiry)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Enquiry ID */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>
                          {enquiry.enquiryId}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          Assigned: {enquiry.assignedDate}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td style={{ maxWidth: 220 }}>
                        <Link
                          to={`/all-cars/${enquiry.carId}`}
                          onClick={e => e.stopPropagation()}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13, lineHeight: 1.3 }}>
                            {enquiry.carName}
                          </div>
                        </Link>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {enquiry.carDetails.fuel} · {enquiry.carDetails.km} km · {enquiry.carDetails.location}
                        </div>
                      </td>

                      {/* Assigned Bidder */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>
                          {enquiry.bidderName}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {enquiry.contactPerson} · {enquiry.bidderCode}
                        </div>
                        <span className="badge blue" style={{ fontSize: 9, padding: '1px 6px', marginTop: 3 }}>
                          {enquiry.bidderType}
                        </span>
                      </td>

                      {/* Prices: Offer vs Ask */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>
                              {enquiry.bidderOffer}
                            </div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>
                              Ask: {enquiry.sellerAsk}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Price */}
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                          {enquiry.targetPrice}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>
                          Token: {enquiry.tokenDate || 'N/A'}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            background: badgeStyle.bg,
                            color: badgeStyle.color,
                            border: `1px solid ${badgeStyle.border}`
                          }}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      {/* Next Follow-up */}
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 600, color: enquiry.nextFollowUp.includes('Overdue') ? '#ef4444' : '#334155' }}>
                          {enquiry.nextFollowUp}
                        </div>
                      </td>

                      {/* Executive */}
                      <td>
                        <div style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
                          {enquiry.assignedExecutive}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => handleCall(enquiry, e)}
                            title="Call Bidder"
                            style={{ padding: '5px 10px' }}
                          >
                            <Phone size={12} /> Call
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enquiry) }}
                            style={{ padding: '5px 10px' }}
                          >
                            <Eye size={12} /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16, padding: 20
          }}>
            {filteredEnquiries.map(enquiry => {
              const badgeStyle = getStatusBadge(enquiry.status)
              return (
                <div
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  style={{
                    border: '1px solid #e2e8f0', borderRadius: 12, padding: 18,
                    background: '#fff', cursor: 'pointer', transition: 'all .15s',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c7d2fe'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5' }}>
                        {enquiry.enquiryId}
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                        {enquiry.carName}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {enquiry.carDetails.location} · {enquiry.carDetails.fuel}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                        background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`
                      }}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  {/* Bidder Card Box */}
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                        {enquiry.bidderName}
                      </div>
                      <span className="badge blue" style={{ fontSize: 9 }}>{enquiry.bidderType}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {enquiry.contactPerson} · {enquiry.bidderPhone}
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                    <div style={{ background: '#f0fdf4', padding: '8px 4px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: 10, color: '#166534' }}>Bidder Offer</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#15803d', marginTop: 2 }}>{enquiry.bidderOffer}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 10, color: '#64748b' }}>Seller Ask</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{enquiry.sellerAsk}</div>
                    </div>
                    <div style={{ background: '#eff6ff', padding: '8px 4px', borderRadius: 6, border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: 10, color: '#1e40af' }}>Target TP</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', marginTop: 2 }}>{enquiry.targetPrice}</div>
                    </div>
                  </div>

                  {/* Footer info & actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      Follow-up: <strong style={{ color: enquiry.nextFollowUp.includes('Overdue') ? '#ef4444' : '#1e293b' }}>{enquiry.nextFollowUp}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleCall(enquiry, e)}
                      >
                        <Phone size={12} /> Call
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enquiry) }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Drawer: Enquiry Details & Management */}
      {selectedEnquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000,
          display: 'flex', justifyContent: 'flex-end'
        }} onClick={() => setSelectedEnquiry(null)}>
          <div
            style={{
              width: 560, maxWidth: '92vw', background: '#fff', height: '100%',
              display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5' }}>
                    {selectedEnquiry.enquiryId}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                      ...getStatusBadge(selectedEnquiry.status)
                    }}
                  >
                    {selectedEnquiry.status}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 6, lineHeight: 1.3 }}>
                  {selectedEnquiry.carName}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                  Assigned Executive: <strong>{selectedEnquiry.assignedExecutive}</strong> · Assigned on {selectedEnquiry.assignedDate}
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{
              padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0',
              display: 'flex', gap: 10
            }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleCall(selectedEnquiry)}
              >
                <Phone size={14} /> Call Bidder ({selectedEnquiry.bidderPhone})
              </button>
              <Link to={`/all-cars/${selectedEnquiry.carId}`} style={{ textDecoration: 'none' }}>
                <button className="btn btn-outline">
                  <ExternalLink size={14} /> View Car
                </button>
              </Link>
            </div>

            {/* Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Pricing Matrix */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
                  Price Negotiation Overview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Seller Ask Price</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{selectedEnquiry.sellerAsk}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: 11, color: '#166534' }}>Bidder Offer</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d', marginTop: 2 }}>{selectedEnquiry.bidderOffer}</div>
                  </div>
                  <div style={{ background: '#eff6ff', padding: 12, borderRadius: 8, border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: 11, color: '#1e40af' }}>Target Price (TP)</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1d4ed8', marginTop: 2 }}>{selectedEnquiry.targetPrice}</div>
                  </div>
                </div>
              </div>

              {/* Assigned Bidder Details Card */}
              <div style={{ background: '#fff', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                    Assigned Bidder Details
                  </div>
                  <Link to="/bidders" style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                    Bidder Profile →
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Dealership / Company</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{selectedEnquiry.bidderName}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Bidder Code</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedEnquiry.bidderCode}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Contact Person</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedEnquiry.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{selectedEnquiry.bidderPhone}</div>
                  </div>
                </div>

                {/* Reassign dropdown */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>Reassign Bidder:</span>
                  <select
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }}
                    value={selectedEnquiry.bidderId}
                    onChange={e => handleReassign(selectedEnquiry.id, e.target.value)}
                  >
                    {bidders.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  Change Negotiation Status
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Negotiation Active', 'Token Confirmed', 'Inspection Scheduled', 'Follow-up Due', 'Deal Closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        border: '1px solid',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderColor: selectedEnquiry.status === st ? '#4f46e5' : '#e2e8f0',
                        background: selectedEnquiry.status === st ? '#4f46e5' : '#fff',
                        color: selectedEnquiry.status === st ? '#fff' : '#475569'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Notes Log */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
                  Enquiry Activity & Notes Log
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    placeholder="Add follow-up notes or negotiation update..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddNote(selectedEnquiry.id) }}
                    style={{
                      flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0',
                      borderRadius: 8, fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddNote(selectedEnquiry.id)}
                  >
                    Post Note
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedEnquiry.notes || []).map(n => (
                    <div key={n.id} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: 12, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 10 }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{n.author}</span>
                        <span>{n.time}</span>
                      </div>
                      <div style={{ color: '#1e293b', marginTop: 4, lineHeight: 1.4 }}>{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assign New Enquiry */}
      {showAssignModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setShowAssignModal(false)}>
          <div
            style={{
              width: 520, maxWidth: '100%', background: '#fff', borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc'
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Assign Enquiry to Bidder
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} style={{ padding: 24 }}>
              <div className="form-group">
                <label className="form-label">Select Vehicle Enquiry *</label>
                <select
                  className="form-input"
                  value={newAssignment.carId}
                  onChange={e => setNewAssignment({ ...newAssignment, carId: e.target.value })}
                >
                  {cars.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — Ask: {c.sellerAsk} (ID: {c.appId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign to Bidder *</label>
                <select
                  className="form-input"
                  value={newAssignment.bidderId}
                  onChange={e => setNewAssignment({ ...newAssignment, bidderId: e.target.value })}
                >
                  {bidders.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code}) — {b.city}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Initial Bidder Offer *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="e.g. ₹7,50,000"
                    value={newAssignment.bidderOffer}
                    onChange={e => setNewAssignment({ ...newAssignment, bidderOffer: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-input"
                    value={newAssignment.status}
                    onChange={e => setNewAssignment({ ...newAssignment, status: e.target.value })}
                  >
                    <option value="Negotiation Active">Negotiation Active</option>
                    <option value="Token Confirmed">Token Confirmed</option>
                    <option value="Inspection Scheduled">Inspection Scheduled</option>
                    <option value="Follow-up Due">Follow-up Due</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Assigned Executive</label>
                  <select
                    className="form-input"
                    value={newAssignment.assignedExecutive}
                    onChange={e => setNewAssignment({ ...newAssignment, assignedExecutive: e.target.value })}
                  >
                    <option value="Rahul Sharma">Rahul Sharma (Sales Executive)</option>
                    <option value="Priya Singh">Priya Singh (RA Associate)</option>
                    <option value="Admin User">Admin User</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Next Follow-Up</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Tomorrow, 11:00 AM"
                    value={newAssignment.nextFollowUp}
                    onChange={e => setNewAssignment({ ...newAssignment, nextFollowUp: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Assignment
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
              width: 70, height: 70, borderRadius: '50%', background: '#eff6ff', color: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              border: '3px solid #bfdbfe'
            }}>
              <PhoneCall size={32} />
            </div>
            <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600 }}>Calling for Enquiry...</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {callingBidder.name}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {callingBidder.contactPerson} · {callingBidder.phone}
            </div>
            <div style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, marginTop: 8 }}>
              Regarding: {callingBidder.enquiryId}
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

