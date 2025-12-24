import React from 'react'
import { Link } from 'react-router-dom'
import { Home, User, LogOut, Sparkles } from 'lucide-react'

export default function Navbar({ user, onLogout }){
  return (
    <div className="flex items-center justify-between glass-card p-4 shadow-lg mb-6">
      <div className="flex items-center gap-3">
        <div className="heading-font text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles size={24} className="text-yellow-400" />
          SquadSync
        </div>
        <div className="hidden md:block text-sm text-gray-500 font-medium">
          Team up for campus events! 🎯
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-xl hover:bg-indigo-50 text-gray-700 font-medium transition-all flex items-center gap-2"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link 
              to="/profile" 
              className="px-4 py-2 rounded-xl hover:bg-purple-50 text-gray-700 font-medium transition-all flex items-center gap-2"
            >
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 btn-primary text-white rounded-xl font-medium"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}