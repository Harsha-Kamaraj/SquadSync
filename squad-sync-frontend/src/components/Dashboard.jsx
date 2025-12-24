import React, { useEffect, useState } from 'react'
import { Calendar, Send, Filter, TrendingUp, Users, Sparkles } from 'lucide-react'
import MessageList from './MessageList'
import { sendBroadcast, fetchMessages } from '../services/api'


export default function Dashboard({ user }){
const [eventName, setEventName] = useState('')
const [eventDate, setEventDate] = useState('')
const [description, setDescription] = useState('')
const [messages, setMessages] = useState([])
const [loading, setLoading] = useState(false)
const [filterType, setFilterType] = useState('All')

const filterTypes = ['All', 'Available', 'Created By Me', 'Stopped']

useEffect(() => { 
  loadMessages() 
}, [filterType])

async function loadMessages(){
  const msgs = await fetchMessages(filterType, user?.id)
  setMessages(msgs)
}

async function handleCreatePost(){
  if (!eventName.trim() || !description.trim()) {
    alert('Please fill in event name and description')
    return
  }
  
  setLoading(true)
  try {
    await sendBroadcast({ 
      eventName,
      eventDate,
      text: description, 
      author: user 
    })
    
    setEventName('')
    setEventDate('')
    setDescription('')
    loadMessages()
  } catch(err) {
    alert('Failed to create post')
  } finally {
    setLoading(false)
  }
}

return (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1 space-y-5">
    <div className="glass-card p-6">
      <div className="flex items-center gap-4">
        <div className="avatar w-16 h-16 text-2xl">
          {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="heading-font text-xl font-bold text-gray-800">
            {user?.name || user?.username || 'Guest'}
          </h3>
          <p className="text-sm text-gray-500">{user?.srn || 'Student'}</p>
          <p className="text-xs text-gray-400">{user?.email || ''}</p>
        </div>
      </div>
    </div>

    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="text-yellow-500" size={20} />
        <h4 className="heading-font text-lg font-bold text-gray-800">Create Post</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">EVENT NAME</label>
          <input
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg input-fun text-gray-800 text-sm"
            placeholder="e.g., Smart India Hackathon 2025"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2 flex items-center gap-1">
            <Calendar size={14} />
            EVENT DATE
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg input-fun text-gray-800 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">DESCRIPTION</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg input-fun text-gray-800 text-sm resize-none"
            placeholder="Looking for teammates..."
          />
        </div>

        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="w-full px-4 py-3 btn-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><div className="spinner w-5 h-5"></div>Posting...</>
          ) : (
            <><Send size={18} />Post to Feed</>
          )}
        </button>
      </div>
    </div>
  </div>

  <div className="lg:col-span-2">
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <h4 className="heading-font text-lg font-bold text-gray-800">Feed</h4>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {filterTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === type
                  ? 'badge-purple'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>

    {messages.length === 0 ? (
      <div className="glass-card p-12 text-center">
        <Users size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="heading-font text-xl font-bold text-gray-400 mb-2">No posts yet</h3>
        <p className="text-gray-400 text-sm">Be the first to create a post!</p>
      </div>
    ) : (
      <MessageList messages={messages} refresh={loadMessages} currentUser={user} />
    )}
  </div>
</div>
)
}