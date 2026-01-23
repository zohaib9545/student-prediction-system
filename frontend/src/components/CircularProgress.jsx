import React from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function CircularProgress({ size = 120, stroke = 12, value = 0, title }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 90, damping: 12 })
  const dash = useTransform(spring, v => circumference - (v / 100) * circumference)
  React.useEffect(() => { mv.set(value) }, [value])

  return (
    <div style={{ width: size, height: size }} className="flex flex-col items-center">
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size/2}, ${size/2})`}>
          <circle r={radius} fill="transparent" stroke="#eee" strokeWidth={stroke} />
          <motion.circle r={radius} fill="transparent" stroke="url(#grad)" strokeWidth={stroke} strokeLinecap="round"
            style={{ rotate: -90, originX: '0px', originY: '0px', strokeDasharray: circumference, strokeDashoffset: dash }} />
        </g>
      </svg>
      <div className="-mt-16 text-center">
        <div className="text-2xl font-bold"><motion.span>{/* placeholder for animated value */}</motion.span>{Math.round(value)}</div>
        {title && <div className="text-xs text-gray-500">{title}</div>}
      </div>
    </div>
  )
}
