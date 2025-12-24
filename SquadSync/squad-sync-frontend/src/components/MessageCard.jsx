import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Calendar, Clock, Trash2, CheckCircle } from 'lucide-react'
import { contactAuthor, markPostAsFound, deletePost } from '../services/api'


export default function MessageCard({ message, refresh, currentUser, onInterestSent }){
const [interested, setInterested] = useState(false)
const [loading, setLoading] = useState(false)
const [actionLoading, setActionLoading] = useState(false)
const navigate = useNavigate()

async function handleInterested(){
  if (loading) return
  
  try {
    setLoading(true)
    const result = await contactAuthor(message.id)
    setInterested(true)
    
    // update stats if callback provided
    if (onInterestSent) {
      onInterestSent(result.stats?.interestsSent)
    }
    
    setTimeout(() => {
      alert(`Your details were sent to ${message.author.name || message.author.username}. They can reach out by email.`)
    }, 200)
  } catch(err) {
    alert(err.message || 'Failed to send interest. Please try again.')
  } finally {
    setLoading(false)
  }
}

async function handleMarkFound() {
  if (actionLoading) return
  
  if (!confirm('Mark this post as "Found Teammate"? This will disable the interest button for others.')) {
    return
  }
  
  try {
    setActionLoading(true)
    await markPostAsFound(message.id)
    alert('Post marked as found teammate!')
    if (refresh) refresh()
  } catch(err) {
    alert(err.message || 'Failed to mark post')
  } finally {
    setActionLoading(false)
  }
}

async function handleDelete() {
  if (actionLoading) return
  
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }
  
  try {
    setActionLoading(true)
    await deletePost(message.id)
    alert('Post deleted successfully!')
    if (refresh) refresh()
  } catch(err) {
    alert(err.message || 'Failed to delete post')
  } finally {
    setActionLoading(false)
  }
}

// Calculate time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}

const isOwnPost = currentUser && (currentUser.username === message.author.username || currentUser.srn === message.author.srn)

return (
<div className="post-card p-6 mb-4">
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="avatar w-12 h-12 text-lg flex-shrink-0">
        {message.author.name?.[0]?.toUpperCase() || message.author.username?.[0]?.toUpperCase() || 'U'}
      </div>
      
      <div>
        <h3 className="font-bold text-gray-800 text-base">
          {message.author.name || message.author.username}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {message.author.srn && <span>{message.author.srn}</span>}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {timeAgo(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  </div>

  {message.eventName && (
    <h2 className="heading-font text-xl font-bold text-gray-800 mb-2">
      {message.eventName}
    </h2>
  )}

  {message.eventDate && (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
      <Calendar size={16} className="text-indigo-500" />
      <span className="font-medium">
        {new Date(message.eventDate).toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}
      </span>
    </div>
  )}

  <p className="text-gray-700 text-sm leading-relaxed mb-4">
    {message.text}
  </p>

  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
    <div className="flex items-center gap-3">
      {!isOwnPost && (
        <button
          onClick={handleInterested}
          disabled={loading || interested || message.foundTeammate}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
            interested
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : message.foundTeammate
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'btn-secondary text-white hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <div className="spinner w-4 h-4 border-2"></div>
              Sending...
            </>
          ) : interested ? (
            <>
              <CheckCircle size={16} />
              Interest Sent
            </>
          ) : message.foundTeammate ? (
            <>
              <CheckCircle size={16} />
              Team Found
            </>
          ) : (
            <>
              <Mail size={16} />
              I'm Interested
            </>
          )}
        </button>
      )}
      
      {isOwnPost && (
        <div className="flex items-center gap-2">
          {!message.foundTeammate && (
            <button
              onClick={handleMarkFound}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={16} />
              Got Teammate
            </button>
          )}
          {message.foundTeammate && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Team Found
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {actionLoading ? (
              <>
                <div className="spinner w-4 h-4 border-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  </div>
</div>
)
}