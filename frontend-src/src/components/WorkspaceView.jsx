import { InputPanel } from './InputPanel'
import { TasksPanel } from './TasksPanel'

export function WorkspaceView({
  selectedProject,
  inputCollapsed,
  onToggleCollapse,
  inputText,
  onInputChange,
  onGenerate,
  genStatus,
  elapsed,
  progress,
  generatedTasks,
  deletedTaskIds,
  onDeleteTask,
  onRestoreTask,
  onUpdateTask,
  confirmed,
  onConfirm,
  genProjectName,
}) {
  const projectTasks =
    selectedProject && selectedProject !== 'new'
      ? selectedProject.tasks ?? []
      : []

  return (
    <div className={`workspace${inputCollapsed ? ' workspace--collapsed' : ''}`}>
      <InputPanel
        collapsed={inputCollapsed}
        onToggleCollapse={onToggleCollapse}
        project={selectedProject}
        inputText={inputText}
        onInputChange={onInputChange}
        onGenerate={onGenerate}
        genStatus={genStatus}
        elapsed={elapsed}
        progress={progress}
      />

      <TasksPanel
        genStatus={genStatus}
        generatedTasks={generatedTasks}
        deletedTaskIds={deletedTaskIds}
        onDeleteTask={onDeleteTask}
        onRestoreTask={onRestoreTask}
        onUpdateTask={onUpdateTask}
        confirmed={confirmed}
        onConfirm={onConfirm}
        genProjectName={genProjectName}
        projectTasks={projectTasks}
      />
    </div>
  )
}
