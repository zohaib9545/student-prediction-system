import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) return <Navigate to="/login" replace />

    // If the route requires specific roles, enforce them
    if (allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // If a teacher tries to access a student-only route, send to teacher dashboard
        if (user.role === 'teacher') return <Navigate to="/teacher" replace />
        return <Navigate to="/overview" replace />
      }
    } else {
      // No specific role required: if the logged-in user is a teacher, redirect them to teacher page
      if (user.role === 'teacher') return <Navigate to="/teacher" replace />
    }
  } catch (e) {
    return <Navigate to="/login" replace />
  }
  return children
}
