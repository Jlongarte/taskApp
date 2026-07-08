 const WorkspaceHeader = ({ searchTerm, setSearchTerm, onCreateClick }) => (
  <div className="workspaces-header-section">
    <div className="workspaces-title-group">
      <h2>My Workspaces</h2>
      <p>Manage, search, and classify your high-level projects.</p>
    </div>
    <div className="workspaces-action-group">
      <input 
        type="text" 
        placeholder=" Search board..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="workspaces-search-input"
      />
      <button onClick={onCreateClick} className="workspaces-btn-create">
         New Board
      </button>
    </div>
  </div>
);

export default WorkspaceHeader;