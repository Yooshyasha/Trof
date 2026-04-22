import { useRef, useEffect } from 'react'

export function InputPanel({
  collapsed,
  onToggleCollapse,
  project,
  inputText,
  onInputChange,
  onGenerate,
  genStatus,
  elapsed,
  progress,
}) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.55) + 'px'
  }, [inputText])

  const isNew        = project === 'new' || project == null
  const projectName  = isNew ? null : project?.name
  const isGenerating = genStatus === 'generating' || genStatus === 'polling'
  const isComplete   = genStatus === 'complete'

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onGenerate()
    }
  }

  if (collapsed) {
    return (
      <div className="input-panel input-panel--collapsed">
        <div className="input-panel__sidebar">
          <button
            className="input-panel__sidebar-expand"
            onClick={onToggleCollapse}
            title="expand input panel"
          >
            ›
          </button>
          <span className="input-panel__sidebar-label">
            {projectName ?? 'new project'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="input-panel">
      {/* Collapse handle */}
      <button
        className="input-panel__collapse-btn"
        onClick={onToggleCollapse}
        title="collapse panel"
      >
        ‹
      </button>

      <div className="input-panel__content">
        {/* Top bar: project context */}
        <div className="input-panel__top">
          {isNew ? (
            <span className="input-panel__new-badge">+ new project</span>
          ) : (
            <div className="input-panel__project-badge">
              <span className="input-panel__project-dot" />
              <span>{projectName}</span>
            </div>
          )}
        </div>

        {/* Textarea */}
        <div className="input-panel__body">
          <div className="input-panel__label">
            {isNew ? 'project description' : 'describe changes'}
          </div>
          <textarea
            ref={textareaRef}
            className="input-panel__textarea"
            placeholder={
              isNew
                ? 'describe the project you want to build...'
                : 'describe what you want to add, change or remove...'
            }
            value={inputText}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              marginTop: -6,
            }}
          >
            ctrl+enter to generate
          </span>
        </div>

        {/* Generation status */}
        {(isGenerating || isComplete) && (
          <div className="input-panel__status">
            {isGenerating && (
              <>
                <div className="status-row">
                  <span className="spinner" />
                  <span className="status-text">
                    {genStatus === 'generating' ? 'starting...' : 'generating tasks...'}
                  </span>
                  {elapsed > 0 && (
                    <span className="status-elapsed">{elapsed}s</span>
                  )}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}
            {isComplete && (
              <div className="status-row">
                <span style={{ color: 'var(--ok)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  ✓ generation complete
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="input-panel__footer">
          <button
            className="btn btn--primary"
            onClick={onGenerate}
            disabled={isGenerating || !inputText.trim()}
          >
            {isGenerating
              ? '⟳ generating...'
              : isComplete
              ? 'regenerate'
              : 'generate'}
          </button>
        </div>
      </div>
    </div>
  )
}
