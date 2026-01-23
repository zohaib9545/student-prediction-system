import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../services/api'

function FieldList({ label, values, setValues }) {
  const updateScore = (idx, v) => setValues(values.map((x,i)=> i===idx ? { ...x, score: v } : x))
  const updateTotal = (idx, v) => setValues(values.map((x,i)=> i===idx ? { ...x, total: v } : x))
  const push = () => setValues([...values, { score: '', total: '' }])
  const remove = (idx) => setValues(values.filter((_,i)=>i!==idx))
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{label}</div>
        <button type="button" onClick={push} className="text-sm text-indigo-600">+ Add</button>
      </div>
      {values.map((v,i)=> (
        <div key={i} className="flex gap-2 items-center">
          <input value={v.score} onChange={e=>updateScore(i,e.target.value)} className="w-1/2 p-2 border rounded" placeholder={`${label} #${i+1} score`} />
          <input value={v.total} onChange={e=>updateTotal(i,e.target.value)} className="w-1/2 p-2 border rounded" placeholder={`Total marks`} />
          <button type="button" onClick={()=>remove(i)} className="px-3 bg-red-50 text-red-600 rounded">x</button>
        </div>
      ))}
    </div>
  )
}

export default function InputMarks(){
  const [assignments, setAssignments] = useState([{ score: '', total: '' }])
  const [quizzes, setQuizzes] = useState([{ score: '', total: '' }])
  const [presentations, setPresentations] = useState([])
  const [project, setProject] = useState({ score: '', total: '' })
  const [midterm, setMidterm] = useState({ score: '', total: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [subject, setSubject] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      // Convert score/total pairs into percentage marks (0-100)
      const toPercent = (arr) => arr.map(item => {
        const s = Number(item.score)
        const t = Number(item.total)
        if (!t || isNaN(s) || isNaN(t)) return null
        return Math.min(100, (s / t) * 100)
      }).filter(n=>n!==null)

      const projectPercent = (project && Number(project.total)) ? Math.min(100, (Number(project.score) / Number(project.total)) * 100) : null
      const midtermPercent = (midterm && Number(midterm.total)) ? Math.min(100, (Number(midterm.score) / Number(midterm.total)) * 100) : (midterm && midterm.score ? Number(midterm.score) : null)

      const payload = {
        assignmentMarks: toPercent(assignments),
        quizMarks: toPercent(quizzes),
        midtermMarks: midtermPercent !== null ? midtermPercent : 0,
        projectPercent: projectPercent !== null ? projectPercent : undefined,
        subject,
      }
      const res = await api.post('/performance/submit', payload)
      setResult(res.data.record)
    }catch(err){
      alert(err.response?.data?.message || 'Submission failed')
    }finally{setLoading(false)}
  }

  const sum = (arr, key='score') => arr.map(v=>Number(v[key])).filter(n=>!isNaN(n)).reduce((s,n)=>s+n,0)
  const sumTotal = (arr) => arr.map(v=>Number(v.total)).filter(n=>!isNaN(n)).reduce((s,n)=>s+n,0)
  const avgPercent = (arr) => {
    const totalObt = sum(arr,'score')
    const totalMax = sumTotal(arr)
    if (!totalMax) return 0
    return ((totalObt/totalMax)*100).toFixed(2)
  }

  const assignmentsTotal = useMemo(()=>sum(assignments,'score'),[assignments])
  const assignmentsMax = useMemo(()=>sumTotal(assignments),[assignments])
  const quizzesTotal = useMemo(()=>sum(quizzes,'score'),[quizzes])
  const quizzesMax = useMemo(()=>sumTotal(quizzes),[quizzes])
  const presentationsTotal = useMemo(()=>sum(presentations,'score'),[presentations])
  const presentationsMax = useMemo(()=>sumTotal(presentations),[presentations])

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Input Marks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
              <div className="grid gap-3">
                <div className="flex gap-2">
                  <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject (e.g. Math)" className="p-2 border rounded flex-1" />
                </div>
                <div>
                  <FieldList label="Assignments" values={assignments} setValues={setAssignments} />
                  <div className="text-xs text-gray-600 mt-1">Total Obtained: {assignmentsTotal} / {assignmentsMax} — Avg %: {avgPercent(assignments)}%</div>
                </div>

                <div>
                  <FieldList label="Quizzes" values={quizzes} setValues={setQuizzes} />
                  <div className="text-xs text-gray-600 mt-1">Total Obtained: {quizzesTotal} / {quizzesMax} — Avg %: {avgPercent(quizzes)}%</div>
                </div>

                <div>
                  <FieldList label="Presentations" values={presentations} setValues={setPresentations} />
                  <div className="text-xs text-gray-600 mt-1">Total Obtained: {presentationsTotal} / {presentationsMax} — Avg %: {avgPercent(presentations)}%</div>
                </div>
              </div>

              <div>
                <label className="block mb-1">Project</label>
                <div className="flex gap-2">
                  <input value={project.score} onChange={e=>setProject({...project, score: e.target.value})} className="w-1/2 p-2 border rounded" placeholder="Score" />
                  <input value={project.total} onChange={e=>setProject({...project, total: e.target.value})} className="w-1/2 p-2 border rounded" placeholder="Total marks" />
                </div>
                <div className="text-xs text-gray-600 mt-1">Obtained: {project.score || '—'} / {project.total || '—'} — {project.total ? `${((Number(project.score)||0)/(Number(project.total)||1)*100).toFixed(2)}%` : '—'}</div>
              </div>

              <div>
                <label className="block mb-1">Midterm</label>
                <div className="flex gap-2">
                  <input value={midterm.score} onChange={e=>setMidterm({...midterm, score: e.target.value})} className="w-1/2 p-2 border rounded" placeholder="Score" />
                  <input value={midterm.total} onChange={e=>setMidterm({...midterm, total: e.target.value})} className="w-1/2 p-2 border rounded" placeholder="Total marks" />
                </div>
                <div className="text-xs text-gray-600 mt-1">Obtained: {midterm.score || '—'} / {midterm.total || '—'} — {midterm.total ? `${((Number(midterm.score)||0)/(Number(midterm.total)||1)*100).toFixed(2)}%` : '—'}</div>
              </div>

              <button className="w-full bg-indigo-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit & Predict'}</button>
            </form>

            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-3">Latest Prediction</h3>
              {result ? (
                <div>
                  <div><strong>Performance Score:</strong> {result.performanceScore}</div>
                  <div><strong>Predicted Final:</strong> {result.predictedMarks}</div>
                  <div><strong>Level:</strong> {result.level}</div>
                  <div className="mt-2"><strong>Suggestions:</strong>
                    <ul className="ml-5 list-disc">{result.suggestions.map((s,i)=>(<li key={i}>{s}</li>))}</ul>
                  </div>
                </div>
              ) : <div className="text-gray-500">No prediction yet.</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
