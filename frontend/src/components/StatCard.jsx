import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, subtitle, color = 'bg-indigo-600', variant }) {
  const variants = {
    indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-400',
    amber: 'bg-gradient-to-r from-amber-500 to-amber-300',
    green: 'bg-gradient-to-r from-green-600 to-emerald-400',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-400',
    teal: 'bg-gradient-to-r from-teal-600 to-cyan-400',
    violet: 'bg-gradient-to-r from-violet-600 to-purple-400',
  }

  const bgClass = variant ? (variants[variant] || variant) : color

  return (
    <motion.div whileHover={{ y: -6 }} className={`p-4 rounded-lg shadow-lg text-white ${bgClass}`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {subtitle && <div className="text-xs opacity-90 mt-1">{subtitle}</div>}
    </motion.div>
  )
}
