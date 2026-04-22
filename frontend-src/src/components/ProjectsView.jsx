export function ProjectsView({ projects, loading, onSelect, onCreateNew }) {
  return (
    <div className="projects-view">
      <div className="projects-panel">
        <div className="projects-panel__header">
          <span className="projects-panel__title">your projects</span>
          <button className="btn btn--sm" onClick={onCreateNew}>
            + new project
          </button>
        </div>

        {loading ? (
          <div className="projects-loading">
            <span className="spinner" />
            loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-list__empty">
            no projects found
            <br />
            <span style={{ opacity: 0.5 }}>create one to get started</span>
          </div>
        ) : (
          <ul className="projects-list">
            {projects.map(project => (
              <li
                key={project.id}
                className="project-item"
                onClick={() => onSelect(project)}
              >
                <span className="project-item__dot" />
                <span className="project-item__name">{project.name}</span>
                {project.tasks?.length > 0 && (
                  <span className="project-item__count">
                    {project.tasks.length}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
