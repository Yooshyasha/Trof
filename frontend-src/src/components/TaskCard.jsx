import { useRef, useEffect, useCallback } from 'react'

const CONTROL_META = {
  CREATE: { label: '+ create', cls: 'create' },
  EDIT:   { label: '± edit',   cls: 'edit'   },
  DELETE: { label: '× delete', cls: 'delete'  },
}

function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export function TaskCard({ task, onUpdate, onDelete, disabled }) {
  const descRef   = useRef(null)
  const commentRef = useRef(null)
  const tagInputRef = useRef(null)

  const control = task.control ?? 'CREATE'
  const meta    = CONTROL_META[control] ?? CONTROL_META.CREATE

  // Auto-resize textareas on mount and value change
  useEffect(() => { autoResize(descRef.current) },    [task.description])
  useEffect(() => { autoResize(commentRef.current) }, [task.comments])

  const handleNameChange = useCallback(
    e => onUpdate(task._id, { name: e.target.value }),
    [task._id, onUpdate]
  )

  const handleDescChange = useCallback(
    e => {
      autoResize(e.target)
      onUpdate(task._id, { description: e.target.value })
    },
    [task._id, onUpdate]
  )

  const handleCommentsChange = useCallback(
    e => {
      autoResize(e.target)
      const lines = e.target.value.split('\n').map(s => s.trimStart()).filter(Boolean)
      onUpdate(task._id, { comments: lines })
    },
    [task._id, onUpdate]
  )

  const addTag = useCallback(() => {
    const val = tagInputRef.current?.value.trim()
    if (!val) return
    const tags = [...(task.tags || []), val]
    onUpdate(task._id, { tags })
    tagInputRef.current.value = ''
  }, [task._id, task.tags, onUpdate])

  const removeTag = useCallback(
    idx => {
      const tags = (task.tags || []).filter((_, i) => i !== idx)
      onUpdate(task._id, { tags })
    },
    [task._id, task.tags, onUpdate]
  )

  const commentsText = Array.isArray(task.comments)
    ? task.comments.join('\n')
    : (task.comments ?? '')

  return (
    <div className={`task-card task-card--${meta.cls}`}>
      <div className="task-card__header">
        <span className={`control-badge control-badge--${meta.cls}`}>
          {meta.label}
        </span>
        <input
          className="task-card__name-input"
          value={task.name}
          onChange={handleNameChange}
          disabled={disabled}
          placeholder="task name"
        />
        {!disabled && (
          <button
            className="task-card__delete-btn"
            onClick={() => onDelete(task._id)}
            title="delete task"
          >
            ×
          </button>
        )}
      </div>

      <div className="task-card__field-label">description</div>
      <textarea
        ref={descRef}
        className="task-card__textarea"
        value={task.description ?? ''}
        onChange={handleDescChange}
        disabled={disabled}
        placeholder="no description"
        rows={2}
      />

      {(commentsText || !disabled) && (
        <>
          <div className="task-card__field-label">comments</div>
          <textarea
            ref={commentRef}
            className="task-card__textarea"
            value={commentsText}
            onChange={handleCommentsChange}
            disabled={disabled}
            placeholder="one per line..."
            rows={2}
          />
        </>
      )}

      {((task.tags?.length > 0) || !disabled) && (
        <>
          <div className="task-card__field-label">tags</div>
          <div className="task-card__tags">
            {(task.tags || []).map((tag, i) => (
              <span key={i} className="tag-chip">
                {tag}
                {!disabled && (
                  <button className="tag-chip__remove" onClick={() => removeTag(i)}>
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {!disabled && (
            <div className="tag-input-row">
              <input
                ref={tagInputRef}
                placeholder="add tag..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              />
              <button className="btn btn--sm btn--ghost" onClick={addTag}>+</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function ProjectTaskCard({ task }) {
  return (
    <div className="project-task-card">
      <div className="project-task-card__name">{task.name}</div>
      {task.description && (
        <div className="project-task-card__desc">{task.description}</div>
      )}
      {task.status && (
        <span className="project-task-card__status">{task.status.toLowerCase()}</span>
      )}
    </div>
  )
}
