import React from 'react'
import { useMotionValue, useTransform, animate } from 'framer-motion'

export default function AnimatedCounter({ value = 0, duration = 0.8, className = '' }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    const controls = animate(mv, value, { duration, onUpdate: v => setDisplay(Math.round(v)) })
    return () => controls.stop()
  }, [value])

  return <span className={className}>{display}</span>
}
