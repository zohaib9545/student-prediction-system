import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { fetchClassSubjectResults } from '../services/teacher'

export default function TeacherDashboard(){
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e && e.preventDefault()
    setError(null)
    if (!className || !subject) return setError('Please select class and subject')
    setLoading(true)
    try {
      const res = await fetchClassSubjectResults(className, subject)
      setResults(res.results || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Teacher Dashboard</h1>

          <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow mb-6 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">Class</label>
              <input value={className} onChange={e=>setClassName(e.target.value)} placeholder="e.g. 10th" className="w-full p-2 border rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Subject</label>
              <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Math" className="w-full p-2 border rounded" />
            </div>
            <div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
            </div>
          </form>

          {error && <div className="mb-4 text-red-600">{error}</div>}

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-3">Results</h2>
            {results.length === 0 ? (
              <div className="text-gray-500">No results. Use the filters above.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">Student</th>
                      <th className="p-2">Roll No</th>
                      <th className="p-2">Subject</th>
                      <th className="p-2">Actual</th>
                      <th className="p-2">Predicted</th>
                      <th className="p-2">Difference</th>
                      <th className="p-2">Suggestions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r,i)=> (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-2">{r.studentName}</td>
                        <td className="p-2">{r.rollNumber}</td>
                        <td className="p-2">{r.subject}</td>
                        <td className="p-2">{typeof r.actualMarks === 'number' ? r.actualMarks : '—'}</td>
                        <td className="p-2">{typeof r.predictedMarks === 'number' ? r.predictedMarks : '—'}</td>
                        <td className="p-2">{r.predictedGrade ? `${r.predictedGrade} ${r.predictedGradePoint !== undefined ? `(${Number(r.predictedGradePoint).toFixed(2)})` : ''}` : '—'}</td>
                        <td className="p-2">{r.difference === null ? '—' : r.difference}</td>
                        <td className="p-2 text-sm text-gray-700">{(r.suggestions||[]).slice(0,3).map((s,idx)=>(<div key={idx}>- {s}</div>))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
