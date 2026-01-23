import React from 'react'
import { motion } from 'framer-motion'

function Circle({ value = 0, size = 120, stroke = 10, color = '#4f46e5', label }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, Number(value) || 0))
  const dash = (clamped / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="transparent" stroke="#e6e6e6" strokeWidth={stroke} />
          <motion.circle
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 0.9 }}
          />
        </g>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-lg font-semibold">{clamped}%</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

export default function MidtermComparison({ midterm = 0, predicted = 0 }) {
  return (
    <div className="flex gap-6 items-center">
      <Circle value={midterm} color="#4338ca" label="Midterm" />
      <div className="w-px h-24 bg-gray-200" />
      <Circle value={predicted} color="#f97316" label="Predicted Final" />
    </div>
  )
}
