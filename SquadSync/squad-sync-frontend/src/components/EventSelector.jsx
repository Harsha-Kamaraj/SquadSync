import React from 'react'


const EVENTS = [
  'Hackathon', 'Coding Contest', 'Cultural Night', 'Music', 'Dance', 'Sports', 'Tech Talk'
]

export default function EventSelector({ value, onChange }){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} className="w-full mt-2 p-2 rounded bg-white/5">
      {EVENTS.map(ev=> <option key={ev} value={ev}>{ev}</option>)}
    </select>
  )
}