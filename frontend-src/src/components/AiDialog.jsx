import { useRef, useEffect, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AiDialog({ dialog, onSend, canSend }) {
  const [answerText, setAnswerText] = useState('')
  const historyRef  = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = historyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [dialog])

  useEffect(() => {
    if (canSend) textareaRef.current?.focus()
  }, [canSend])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [answerText])

  const handleSend = useCallback(() => {
    const trimmed = answerText.trim()
    if (!trimmed) return
    onSend(trimmed)
    setAnswerText('')
  }, [answerText, onSend])

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="ai-dialog">
      <div className="ai-dialog__history" ref={historyRef}>
        {dialog.map((msg, i) => (
          <div key={i} className={`ai-dialog__bubble ai-dialog__bubble--${msg.role}`}>
            <span className="ai-dialog__bubble-label">
              {msg.role === 'ai' ? 'AI' : 'you'}
            </span>
            <div className="ai-dialog__bubble-text">
              {msg.role === 'ai' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>

      {canSend && (
        <div className="ai-dialog__input-area">
          <textarea
            ref={textareaRef}
            className="ai-dialog__textarea"
            placeholder="your answer..."
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="ai-dialog__send-row">
            <span className="ai-dialog__hint">ctrl+enter to send</span>
            <button
              className="btn btn--primary btn--sm"
              onClick={handleSend}
              disabled={!answerText.trim()}
            >
              send →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
