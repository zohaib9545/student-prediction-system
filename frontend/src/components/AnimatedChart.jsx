import React from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, BarChart, Bar } from 'recharts'

export function PerformanceLine({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="assignmentAvg" stroke="#8884d8" fillOpacity={1} fill="url(#grad1)" />
          <Line type="monotone" dataKey="quizAvg" stroke="#82ca9d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function AssignmentBar({ data }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-48">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="predictedMarks" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default PerformanceLine
