import React, { useState, useEffect } from 'react'
import { User, Mail, Hash, Award, Edit2, Save, Calendar, TrendingUp } from 'lucide-react'
import { updateProfile, getUserStats } from '../services/api'


export default function Profile({ user, setUser }){
const [editing, setEditing] = useState(false)
const [bio, setBio] = useState(user?.bio || '')
const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.join(', ') : user?.skills || '')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [stats, setStats] = useState({ postsCreated: 0, interestsSent: 0 })

useEffect(() => {
  if (!user) return
  
  getUserStats()
    .then(data => setStats(data))
    .catch(err => console.error('Failed to load stats:', err))
}, [user?.id])

if(!user) {
  return (
    <div className="glass-card p-12 text-center">
      <User size={64} className="mx-auto text-gray-300 mb-4" />
      <h3 className="heading-font text-2xl font-bold text-gray-400 mb-2">Please sign in</h3>
      <p className="text-gray-400">Sign in to view your profile</p>
    </div>
  )
}

async function handleSave() {
  setLoading(true)
  setError('')
  
  try {
    const updatedUser = await updateProfile({ bio, skills })
    setUser(updatedUser)
    setEditing(false)
  } catch (err) {
    setError(err.message || 'Failed to update profile')
  } finally {
    setLoading(false)
  }
}

return (
<div className="max-w-4xl mx-auto space-y-6">
  <div className="glass-card p-8">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-6">
        <div className="avatar w-24 h-24 text-4xl">
          {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
        </div>
        
        <div>
          <h1 className="heading-font text-3xl font-bold text-gray-800 mb-1">
            {user.name || user.username}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            {user.srn && (
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-purple-500" />
                <span className="font-mono font-semibold">{user.srn}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-teal-500" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => editing ? handleSave() : setEditing(true)}
        disabled={loading}
        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
          editing
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white disabled:opacity-50'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {loading ? (
          <><div className="spinner w-4 h-4"></div>Saving...</>
        ) : editing ? (
          <><Save size={16} />Save Profile</>
        ) : (
          <><Edit2 size={16} />Edit Profile</>
        )}
      </button>
    </div>

    <div className="mt-6">
      <label className="text-xs font-bold text-gray-600 block mb-2">ABOUT ME</label>
      {editing ? (
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg input-fun text-gray-800 text-sm resize-none"
          placeholder="Tell us about yourself..."
        />
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed">
          {bio || 'No bio yet'}
        </p>
      )}
    </div>

    {error && (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    )}

    <div className="mt-4">
      <label className="text-xs font-bold text-gray-600 block mb-2 flex items-center gap-1">
        <Award size={14} className="text-indigo-500" />
        SKILLS & INTERESTS
      </label>
      {editing ? (
        <input
          value={skills}
          onChange={e => setSkills(e.target.value)}
          className="w-full px-4 py-3 rounded-lg input-fun text-gray-800 text-sm"
          placeholder="React, Node.js, Python..."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {(skills || '').split(',').filter(s => s.trim()).map((skill, i) => (
            <span key={i} className="badge badge-teal text-xs">{skill.trim()}</span>
          ))}
        </div>
      )}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="glass-card p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-3">
        <Calendar size={24} />
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{stats.postsCreated}</div>
      <div className="text-sm text-gray-600 font-medium">Posts Created</div>
    </div>

    <div className="glass-card p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white mb-3">
        <TrendingUp size={24} />
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{stats.interestsSent}</div>
      <div className="text-sm text-gray-600 font-medium">Interests Sent</div>
    </div>
  </div>
</div>
)
}