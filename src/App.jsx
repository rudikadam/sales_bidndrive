import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AllCars from './pages/AllCars'
import CallLogs from './pages/CallLogs'
import ProfilePage from './pages/ProfilePage'
import CarDetail from './pages/CarDetail'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bnd_user')) } catch { return null }
  })

  const login = (userData) => {
    localStorage.setItem('bnd_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('bnd_user')
    setUser(null)
  }

  if (!user) return <LoginPage onLogin={login} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="all-cars" element={<AllCars />} />
          <Route path="all-cars/:id" element={<CarDetail />} />
          <Route path="call-logs" element={<CallLogs />} />
          <Route path="profile" element={<ProfilePage user={user} onLogout={logout} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
