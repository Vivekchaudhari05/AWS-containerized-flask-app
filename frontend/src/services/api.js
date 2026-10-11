
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error('Backend health check failed')
  }

  return response.json()
}

export async function getApplicationInfo() {
  const response = await fetch(`${API_BASE_URL}/info`)

  if (!response.ok) {
    throw new Error('Unable to fetch application information')
  }

  return response.json()
}