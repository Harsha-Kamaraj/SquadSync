import React from 'react'
import MessageCard from './MessageCard'


export default function MessageList({ messages, refresh, currentUser, onInterestSent }){
if(!messages || messages.length === 0) return null

return (
  <div className="space-y-5">
    {messages.map(m => <MessageCard key={m.id} message={m} refresh={refresh} currentUser={currentUser} onInterestSent={onInterestSent} />)}
  </div>
)
}