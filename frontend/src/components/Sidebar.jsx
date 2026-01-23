import React from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/overview', label: 'Overview' },
  { to: '/input', label: 'Input Marks' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/history', label: 'History' },
  { to: '/teacher', label: 'Teacher' },
]

export default function Sidebar() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')||'null') } catch(e){ return null } })()
  // If user is a teacher, show only the Teacher dashboard link
  const teacherOnly = user && user.role === 'teacher'
  const visibleItems = teacherOnly ? [{ to: '/teacher', label: 'Teacher' }] : items.filter(i => i.to !== '/teacher')

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-600 text-white min-h-screen p-6 hidden md:block">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-6 text-sm uppercase tracking-wide">University</div>
        <nav className="flex flex-col gap-2">
          {visibleItems.map(i => (
            <NavLink key={i.to} to={i.to} className={({isActive})=>`px-3 py-2 rounded transition ${isActive? 'bg-white/20' : 'hover:bg-white/10'}`}>
              {i.label}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </aside>
  )
}
