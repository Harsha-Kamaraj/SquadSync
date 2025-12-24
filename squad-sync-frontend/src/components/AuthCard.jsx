import React from 'react'


export default function AuthCard({ children, title }){
  return (
    <div className="mx-auto max-w-xl glass-card p-8 shadow-2xl animate-in">
      <div className="mb-6">{title}</div>
      {children}
    </div>
  )
}