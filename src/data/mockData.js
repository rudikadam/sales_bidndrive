// Mock data for Sales BID N DRIVE

export const cars = [
  {
    id: 1,
    name: '2022 HYUNDAI VENUE SX 1.5 CRDI DUAL TONE [2022 - 2025]',
    year: 2022, make: 'Hyundai', model: 'Venue SX',
    engine: '4.5', km: '90,230', owner: '1st owner', fuel: 'Diesel',
    appId: '16639891198', dealerName: 'CAR WORLD', dealerCode: '137174',
    location: 'P8-08 • Jalandhar', highestNego: '₹0',
    sellerAsk: '₹7,10,000', leadPrice: '₹14,058 + 18% GST(₹2,530)',
    targetPrice: '₹8,47,717', tokenDate: 'N/A',
    acceptance: 'High acceptance probability', color_hex: '#dc2626',
  },
  {
    id: 2,
    name: '2015 SKODA RAPID 1.5 TDI CR STYLE PLUS AT [2015 - 2016]',
    year: 2015, make: 'Skoda', model: 'Rapid 1.5',
    engine: '3.5', km: '1,73,636', owner: '2nd owner', fuel: 'Diesel',
    appId: '13551296172', dealerName: 'CAR WORLD', dealerCode: '137174',
    location: 'MH-02 • Surat', highestNego: '₹0',
    sellerAsk: '₹5,80,000', leadPrice: '₹12,000 + 18% GST(₹2,160)',
    targetPrice: '₹7,20,000', tokenDate: 'N/A',
    acceptance: null, color_hex: '#6b7280',
  },
  {
    id: 3,
    name: '2020 MARUTI SUZUKI SWIFT VXI [2017 - 2023]',
    year: 2020, make: 'Maruti Suzuki', model: 'Swift VXI',
    engine: '4.0', km: '45,000', owner: '1st owner', fuel: 'Petrol',
    appId: '19876543210', dealerName: 'AUTO ZONE', dealerCode: '248910',
    location: 'DL-01 • Delhi', highestNego: '₹5,000',
    sellerAsk: '₹5,25,000', leadPrice: '₹10,000 + 18% GST(₹1,800)',
    targetPrice: '₹6,00,000', tokenDate: '15-Nov-2026',
    acceptance: 'High acceptance probability', color_hex: '#16a34a',
  },
  {
    id: 4,
    name: '2019 HONDA CITY VX CVT [2017 - 2020]',
    year: 2019, make: 'Honda', model: 'City VX',
    engine: '4.2', km: '62,500', owner: '1st owner', fuel: 'Petrol',
    appId: '17654321098', dealerName: 'MOTORS WORLD', dealerCode: '301456',
    location: 'MH-04 • Pune', highestNego: '₹10,000',
    sellerAsk: '₹8,50,000', leadPrice: '₹15,500 + 18% GST(₹2,790)',
    targetPrice: '₹9,80,000', tokenDate: 'N/A',
    acceptance: null, color_hex: '#2563eb',
  },
  {
    id: 5,
    name: '2021 TATA NEXON EV MAX [2021 - 2023]',
    year: 2021, make: 'Tata', model: 'Nexon EV Max',
    engine: '4.8', km: '28,000', owner: '1st owner', fuel: 'Electric',
    appId: '20123456789', dealerName: 'EV MOTORS', dealerCode: '412890',
    location: 'KA-01 • Bangalore', highestNego: '₹25,000',
    sellerAsk: '₹14,00,000', leadPrice: '₹22,000 + 18% GST(₹3,960)',
    targetPrice: '₹16,50,000', tokenDate: '20-Nov-2026',
    acceptance: 'High acceptance probability', color_hex: '#7c3aed',
  },
  {
    id: 6,
    name: '2018 FORD ECOSPORT TITANIUM 1.5 TDCI [2018 - 2021]',
    year: 2018, make: 'Ford', model: 'EcoSport Titanium',
    engine: '3.8', km: '88,900', owner: '2nd owner', fuel: 'Diesel',
    appId: '14432109876', dealerName: 'EXCEL AUTO', dealerCode: '509234',
    location: 'GJ-01 • Ahmedabad', highestNego: '₹2,000',
    sellerAsk: '₹6,80,000', leadPrice: '₹13,500 + 18% GST(₹2,430)',
    targetPrice: '₹8,20,000', tokenDate: 'N/A',
    acceptance: null, color_hex: '#ea580c',
  },
]

export const dealers = [
  { id: 1, code: '146722', name: '146722- SETHS AND SONS', type: 'Touch & Buy', status: 'online', contacted: false },
  { id: 2, code: '147831', name: '147831- SHRI MOTORS', type: 'Touch & Buy', status: 'online', contacted: true },
  { id: 3, code: '138902', name: '138902- NATIONAL CARS', type: 'Reco Buy', status: 'offline', contacted: false },
  { id: 4, code: '152341', name: '152341- CITY AUTO ZONE', type: 'Touch & Buy', status: 'online', contacted: true },
  { id: 5, code: '163490', name: '163490- PRIME MOTORS', type: 'Reco Buy', status: 'offline', contacted: false },
]

export const callLogs = [
  { id: 1, dealer: 'SETHS AND SONS', date: '12-Nov-2026', time: '10:30 AM', duration: '5:23', type: 'Outgoing', status: 'Connected' },
  { id: 2, dealer: 'SHRI MOTORS', date: '12-Nov-2026', time: '09:15 AM', duration: '2:10', type: 'Incoming', status: 'Connected' },
  { id: 3, dealer: 'NATIONAL CARS', date: '11-Nov-2026', time: '04:45 PM', duration: '0:00', type: 'Outgoing', status: 'Missed' },
  { id: 4, dealer: 'CITY AUTO ZONE', date: '11-Nov-2026', time: '02:30 PM', duration: '8:45', type: 'Outgoing', status: 'Connected' },
  { id: 5, dealer: 'PRIME MOTORS', date: '10-Nov-2026', time: '11:00 AM', duration: '3:12', type: 'Incoming', status: 'Connected' },
  { id: 6, dealer: 'SETHS AND SONS', date: '10-Nov-2026', time: '09:30 AM', duration: '0:00', type: 'Incoming', status: 'Missed' },
]

export const DEMO_USERS = [
  { email: 'admin@bidndrive.com', password: 'admin123', name: 'Admin User', role: 'Admin', id: 'EMP001' },
  { email: 'sales@bidndrive.com', password: 'sales123', name: 'Rahul Sharma', role: 'Sales Executive', id: 'EMP002' },
  { email: 'ra@bidndrive.com', password: 'ra123', name: 'Priya Singh', role: 'RA Associate', id: 'EMP003' },
]
