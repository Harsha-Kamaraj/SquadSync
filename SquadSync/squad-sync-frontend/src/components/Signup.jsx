import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Key, User, Hash, CheckCircle, AlertCircle } from 'lucide-react'
import AuthCard from './AuthCard'
import { signUp } from '../services/api'


export default function Signup(){
const [name, setName] = useState('')
const [srn, setSrn] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirm, setConfirm] = useState('')
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const [loading, setLoading] = useState(false)
const navigate = useNavigate()

const validateSRN = (srn) => /^PES\d[A-Z]{2}\d{2}[A-Z]{2}\d{3}$/i.test(srn)
const validateEmail = (email) => email.endsWith('@stu.pes.edu')

const handleSrnChange = (value) => {
  setSrn(value.toUpperCase())
  if (value && !email) {
    setEmail(`${value.toLowerCase()}@stu.pes.edu`)
  }
}

async function submit(e){
  e.preventDefault()
  setError('')
  setSuccess('')
  
  if (!name.trim()) {
    setError('Please enter your full name')
    return
  }
  
  if (!validateSRN(srn)) {
    setError('Invalid SRN format. Example: PES1UG24CS123')
    return
  }
  
  if (!validateEmail(email)) {
    setError('Email must be your PES student email (@stu.pes.edu)')
    return
  }
  
  if (password.length < 6) {
    setError('Password must be at least 6 characters')
    return
  }
  
  if (password !== confirm) {
    setError('Passwords do not match')
    return
  }
  
  setLoading(true)
  try {
    await signUp({ name, srn, email, password })
    setSuccess('Account created successfully! Redirecting...')
    setTimeout(() => navigate('/'), 2000)
  } catch(err) {
    setError(err.message || 'Signup failed')
  } finally {
    setLoading(false)
  }
}


return (
<AuthCard title={
  <div className="text-center">
    <div className="heading-font text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
      Join SquadSync
    </div>
    <div className="text-sm text-gray-600 mt-2">Find your perfect team for hackathons & projects</div>
  </div>
}>
<form onSubmit={submit} className="space-y-4 mt-6">
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <User size={16} className="text-indigo-500" />
      Full Name
    </label>
    <input 
      value={name} 
      onChange={e => setName(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium" 
      placeholder="John Doe"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <Hash size={16} className="text-purple-500" />
      SRN (Student Registration Number)
    </label>
    <input 
      value={srn} 
      onChange={e => handleSrnChange(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium uppercase" 
      placeholder="PES1UG24CS123"
      maxLength={13}
      required
    />
    {srn && !validateSRN(srn) && (
      <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> Format: PES1UG24CS123
      </p>
    )}
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <Mail size={16} className="text-teal-500" />
      PES Email
    </label>
    <input 
      type="email"
      value={email} 
      onChange={e => setEmail(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium" 
      placeholder="pes1ug24cs123@stu.pes.edu"
      required
    />
    {email && !validateEmail(email) && (
      <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> Must use @stu.pes.edu email
      </p>
    )}
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
      placeholder="Enter a strong password"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
      <Key size={16} className="text-pink-500" />
      Confirm Password
    </label>
    <input 
      type="password" 
      value={confirm} 
      onChange={e => setConfirm(e.target.value)} 
      className="w-full px-4 py-3 rounded-xl input-fun text-gray-800 font-medium" 
      placeholder="Re-enter your password"
      required
    />
    {confirm && password !== confirm && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> Passwords don't match
      </p>
    )}
  </div>

  {error && (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
      <AlertCircle size={16} />
      {error}
    </div>
  )}
  
  {success && (
    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
      <CheckCircle size={16} />
      {success}
    </div>
  )}

  <div className="flex flex-col gap-3 pt-2">
    <button 
      type="submit" 
      disabled={loading}
      className="w-full px-6 py-3 btn-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><div className="spinner w-5 h-5"></div>Creating account...</>
      ) : (
        <><UserPlus size={20} />Create Account</>
      )}
    </button>
    
    <div className="text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
        Sign in here
      </Link>
    </div>
  </div>
</form>
</AuthCard>
)
}