import api from './api'

export async function fetchClassSubjectResults(className, subject) {
  const res = await api.get(`/performance/teacher/results?class=${encodeURIComponent(className)}&subject=${encodeURIComponent(subject)}`)
  return res.data
}
