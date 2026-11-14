// Bidder API Service
const BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api/admin/biders`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken") || "YOUR_TOKEN_HERE"}`,
});

// ─── API helper ─────────────────────────────────────────────────────────────
export async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { headers: getHeaders(), ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Field Normalizer ───────────────────────────────────────────────────────
// Handles various backend database schemas (_id vs id, biderName vs name, etc.)
export function normalizeBidder(b) {
  if (!b) return null;
  const id = b.id || b._id || b.biderId || b.bidderId || String(Math.random());
  const code = b.code || b.biderCode || b.bidderCode || `BDR-${String(id).slice(-6)}`;
  const name = b.name || b.biderName || b.bidderName || b.dealershipName || b.businessName || 'Unnamed Bidder';
  const contactPerson = b.contactPerson || b.contact_person || b.ownerName || b.personName || name;
  const phone = b.phone || b.mobile || b.contactNumber || b.phoneNumber || 'N/A';
  const email = b.email || b.mail || 'N/A';
  const city = b.city || b.location || b.address || b.state || 'India';
  const type = b.type || b.biderType || b.bidderType || b.plan || 'Touch & Buy';
  
  // Status normalization
  let status = 'offline';
  if (typeof b.status === 'string') {
    status = b.status.toLowerCase() === 'online' ? 'online' : 'offline';
  } else if (b.isOnline || b.isActive) {
    status = 'online';
  }

  const contacted = Boolean(b.contacted || b.isContacted);
  const reassigned = Boolean(b.reassigned || b.isReassigned);

  // Financials
  const walletBalance = b.walletBalance || b.deposit || b.securityDeposit || b.balance 
    ? (typeof b.walletBalance === 'number' ? `₹${b.walletBalance.toLocaleString('en-IN')}` : String(b.walletBalance || b.deposit || b.securityDeposit || b.balance))
    : '₹5,00,000';

  const carsWon = Number(b.carsWon || b.totalWon || b.wonCarsCount || 0);
  const totalBidsPlaced = Number(b.totalBidsPlaced || b.totalBids || b.bidsCount || 0);
  const activeBids = Array.isArray(b.activeBids) ? b.activeBids : [];
  const activeBidsCount = Number(b.activeBidsCount ?? activeBids.length ?? 0);
  const lastActive = b.lastActive || b.updatedAt ? new Date(b.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
  const assignedTo = b.assignedTo || b.assignedExecutive || 'Rahul Sharma';

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

// ─── API Methods ────────────────────────────────────────────────────────────
export const bidderApi = {
  BASE_URL,
  getHeaders,
  apiFetch,

  // GET: Fetch all bidders
  async getAll() {
    const res = await apiFetch(BASE_URL);
    // Support either direct array, { data: [...] }, { biders: [...] }, or { bidders: [...] }
    const list = Array.isArray(res) 
      ? res 
      : (res.data || res.biders || res.bidders || res.results || []);
    return list.map(normalizeBidder);
  },

  // GET: Fetch single bidder
  async getById(id) {
    const res = await apiFetch(`${BASE_URL}/${id}`);
    const item = res.data || res.bider || res.bidder || res;
    return normalizeBidder(item);
  },

  // POST: Create new bidder
  async create(bidderData) {
    const res = await apiFetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(bidderData)
    });
    const created = res.data || res.bider || res.bidder || res;
    return normalizeBidder(created);
  },

  // PUT / PATCH: Update bidder
  async update(id, updates) {
    const res = await apiFetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    const updated = res.data || res.bider || res.bidder || res;
    return normalizeBidder(updated);
  },

  // DELETE: Remove bidder
  async delete(id) {
    return await apiFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  }
};

