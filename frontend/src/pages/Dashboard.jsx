import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import { PerformanceLine, AssignmentBar } from '../components/AnimatedChart'

export default function Dashboard() {
  const [assignmentMarks, setAssignmentMarks] = useState('')
  const [quizMarks, setQuizMarks] = useState('')
  const [midtermMarks, setMidtermMarks] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const parseMarks = (str) => str.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        assignmentMarks: parseMarks(assignmentMarks),
        quizMarks: parseMarks(quizMarks),
        midtermMarks: Number(midtermMarks),
        subject,
      }
      const res = await api.post('/performance/submit', payload)
      setRecord(res.data.record)
      fetchHistory()
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await api.get('/performance/history')
      setHistory(res.data.records || [])
    } catch (err) {
      console.error(err)
    }
  }

  const chartData = history.map(h => ({ date: new Date(h.createdAt).toLocaleDateString(), assignmentAvg: h.assignmentAvg, quizAvg: h.quizAvg, predictedMarks: h.predictedMarks }))

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">University Dashboard</motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Performance Score" value={record ? record.performanceScore : '--'} subtitle="Weighted score" variant="indigo" />
            <StatCard title="Predicted Final" value={record ? record.predictedMarks : '--'} subtitle="Out of 100" variant="amber" />
            <StatCard title="Level" value={record ? record.level : 'N/A'} subtitle={record ? record.suggestions[0] : ''} variant="teal" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
              {chartData.length === 0 ? <div className="text-gray-500">No history yet — submit data to see trends.</div> : <PerformanceLine data={chartData} />}
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Predict</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={assignmentMarks} onChange={e => setAssignmentMarks(e.target.value)} className="w-full p-2 border rounded" placeholder="Assignments e.g. 80,70,90" />
                <input value={quizMarks} onChange={e => setQuizMarks(e.target.value)} className="w-full p-2 border rounded" placeholder="Quizzes e.g. 70,60" />
                <input value={midtermMarks} onChange={e => setMidtermMarks(e.target.value)} type="number" min="0" max="100" className="w-full p-2 border rounded" placeholder="Midterm marks" />
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border rounded" placeholder="Subject (e.g. Math)" />
                <button className="w-full p-2 rounded bg-indigo-600 text-white" disabled={loading}>{loading ? 'Calculating...' : 'Predict'}</button>
              </form>
              {record && (
                <div className="mt-4 text-sm">
                  <div><strong>Suggestions:</strong></div>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">{record.suggestions.map((s,i)=>(<li key={i}>{s}</li>))}</ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Predicted Final Overview</h3>
            <AssignmentBar data={chartData} />
          </div>
        </main>
      </div>
    </div>
  )
}
