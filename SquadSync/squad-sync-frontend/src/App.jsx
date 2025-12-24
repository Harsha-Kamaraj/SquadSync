import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import { getCurrentUser, logout as apiLogout } from './services/api'

export default function App(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we're on auth pages
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup'

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          if (isAuthPage) {
            navigate('/dashboard')
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  function handleLogin(userObj){
    setUser(userObj)
    navigate('/dashboard')
  }

  function handleLogout(){
    apiLogout()
    setUser(null)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen app-bg">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
      <div className={`${isAuthPage ? 'flex items-center justify-center min-h-screen' : ''}`}>
        <div className={`w-full ${isAuthPage ? 'max-w-2xl px-6' : 'max-w-7xl mx-auto px-6 py-6'}`}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}