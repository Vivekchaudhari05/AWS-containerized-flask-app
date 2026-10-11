
import { useCallback, useEffect, useState } from 'react'
import { checkBackendHealth } from '../services/api'

export default function useHealth() {
  const [status, setStatus] = useState('Checking...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await checkBackendHealth()
      setStatus(data.status || 'Healthy')
    } catch {
      setStatus('Unavailable')
      setError('The backend is not connected yet.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return { status, loading, error, checkHealth }
}