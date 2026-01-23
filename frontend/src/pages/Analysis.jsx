import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { PerformanceLine, AssignmentBar } from '../components/AnimatedChart'
import MidtermComparison from '../components/MidtermComparison'

export default function Analysis(){
  const [series, setSeries] = useState([])
  useEffect(()=>{ fetch() }, [])
  const fetch = async ()=>{
    try{ const res = await api.get('/performance/analytics'); setSeries(res.data.series||[]) }catch(e){ }
  }

  const latest = series.length ? series[series.length - 1] : null

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-4">Analysis</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Assignment vs Quiz</h3>
              <PerformanceLine data={series.map(s=>({ date: new Date(s.date).toLocaleDateString(), assignmentAvg: s.assignmentAvg, quizAvg: s.quizAvg }))} />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Predicted Final</h3>
              <AssignmentBar data={series.map(s=>({ date: new Date(s.date).toLocaleDateString(), predictedMarks: s.predictedMarks }))} />
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Midterm vs Predicted (Latest)</h3>
            {latest ? (
              <MidtermComparison midterm={latest.midtermMarks} predicted={latest.predictedMarks} />
            ) : (
              <div className="text-gray-500">No data yet to compare.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
