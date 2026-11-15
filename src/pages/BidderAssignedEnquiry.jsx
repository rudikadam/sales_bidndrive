import { useState } from 'react'
import {
  FileText, Search, Plus, Phone, PhoneCall, CheckCircle2,
  Clock, AlertCircle, ArrowUpDown, X, Gavel, Car, ShieldCheck,
  TrendingUp, DollarSign, MapPin, Mail, ExternalLink,
  ChevronRight, RefreshCw, Filter, Eye, Check, Tag, UserCheck,
  Calendar, ArrowRight, Sparkles, MessageSquare, Building2
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
  const followUpCount = enquiries.filter(e => e.status === 'Follow-up Due' || e.nextFollowUp?.toLowerCase().includes('today')).length
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
    else if (activeTab === 'Follow-up Due') matchesTab = e.status === 'Follow-up Due' || e.nextFollowUp?.toLowerCase().includes('today')
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
        color_hex: selectedCar.color_hex || '#0071e3'
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

  // Apple Liquid Badge Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Negotiation Active':
        return 'badge blue'
      case 'Token Confirmed':
      case 'Deal Closed':
        return 'badge green'
      case 'Follow-up Due':
        return 'badge red'
      case 'Reassigned':
        return 'badge yellow'
      case 'Inspection Scheduled':
        return 'badge purple'
      default:
        return 'badge gray'
    }
  }

  return (
    <div className="page" style={{ padding: '24px 32px' }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(0, 113, 227, 0.1)',
                border: '1px solid rgba(0, 113, 227, 0.25)',
                color: '#0071e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                Bidder Assigned Enquiries
              </h1>
              <p className="page-subtitle" style={{ fontSize: 13, marginTop: 2 }}>
                Manage vehicle enquiry allocations, active price negotiations, token deposits, and bidder reassignments
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => { setSearch(''); setActiveTab('All') }}
            title="Reset filters"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAssignModal(true)}
            style={{ gap: 6 }}
          >
            <Plus size={16} /> Assign New Enquiry
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
            <div className="stat-label">In Active Negotiation</div>
            <div className="stat-change up">Price discovery underway</div>
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
            <div className="stat-label">Follow-ups Due Today</div>
            <div className="stat-change down" style={{ color: '#ff3b30' }}>
              Action required
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card">
        {/* Controls Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14
          }}
        >
          {/* Status Segmented Tabs */}
          <div className="filter-tabs" style={{ flexWrap: 'wrap' }}>
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
                type="button"
                className={`filter-tab${activeTab === tab.label ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.label)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 9999,
                    background: activeTab === tab.label ? 'rgba(0, 113, 227, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                    color: activeTab === tab.label ? '#0071e3' : '#6e6e73'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + View Toggle */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="filter-search" style={{ maxWidth: 280, height: 36 }}>
              <Search size={14} color="#86868b" />
              <input
                placeholder="Search enquiry ID, vehicle, bidder..."
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

            <div
              style={{
                display: 'flex',
                gap: 2,
                padding: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 9999,
                background: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 14px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 9999,
                  background: viewMode === 'table' ? '#ffffff' : 'transparent',
                  color: viewMode === 'table' ? '#0071e3' : '#6e6e73',
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 14px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 9999,
                  background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                  color: viewMode === 'cards' ? '#0071e3' : '#6e6e73',
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: viewMode === 'cards' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        {filteredEnquiries.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#86868b' }}>
            <FileText size={44} style={{ marginBottom: 12, opacity: 0.25, color: '#0071e3' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>No assigned enquiries match your filters</div>
            <div style={{ fontSize: 13, marginTop: 4, color: '#86868b' }}>
              Try clearing your search query or switching to another filter tab.
            </div>
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
                {filteredEnquiries.map(enquiry => (
                  <tr
                    key={enquiry.id}
                    onClick={() => setSelectedEnquiry(enquiry)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Enquiry ID */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#0071e3', fontSize: 13 }}>
                        {enquiry.enquiryId}
                      </div>
                      <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
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
                        <div style={{ fontWeight: 600, color: '#1d1d1f', fontSize: 13, lineHeight: 1.3 }}>
                          {enquiry.carName}
                        </div>
                      </Link>
                      <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
                        {enquiry.carDetails.fuel} · {enquiry.carDetails.km} km · {enquiry.carDetails.location}
                      </div>
                    </td>

                    {/* Assigned Bidder */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#1d1d1f', fontSize: 13 }}>
                        {enquiry.bidderName}
                      </div>
                      <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
                        {enquiry.contactPerson} · {enquiry.bidderCode}
                      </div>
                      <span className="badge blue" style={{ fontSize: 9, padding: '1px 6px', marginTop: 3 }}>
                        {enquiry.bidderType}
                      </span>
                    </td>

                    {/* Prices: Offer vs Ask */}
                    <td>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>
                        {enquiry.bidderOffer}
                      </div>
                      <div style={{ fontSize: 10, color: '#86868b' }}>
                        Ask: {enquiry.sellerAsk}
                      </div>
                    </td>

                    {/* Target Price */}
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>
                        {enquiry.targetPrice}
                      </div>
                      <div style={{ fontSize: 10, color: '#86868b' }}>
                        Token: {enquiry.tokenDate || 'N/A'}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={getStatusBadgeClass(enquiry.status)}>
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Next Follow-up */}
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: enquiry.nextFollowUp.includes('Overdue') ? '#ff3b30' : '#1d1d1f' }}>
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
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={(e) => handleCall(enquiry, e)}
                          title="Call Bidder"
                          style={{ padding: '5px 11px' }}
                        >
                          <Phone size={12} /> Call
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enquiry) }}
                          style={{ padding: '5px 11px' }}
                        >
                          <Eye size={12} /> Details
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 16,
              padding: 20
            }}
          >
            {filteredEnquiries.map(enquiry => (
              <div
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className="card"
                style={{
                  padding: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0071e3' }}>
                      {enquiry.enquiryId}
                    </span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1d1d1f', marginTop: 2 }}>
                      {enquiry.carName}
                    </div>
                    <div style={{ fontSize: 11, color: '#86868b' }}>
                      {enquiry.carDetails.location} · {enquiry.carDetails.fuel}
                    </div>
                  </div>

                  <span className={getStatusBadgeClass(enquiry.status)}>
                    {enquiry.status}
                  </span>
                </div>

                {/* Bidder Card Box */}
                <div
                  style={{
                    background: 'rgba(248, 250, 252, 0.75)',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>
                      {enquiry.bidderName}
                    </div>
                    <span className="badge blue" style={{ fontSize: 9 }}>{enquiry.bidderType}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
                    {enquiry.contactPerson} · {enquiry.bidderPhone}
                  </div>
                </div>

                {/* Pricing Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                  <div style={{ background: 'rgba(52, 199, 89, 0.08)', padding: '8px 4px', borderRadius: 8, border: '1px solid rgba(52, 199, 89, 0.2)' }}>
                    <div style={{ fontSize: 10, color: '#15803d', fontWeight: 600 }}>Bidder Offer</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#15803d', marginTop: 2 }}>{enquiry.bidderOffer}</div>
                  </div>
                  <div style={{ background: 'rgba(248, 250, 252, 0.7)', padding: '8px 4px', borderRadius: 8, border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                    <div style={{ fontSize: 10, color: '#86868b', fontWeight: 600 }}>Seller Ask</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginTop: 2 }}>{enquiry.sellerAsk}</div>
                  </div>
                  <div style={{ background: 'rgba(0, 113, 227, 0.08)', padding: '8px 4px', borderRadius: 8, border: '1px solid rgba(0, 113, 227, 0.2)' }}>
                    <div style={{ fontSize: 10, color: '#0071e3', fontWeight: 600 }}>Target TP</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0071e3', marginTop: 2 }}>{enquiry.targetPrice}</div>
                  </div>
                </div>

                {/* Footer info & actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
                  <div style={{ fontSize: 11, color: '#86868b' }}>
                    Follow-up: <strong style={{ color: enquiry.nextFollowUp.includes('Overdue') ? '#ff3b30' : '#1d1d1f' }}>{enquiry.nextFollowUp}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => handleCall(enquiry, e)}
                    >
                      <Phone size={12} /> Call
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enquiry) }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Liquid Glass Drawer: Enquiry Details & Management */}
      {selectedEnquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            style={{
              width: 580,
              maxWidth: '92vw',
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(31, 38, 135, 0.08)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.7)',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '22px 28px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                background: 'rgba(248, 250, 252, 0.6)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0071e3' }}>
                    {selectedEnquiry.enquiryId}
                  </span>
                  <span className={getStatusBadgeClass(selectedEnquiry.status)}>
                    {selectedEnquiry.status}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', marginTop: 6, lineHeight: 1.3 }}>
                  {selectedEnquiry.carName}
                </div>
                <div style={{ fontSize: 12, color: '#86868b', marginTop: 4 }}>
                  Assigned Executive: <strong style={{ color: '#1d1d1f' }}>{selectedEnquiry.assignedExecutive}</strong> · Assigned on {selectedEnquiry.assignedDate}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  color: '#6e6e73',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div
              style={{
                padding: '14px 28px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                gap: 10
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleCall(selectedEnquiry)}
              >
                <Phone size={14} /> Call Bidder ({selectedEnquiry.bidderPhone})
              </button>
              <Link to={`/all-cars/${selectedEnquiry.carId}`} style={{ textDecoration: 'none' }}>
                <button type="button" className="btn btn-outline">
                  <ExternalLink size={14} /> View Vehicle
                </button>
              </Link>
            </div>

            {/* Drawer Body Content */}
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Pricing Matrix Overview */}
              <div
                style={{
                  background: 'rgba(248, 250, 252, 0.75)',
                  padding: 16,
                  borderRadius: 14,
                  border: '1px solid rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginBottom: 12 }}>
                  Price Negotiation Overview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ fontSize: 10, color: '#86868b', textTransform: 'uppercase', fontWeight: 600 }}>Seller Ask</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f', marginTop: 2 }}>{selectedEnquiry.sellerAsk}</div>
                  </div>
                  <div style={{ background: 'rgba(52, 199, 89, 0.08)', padding: 12, borderRadius: 10, border: '1px solid rgba(52, 199, 89, 0.25)' }}>
                    <div style={{ fontSize: 10, color: '#15803d', textTransform: 'uppercase', fontWeight: 600 }}>Bidder Offer</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d', marginTop: 2 }}>{selectedEnquiry.bidderOffer}</div>
                  </div>
                  <div style={{ background: 'rgba(0, 113, 227, 0.08)', padding: 12, borderRadius: 10, border: '1px solid rgba(0, 113, 227, 0.25)' }}>
                    <div style={{ fontSize: 10, color: '#0071e3', textTransform: 'uppercase', fontWeight: 600 }}>Target (TP)</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0071e3', marginTop: 2 }}>{selectedEnquiry.targetPrice}</div>
                  </div>
                </div>
              </div>

              {/* Assigned Bidder Details Card */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  padding: 16,
                  borderRadius: 14,
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>
                    Assigned Bidder Details
                  </div>
                  <Link to="/bidders" style={{ fontSize: 12, color: '#0071e3', fontWeight: 600, textDecoration: 'none' }}>
                    Bidder Directory →
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#86868b' }}>Bidder Organization</div>
                    <div style={{ fontWeight: 700, color: '#1d1d1f', marginTop: 2 }}>{selectedEnquiry.bidderName}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86868b' }}>Bidder Code</div>
                    <div style={{ fontWeight: 600, color: '#1d1d1f', marginTop: 2 }}>{selectedEnquiry.bidderCode}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86868b' }}>Primary Contact</div>
                    <div style={{ fontWeight: 600, color: '#1d1d1f', marginTop: 2 }}>{selectedEnquiry.contactPerson}</div>
                  </div>
                  <div>
                    <div style={{ color: '#86868b' }}>Registered Phone</div>
                    <div style={{ fontWeight: 600, color: '#1d1d1f', marginTop: 2 }}>{selectedEnquiry.bidderPhone}</div>
                  </div>
                </div>

                {/* Reassign dropdown */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#86868b', whiteSpace: 'nowrap' }}>Reassign to Bidder:</span>
                  <select
                    className="form-input"
                    style={{ flex: 1, padding: '6px 12px', fontSize: 12, borderRadius: 8 }}
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
              <div
                style={{
                  background: 'rgba(248, 250, 252, 0.75)',
                  padding: 16,
                  borderRadius: 14,
                  border: '1px solid rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1d1d1f', marginBottom: 10 }}>
                  Update Negotiation Status
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Negotiation Active', 'Token Confirmed', 'Inspection Scheduled', 'Follow-up Due', 'Deal Closed'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 9999,
                        border: '1px solid',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderColor: selectedEnquiry.status === st ? 'rgba(0, 113, 227, 0.3)' : 'rgba(0, 0, 0, 0.08)',
                        background: selectedEnquiry.status === st ? '#0071e3' : '#ffffff',
                        color: selectedEnquiry.status === st ? '#ffffff' : '#475569',
                        boxShadow: selectedEnquiry.status === st ? '0 2px 6px rgba(0, 113, 227, 0.25)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Notes Log */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Negotiation Activity & Notes Log
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    placeholder="Add follow-up notes, offer revision, or call summary..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddNote(selectedEnquiry.id) }}
                    className="form-input"
                    style={{ flex: 1, padding: '9px 14px', borderRadius: 9999, fontSize: 13 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddNote(selectedEnquiry.id)}
                    style={{ padding: '8px 16px' }}
                  >
                    Post Note
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedEnquiry.notes || []).map(n => (
                    <div
                      key={n.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        padding: '10px 14px',
                        borderRadius: 10,
                        fontSize: 12,
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868b', fontSize: 11 }}>
                        <strong style={{ color: '#1d1d1f' }}>{n.author}</strong>
                        <span>{n.time}</span>
                      </div>
                      <div style={{ color: '#334155', marginTop: 4, lineHeight: 1.4 }}>{n.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Frosted Modal: Assign New Enquiry */}
      {showAssignModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className="card"
            style={{
              width: 520,
              maxWidth: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(248, 250, 252, 0.65)'
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1d1d1f' }}>
                Assign Vehicle Enquiry to Bidder
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#86868b' }}
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
                <label className="form-label">Assign to Authorized Bidder *</label>
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

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setCallingBidder(null)}
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
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'rgba(0, 113, 227, 0.1)',
                color: '#0071e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid rgba(0, 113, 227, 0.3)',
                boxShadow: '0 0 20px rgba(0, 113, 227, 0.2)'
              }}
            >
              <PhoneCall size={32} />
            </div>
            <div style={{ fontSize: 12, color: '#0071e3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Calling Bidder for Enquiry...
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1d1d1f', marginTop: 6 }}>
              {callingBidder.name}
            </div>
            <div style={{ fontSize: 13, color: '#86868b', marginTop: 2 }}>
              {callingBidder.contactPerson} · {callingBidder.phone}
            </div>
            <div style={{ fontSize: 12, color: '#0071e3', fontWeight: 600, marginTop: 8 }}>
              Regarding: {callingBidder.enquiryId}
            </div>

            <button
              type="button"
              className="btn btn-danger"
              style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '11px 0' }}
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
