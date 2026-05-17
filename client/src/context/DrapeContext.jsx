import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const DrapeContext = createContext(null)

export function DrapeProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [gender, setGender] = useState(null)
  const [selectedOccasion, setSelectedOccasion] = useState(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  function resetAll() {
    if (previewURL) URL.revokeObjectURL(previewURL)
    setUploadedFile(null)
    setPreviewURL(null)
    setGender(null)
    setSelectedOccasion(null)
    setCustomPrompt('')
    setAnalysisResult(null)
    setIsLoading(false)
    setError(null)
  }

  return (
    <DrapeContext.Provider
      value={{
        uploadedFile, setUploadedFile,
        previewURL, setPreviewURL,
        gender, setGender,
        selectedOccasion, setSelectedOccasion,
        customPrompt, setCustomPrompt,
        analysisResult, setAnalysisResult,
        isLoading, setIsLoading,
        error, setError,
        user,
        resetAll,
      }}
    >
      {children}
    </DrapeContext.Provider>
  )
}

export function useDrape() {
  const ctx = useContext(DrapeContext)
  if (!ctx) throw new Error('useDrape must be used inside DrapeProvider')
  return ctx
}
