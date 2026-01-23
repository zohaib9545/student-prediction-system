import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const handleLogout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }
  const user = JSON.parse(localStorage.getItem('user')||'null')
  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">SP</div>
        <div>
          <div className="text-lg font-semibold">Student Performance</div>
          <div className="text-xs text-gray-500">Prediction Dashboard</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">{user ? `Welcome, ${user.name}` : 'Welcome'}</div>
        <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
      </div>
    </motion.header>
  )
}
