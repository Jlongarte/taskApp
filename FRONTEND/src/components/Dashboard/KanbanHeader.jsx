

const KanbanHeader = ({ user, showHistory, setShowHistory, statusFilter, setStatusFilter, progressPercentage }) => (
  <header className="kanban-header">
    <div className="kanban-header-top">
      <div className="kanban-info">
        <h2>Dashboard</h2>
        <span className="user-badge">
          Hello, {user?.username || user?.email || "Developer"}
        </span>
      </div>
      <div className="header-actions">
        <button className="history-toggle-btn" onClick={() => setShowHistory(!showHistory)}>
          History
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="global-status-select"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
    <div className="dashboard-progress-container">
      <div className="progress-labels">
        <span className="progress-text">Board Completion</span>
        <span className="progress-number">{progressPercentage}%</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  </header>
);

export default KanbanHeader;