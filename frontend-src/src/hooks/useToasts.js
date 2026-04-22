import { useState, useCallback } from 'react'

let nextId = 0

export function useToasts() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = '') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
