import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AllCars from './pages/AllCars'
import CallLogs from './pages/CallLogs'
import ProfilePage from './pages/ProfilePage'
import CarDetail from './pages/CarDetail'
import Bidders from './pages/Bidders'
import BidderAssignedEnquiry from './pages/BidderAssignedEnquiry'
import SkeletonSplash from './components/SkeletonSplash'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bnd_user')) } catch { return null }
  })
  const [showSplash, setShowSplash] = useState(true)

  // Listen for manual workspace refresh triggers
  useEffect(() => {
    const handleTriggerSplash = () => {
      setShowSplash(true)
    }
    window.addEventListener('trigger-skeleton-splash', handleTriggerSplash)
    return () => window.removeEventListener('trigger-skeleton-splash', handleTriggerSplash)
  }, [])

  const login = (userData) => {
    localStorage.setItem('bnd_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('bnd_user')
    setUser(null)
  }

  return (
    <>
      {/* 1.5-Second Skeleton Loading Splash Screen on Refresh / Load */}
      {showSplash && (
        <SkeletonSplash
          isLoggedIn={Boolean(user)}
          duration={1500}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {!user ? (
        <LoginPage onLogin={login} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout user={user} onLogout={logout} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard user={user} />} />
              <Route path="all-cars" element={<AllCars />} />
              <Route path="all-cars/:id" element={<CarDetail />} />
              <Route path="bidders" element={<Bidders />} />
              <Route path="bider" element={<Navigate to="/bidders" replace />} />
              <Route path="bidder-assigned-enquiry" element={<BidderAssignedEnquiry />} />
              <Route path="assigned-enquiry" element={<Navigate to="/bidder-assigned-enquiry" replace />} />
              <Route path="bidder-assigned-enquiries" element={<Navigate to="/bidder-assigned-enquiry" replace />} />
              <Route path="call-logs" element={<CallLogs />} />
              <Route path="profile" element={<ProfilePage user={user} onLogout={logout} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
