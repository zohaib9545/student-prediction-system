import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import api from '../services/api'
import { PerformanceLine } from '../components/AnimatedChart'
import AnimatedCounter from '../components/AnimatedCounter'

export default function Overview(){
  const [history, setHistory] = useState([])

  useEffect(()=>{ fetchHistory() }, [])
  const fetchHistory = async ()=>{
    try{ const res = await api.get('/performance/history'); setHistory(res.data.records||[]) }catch(e){ }
  }

  const latest = history[0]
  const chartData = history.map(h=>({ date: new Date(h.createdAt).toLocaleDateString(), assignmentAvg: h.assignmentAvg, quizAvg: h.quizAvg, predictedMarks: h.predictedMarks }))
  const submissions = history.length
  const avgPredicted = history.length ? Math.round(history.reduce((s,h)=>s+h.predictedMarks,0)/history.length) : 0
  const latestMidterm = latest && (typeof latest.midtermMarks !== 'undefined') ? latest.midtermMarks : null

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-4">Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
            <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-400 text-white flex flex-col justify-center items-start">
              <div className="text-sm opacity-90">Latest Predicted</div>
              <div className="text-3xl font-bold">{latest ? latest.predictedMarks : '--'}</div>
              <div className="text-sm mt-1">{latest ? `${latest.predictedGrade || ''} ${latest.predictedGradePoint !== undefined ? `(${Number(latest.predictedGradePoint).toFixed(2)})` : ''}` : ''}</div>
              <div className="text-xs opacity-80 mt-1">Predicted final marks</div>
            </div>

            <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-rose-500 to-pink-400 text-white flex flex-col justify-center items-start">
              <div className="text-sm opacity-90">Submissions</div>
              <div className="text-3xl font-bold"><AnimatedCounter value={submissions} /></div>
              <div className="text-xs opacity-80 mt-1">Total submissions</div>
            </div>

            <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-400 text-white flex flex-col justify-center items-start">
              <div className="text-sm opacity-90">Avg Predicted</div>
              <div className="text-3xl font-bold"><AnimatedCounter value={avgPredicted} /></div>
              <div className="text-xs opacity-80 mt-1">Average predicted final</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Trends</h3>
            {chartData.length === 0 ? <div className="text-gray-500">No data yet</div> : <PerformanceLine data={chartData} />}

            <div className="mt-6">
              <h4 className="font-medium mb-2">Midterm vs Predicted</h4>
              {latest ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Midterm (%)</div>
                    <div className="text-2xl font-bold">{latestMidterm !== null ? latestMidterm : '--'}</div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-2">
                      <div className="h-2 bg-indigo-600 rounded" style={{ width: `${latestMidterm !== null ? Math.min(100, latestMidterm) : 0}%` }} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Predicted Final</div>
                    <div className="text-2xl font-bold">{latest ? latest.predictedMarks : '--'}</div>
                    <div className="text-sm text-gray-500">{latest ? `${latest.predictedGrade || ''} ${latest.predictedGradePoint !== undefined ? `(${Number(latest.predictedGradePoint).toFixed(2)})` : ''}` : ''}</div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-2">
                      <div className="h-2 bg-amber-500 rounded" style={{ width: `${latest ? Math.min(100, latest.predictedMarks) : 0}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No latest record to compare.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
