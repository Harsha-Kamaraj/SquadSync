import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Key, AlertCircle, Sparkles } from 'lucide-react'
import AuthCard from './AuthCard'
import { signIn } from '../services/api'


export default function Login({ onLogin }){
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

async function submit(e){
  e.preventDefault()
  setError('')
  
  if (!username.trim() || !password.trim()) {
    setError('Please enter both username and password')
    return
  }
  
  setLoading(true)
  try {
    const user = await signIn(username, password)
    onLogin(user)
  } catch(err) {
    setError(err.message || 'Sign in failed. Please check your credentials.')
  } finally {
    setLoading(false)
  }
}


return (
<AuthCard title={
  <div className="text-center">
    <div className="heading-font text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
      SquadSync
    </div>
    <div className="flex items-center justify-center gap-2 text-gray-600">
      <Sparkles size={16} className="text-yellow-500" />
      <span className="text-sm font-medium">Find your perfect team!</span>
      <Sparkles size={16} className="text-yellow-500" />
    </div>
  </div>
}>
<form onSubmit={submit} className="space-y-5 mt-8">
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <Mail size={16} className="text-indigo-500" />
      Username or Email
    </label>
    <input 
      value={username} 
      onChange={e => setUsername(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium" 
      placeholder="Enter your username or SRN"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <Key size={16} className="text-pink-500" />
      Password
    </label>
    <input 
      type="password" 
      value={password} 
      onChange={e => setPassword(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium" 
      placeholder="Enter your password"
      required
    />
  </div>

  {error && (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
      <AlertCircle size={16} />
      {error}
    </div>
  )}

  <div className="flex flex-col gap-3 pt-2">
    <button 
      type="submit"
      disabled={loading}
      className="w-full px-6 py-3 btn-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><div className="spinner w-5 h-5"></div>Signing in...</>
      ) : (
        <><LogIn size={20} />Sign In</>
      )}
    </button>
    
    <Link 
      to="/signup" 
      className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      Create New Account
    </Link>
    
    <div className="text-center text-xs text-gray-500 mt-2">
      New to campus? Join SquadSync to connect! 
    </div>
  </div>
</form>
</AuthCard>
)
}