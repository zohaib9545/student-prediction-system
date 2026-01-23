import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/overview')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: 'url(/src/images/ucp.jpg)'}}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white bg-opacity-90 p-10 rounded-lg shadow-xl w-full max-w-md mx-6">
        <div className="text-center mb-6">
          <img src="/src/images/ucplogo.png" alt="UCP Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Sign in to continue</h2>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Email</label>
          <input className="w-full p-3 border rounded mb-4" value={email} onChange={e => setEmail(e.target.value)} type="email" required />

          <label className="block mb-2 text-sm">Password</label>
          <input className="w-full p-3 border rounded mb-4" value={password} onChange={e => setPassword(e.target.value)} type="password" required />

          <button className="w-full bg-indigo-600 text-white p-3 rounded text-lg" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-6 text-center text-sm">Don’t have an account? <Link to="/register" className="text-indigo-600 font-medium">Create account</Link></div>
      </motion.div>
    </div>
  )
}
