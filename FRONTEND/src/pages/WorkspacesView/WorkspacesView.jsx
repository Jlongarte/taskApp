import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import WorkspaceHeader from '../../components/Workspace/WorkspaceHeader';
import BoardCard from "../../components/Workspace/BoardCard";
import BoardModal from "../../components/Workspace/BoardModal";
import "./WorkspacesView.css";

const WorkspacesView = () => {
  const { token } = useAuth();
  const {
    tasks,
    searchTerm,
    setSearchTerm,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingBoard,
    setEditingBoard,
    filteredBoards,
    handleCreateBoard,
    handleDeleteBoard,
    handleSaveBoardEdit,
    handleProgressChange
  } = useWorkspaces(token);

  return (
    <div className="workspaces-container">
      <WorkspaceHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onCreateClick={() => setIsCreateModalOpen(true)} 
      />

      <div className="workspaces-boards-grid">
        {filteredBoards.map((board) => (
          <BoardCard
            key={board._id}
            board={board}
            tasks={tasks}
            onEdit={setEditingBoard}
            onDelete={handleDeleteBoard}
            onProgressChange={handleProgressChange}
          />
        ))}
      </div>

      <BoardModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateBoard}
        title="Create New Board"
      />

      <BoardModal 
        isOpen={!!editingBoard} 
        onClose={() => setEditingBoard(null)} 
        onSubmit={(data) => handleSaveBoardEdit(editingBoard._id, data)}
        initialData={editingBoard}
        title="Board Settings"
      />
    </div>
  );
};

export default WorkspacesView;