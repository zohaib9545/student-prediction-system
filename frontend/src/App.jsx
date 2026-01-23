import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Overview from './pages/Overview'
import InputMarks from './pages/InputMarks'
import Analysis from './pages/Analysis'
import HistoryPage from './pages/HistoryPage'
import TeacherDashboard from './pages/TeacherDashboard'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/overview" element={<PrivateRoute><Overview /></PrivateRoute>} />
      <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
      <Route path="/input" element={<PrivateRoute><InputMarks /></PrivateRoute>} />
      <Route path="/analysis" element={<PrivateRoute><Analysis /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
      <Route path="/teacher" element={<PrivateRoute allowedRoles={["teacher"]}><TeacherDashboard /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/overview" replace />} />
    </Routes>
  )
}
