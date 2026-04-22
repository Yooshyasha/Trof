import { useEffect, useRef, useState } from 'react'

function Toast({ toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div className={`toast toast--${toast.type} ${visible ? 'toast--visible' : ''}`}>
      {toast.message}
    </div>
  )
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  )
}
