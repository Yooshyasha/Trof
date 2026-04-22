import { useState, useEffect, useRef, useCallback } from 'react'

import { fetchProjects, startGeneration, pollGeneration, confirmTasks } from './api'
import { saveState, loadState, clearState, saveDraft, loadDraft } from './storage'
import { useToasts } from './hooks/useToasts'

import { Header }        from './components/Header'
import { ProjectsView }  from './components/ProjectsView'
import { WorkspaceView } from './components/WorkspaceView'
import { ToastContainer } from './components/ToastContainer'

import './styles/global.css'

export function App() {
  const { toasts, addToast } = useToasts()

  /* ── Projects ── */
  const [projects, setProjects]             = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)

  /* ── View ── */
  const [view, setView]                     = useState('projects') // 'projects' | 'workspace'
  const [selectedProject, setSelectedProject] = useState(null)    // project obj | 'new' | null
  const [inputCollapsed, setInputCollapsed] = useState(false)

  /* ── Input ── */
  const [inputText, setInputText] = useState('')

  /* ── Generation ── */
  const [genStatus, setGenStatus]         = useState('idle')   // idle | generating | polling | complete | failed
  const [taskId, setTaskId]               = useState(null)
  const [generatedTasks, setGeneratedTasks] = useState([])     // TaskDTO[] with _id injected
  const [taskEdits, setTaskEdits]         = useState({})       // { [_id]: partial overrides }
  const [deletedTaskIds, setDeletedTaskIds] = useState(new Set())
  const [genProjectName, setGenProjectName] = useState('')
  const [confirmed, setConfirmed]         = useState(false)
  const [elapsed, setElapsed]             = useState(0)
  const [progress, setProgress]           = useState(0)

  const pollRef    = useRef(null)
  const elapsedRef = useRef(null)

  /* ═══════════════ Load projects ═══════════════ */
  useEffect(() => {
    setProjectsLoading(true)
    fetchProjects()
      .then(data => setProjects(data))
      .catch(err => addToast(`projects: ${err.message}`, 'error'))
      .finally(() => setProjectsLoading(false))
  }, [])

  /* ═══════════════ Restore state on mount ═══════════════ */
  useEffect(() => {
    const state = loadState()
    if (!state) {
      const draft = loadDraft()
      if (draft) setInputText(draft)
      return
    }

    setView(state.view || 'projects')
    setSelectedProject(state.selectedProject ?? null)
    setInputText(state.inputText || '')
    setInputCollapsed(state.inputCollapsed || false)
    setGenProjectName(state.genProjectName || '')
    setConfirmed(state.confirmed || false)

    if (state.generatedTasks?.length) {
      setGeneratedTasks(state.generatedTasks)
      setDeletedTaskIds(new Set(state.deletedTaskIds || []))
      setTaskEdits(state.taskEdits || {})
      setGenStatus('complete')
      if (state.view === 'workspace') addToast('session restored', 'ok')
    }

    if (state.genStatus === 'polling' && state.taskId) {
      setTaskId(state.taskId)
      setGenStatus('polling')
      startTimers()
      startPolling(state.taskId)
      addToast('resuming generation...', 'warn')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ═══════════════ Persist state ═══════════════ */
  useEffect(() => {
    if (view !== 'workspace') return
    saveState({
      view,
      selectedProject,
      inputText,
      inputCollapsed,
      genStatus,
      taskId,
      generatedTasks,
      taskEdits,
      deletedTaskIds: [...deletedTaskIds],
      genProjectName,
      confirmed,
    })
  }, [view, selectedProject, inputText, inputCollapsed, genStatus, taskId,
      generatedTasks, taskEdits, deletedTaskIds, genProjectName, confirmed])

  /* ═══════════════ Timer helpers ═══════════════ */
  function startTimers() {
    setElapsed(0)
    setProgress(5)
    if (elapsedRef.current) clearInterval(elapsedRef.current)
    const start = Date.now()
    elapsedRef.current = setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000)
      setElapsed(sec)
      setProgress(Math.min(5 + sec * 1.8, 90))
    }, 1000)
  }

  function stopTimers() {
    if (pollRef.current)    clearInterval(pollRef.current)
    if (elapsedRef.current) clearInterval(elapsedRef.current)
    pollRef.current    = null
    elapsedRef.current = null
  }

  /* ═══════════════ Polling ═══════════════ */
  function startPolling(id) {
    if (pollRef.current) clearInterval(pollRef.current)

    async function doPoll() {
      if (!navigator.onLine) return
      try {
        const data = await pollGeneration(id)
        if (data.status === 'ACTIVE') return

        stopTimers()

        if (data.status === 'FAILED') {
          setGenStatus('failed')
          addToast('generation failed on server', 'error')
          return
        }

        if (data.status === 'COMPLETE') {
          setProgress(100)
          const tasks = (data.generatedTasks?.tasks ?? []).map((t, i) => ({
            ...t,
            _id: i,
            // Compute control client-side as fallback (mirrors Kotlin logic)
            control: t.control ?? deriveControl(t),
          }))
          setGeneratedTasks(tasks)
          setTaskEdits({})
          setDeletedTaskIds(new Set())
          setGenProjectName(data.generatedTasks?.projectName ?? '')
          setConfirmed(false)
          setGenStatus('complete')
          addToast('tasks generated!', 'ok')
        }
      } catch (err) {
        stopTimers()
        setGenStatus('failed')
        addToast(`poll error: ${err.message}`, 'error')
      }
    }

    doPoll()
    pollRef.current = setInterval(doPoll, 2500)
  }

  function deriveControl(task) {
    if (task.vikunjaTaskId == null) return 'CREATE'
    if (!task.name)                 return 'DELETE'
    return 'EDIT'
  }

  /* ═══════════════ Generate ═══════════════ */
  async function handleGenerate() {
    const text = inputText.trim()
    if (!text) { addToast('enter a description first', 'warn'); return }

    const projectId =
      selectedProject && selectedProject !== 'new' ? selectedProject.id : null

    setGenStatus('generating')
    setProgress(0)

    try {
      const data = await startGeneration(text, projectId)
      setTaskId(data.taskId)
      setGenStatus('polling')
      startTimers()
      startPolling(data.taskId)
    } catch (err) {
      setGenStatus('failed')
      addToast(`failed to start: ${err.message}`, 'error')
    }
  }

  /* ═══════════════ Update / Delete tasks ═══════════════ */
  const handleTaskUpdate = useCallback((id, updates) => {
    setTaskEdits(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...updates } }))
    setGeneratedTasks(prev =>
      prev.map(t => (t._id === id ? { ...t, ...updates } : t))
    )
  }, [])

  const handleTaskDelete = useCallback(id => {
    setDeletedTaskIds(prev => new Set([...prev, id]))
  }, [])

  const handleTaskRestore = useCallback(id => {
    setDeletedTaskIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  /* ═══════════════ Confirm ═══════════════ */
  async function handleConfirm() {
    if (confirmed || !taskId) return

    const payload = buildConfirmPayload()

    try {
      const res = await confirmTasks(taskId, payload)
      if (res.success) {
        setConfirmed(true)
        addToast('confirmed!', 'ok')
        clearState()
      } else {
        addToast('server returned failure', 'error')
      }
    } catch (err) {
      addToast(`confirm failed: ${err.message}`, 'error')
    }
  }

  function buildConfirmPayload() {
    const payload = []

    generatedTasks.forEach(task => {
      if (deletedTaskIds.has(task._id)) return
      const orig    = { name: task.name, description: task.description,
                        comments: task.comments ?? [], tags: task.tags ?? [] }
      const current = { ...orig, ...(taskEdits[task._id] ?? {}) }
      const changed = JSON.stringify(current) !== JSON.stringify(orig)
      payload.push({
        status:  changed ? 'UPDATE' : 'APPROVE',
        taskDTO: current,
      })
    })

    deletedTaskIds.forEach(id => {
      const task = generatedTasks.find(t => t._id === id)
      if (!task) return
      payload.push({
        status:  'DELETE',
        taskDTO: { name: task.name, description: task.description,
                   comments: task.comments ?? [], tags: task.tags ?? [] },
      })
    })

    return payload
  }

  /* ═══════════════ Navigation ═══════════════ */
  function handleProjectSelect(project) {
    stopTimers()
    setSelectedProject(project)
    setView('workspace')
    setGenStatus('idle')
    setGeneratedTasks([])
    setTaskEdits({})
    setDeletedTaskIds(new Set())
    setConfirmed(false)
    setInputText(loadDraft() || '')
    setInputCollapsed(false)
  }

  function handleCreateNew() {
    stopTimers()
    setSelectedProject('new')
    setView('workspace')
    setGenStatus('idle')
    setGeneratedTasks([])
    setTaskEdits({})
    setDeletedTaskIds(new Set())
    setConfirmed(false)
    setInputText(loadDraft() || '')
    setInputCollapsed(false)
  }

  function handleBack() {
    stopTimers()
    setView('projects')
    setSelectedProject(null)
    setGenStatus('idle')
    setGeneratedTasks([])
    setTaskEdits({})
    setDeletedTaskIds(new Set())
  }

  function handleClearData() {
    if (!confirm('Clear all saved data and start over?')) return
    clearState()
    stopTimers()
    handleBack()
    setInputText('')
    addToast('data cleared', 'warn')
  }

  function handleInputChange(text) {
    setInputText(text)
    saveDraft(text)
  }

  /* ═══════════════ Derived ═══════════════ */
  const projectLabel =
    view === 'workspace'
      ? selectedProject === 'new' || selectedProject == null
        ? 'new project'
        : selectedProject.name
      : null

  return (
    <div className="app">
      <Header
        projectName={projectLabel}
        onBack={view === 'workspace' ? handleBack : null}
        onClearData={handleClearData}
      />

      {view === 'projects' ? (
        <ProjectsView
          projects={projects}
          loading={projectsLoading}
          onSelect={handleProjectSelect}
          onCreateNew={handleCreateNew}
        />
      ) : (
        <WorkspaceView
          selectedProject={selectedProject}
          inputCollapsed={inputCollapsed}
          onToggleCollapse={() => setInputCollapsed(c => !c)}
          inputText={inputText}
          onInputChange={handleInputChange}
          onGenerate={handleGenerate}
          genStatus={genStatus}
          elapsed={elapsed}
          progress={progress}
          generatedTasks={generatedTasks}
          deletedTaskIds={deletedTaskIds}
          onDeleteTask={handleTaskDelete}
          onRestoreTask={handleTaskRestore}
          onUpdateTask={handleTaskUpdate}
          confirmed={confirmed}
          onConfirm={handleConfirm}
          genProjectName={genProjectName}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
