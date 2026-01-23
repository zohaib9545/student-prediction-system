import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register } from '../services/auth'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [password, setPassword] = useState('')
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ name, email, rollNumber, password, class: className })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url(/src/images/ucp.jpg)'}}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white bg-opacity-90 p-10 rounded-lg shadow-xl w-full max-w-md mx-6">
        <div className="text-center mb-6">
          <img src="/src/images/ucplogo.png" alt="UCP Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Create your account</h2>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full p-3 border rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
          <input className="w-full p-3 border rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input className="w-full p-3 border rounded" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="Roll number" required />
          <input className="w-full p-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" type="password" minLength={6} required />

          <div className="flex gap-2">
            <input className="flex-1 p-3 border rounded" value={className} onChange={e=>setClassName(e.target.value)} placeholder="Class (e.g. 10th)" />
          </div>

          <button className="w-full bg-green-600 text-white p-3 rounded text-lg" disabled={loading}>{loading ? 'Registering...' : 'Create account'}</button>
        </form>
        <div className="mt-6 text-center text-sm">Already registered? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link></div>
      </motion.div>
    </div>
  )
}
