import { useState, useRef } from 'react'
import { TaskCard, ProjectTaskCard } from './TaskCard'

export function TasksPanel({
  genStatus,
  generatedTasks,
  deletedTaskIds,
  onDeleteTask,
  onRestoreTask,
  onUpdateTask,
  confirmed,
  onConfirm,
  genProjectName,
  projectTasks,
}) {
  const [lastDeleted, setLastDeleted] = useState(null)
  const undoTimerRef = useRef(null)

  function handleDelete(id) {
    onDeleteTask(id)
    setLastDeleted(id)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setLastDeleted(null), 8000)
  }

  function handleUndo() {
    if (lastDeleted == null) return
    onRestoreTask(lastDeleted)
    setLastDeleted(null)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
  }

  const visibleGenerated = generatedTasks.filter(t => !deletedTaskIds.has(t._id))
  const isGenerating     = genStatus === 'generating' || genStatus === 'polling'
  const hasGenerated     = genStatus === 'complete' && generatedTasks.length > 0

  // Determine what to show
  const showGenerated  = hasGenerated
  const showProjectTasks = !showGenerated && projectTasks?.length > 0
  const showEmpty      = !showGenerated && !showProjectTasks && !isGenerating

  const headerTitle = showGenerated
    ? genProjectName || 'generated tasks'
    : showProjectTasks
    ? 'current tasks'
    : 'tasks'

  const headerCount = showGenerated
    ? visibleGenerated.length
    : showProjectTasks
    ? projectTasks.length
    : 0

  return (
    <div className="tasks-panel">
      <div className="tasks-panel__header">
        <div className="tasks-panel__title">
          {headerTitle}
          {headerCount > 0 && (
            <span className="tasks-panel__count">{headerCount}</span>
          )}
        </div>

        {hasGenerated && !confirmed && (
          <button className="btn btn--sm btn--primary" onClick={onConfirm}>
            confirm all
          </button>
        )}
      </div>

      {/* Undo bar */}
      {lastDeleted != null && (
        <div className="undo-bar">
          task removed —{' '}
          <button className="undo-bar__btn" onClick={handleUndo}>
            undo
          </button>
        </div>
      )}

      {/* Confirm result */}
      {confirmed && (
        <div className="confirm-result">
          ✓ confirmed — tasks applied to {genProjectName || 'project'}
        </div>
      )}

      {/* Body */}
      {isGenerating && (
        <div className="tasks-panel__body">
          <div className="tasks-panel__empty">
            <span className="spinner" style={{ width: 20, height: 20 }} />
            <span className="tasks-panel__empty-text">
              generating tasks...
            </span>
          </div>
        </div>
      )}

      {showGenerated && (
        <div className="tasks-panel__body">
          {visibleGenerated.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={handleDelete}
              disabled={confirmed}
            />
          ))}
        </div>
      )}

      {showProjectTasks && (
        <div className="tasks-panel__body">
          {projectTasks.map(task => (
            <ProjectTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {showEmpty && !isGenerating && (
        <div className="tasks-panel__body">
          <div className="tasks-panel__empty">
            <span className="tasks-panel__empty-icon">◈</span>
            <span className="tasks-panel__empty-text">
              describe your project or changes
              <br />
              and press generate
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
