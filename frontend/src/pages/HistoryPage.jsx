import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function HistoryPage(){
  const [history, setHistory] = useState([])
  useEffect(()=>{ fetchHistory() }, [])
  const fetchHistory = async ()=>{ try{ const res = await api.get('/performance/history'); setHistory(res.data.records||[]) }catch(e){ } }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-4">History</h1>
          <div className="grid gap-4">
            {history.length===0 ? <div className="text-gray-500">No history yet.</div> : history.map(r=> (
              <div key={r._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{new Date(r.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Level: {r.level} — Score {r.performanceScore}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-lg font-bold">{r.predictedMarks}</div>
                      <div className="text-sm">{r.predictedGrade ? `${r.predictedGrade} ${r.predictedGradePoint !== undefined ? `(${Number(r.predictedGradePoint).toFixed(2)})` : ''}` : ''}</div>
                    <div className="text-xs text-gray-500">Predicted Final</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
