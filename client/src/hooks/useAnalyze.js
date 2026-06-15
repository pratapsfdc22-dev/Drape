import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../lib/supabase.js'
import { useDrape } from '../context/DrapeContext.jsx'

export const TIMEOUT_ERROR_MSG = 'This is taking longer than expected. Please try again.'

export function useAnalyze() {
  const navigate = useNavigate()
  const {
    uploadedFile,
    gender,
    location,
    selectedOccasion,
    customPrompt,
    isLoading,
    error,
    setAnalysisResult,
    setIsLoading,
    setError,
  } = useDrape()

  async function submitForAnalysis() {
    if (!uploadedFile) { setError('Please upload a photo first.'); return }
    if (!selectedOccasion) { setError('Please select an occasion.'); return }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('photo', uploadedFile)
      formData.append('occasion', selectedOccasion)
      formData.append('customPrompt', customPrompt)
      if (gender) formData.append('gender', gender)
      if (location?.country) formData.append('country', location.country)
      if (location?.postalCode) formData.append('postalCode', location.postalCode)

      const headers = {}
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        formData,
        { headers, timeout: 45000 },
      )

      setAnalysisResult(data)
      navigate('/results')
    } catch (err) {
      console.error('Analysis error:', err)
      if (err.code === 'ECONNABORTED') {
        setError(TIMEOUT_ERROR_MSG)
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Network connection lost. Please check your internet and try again.')
      } else {
        setError(err.response?.data?.message ?? 'Analysis failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { submitForAnalysis, isLoading, error }
}
