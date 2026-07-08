import { useState } from "react";
import TaskItem from '../Workspace/TaskItem';

const BoardCard = ({ board, tasks, onEdit, onDelete, onProgressChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const boardTasks = tasks.filter(t => {
    if (!t.board) return false;
    const taskBoardId = typeof t.board === 'object' ? t.board._id : t.board;
    return String(taskBoardId) === String(board._id);
  });

  return (
    <div className="workspaces-board-card" style={{ borderTop: `4px solid ${board.color || "#6366f1"}` }}>
      <div className="workspaces-options-menu">
        <button onClick={() => setShowMenu(!showMenu)} className="workspaces-btn-dots">⋮</button>
        {showMenu && (
          <div className="workspaces-dropdown-box">
            <button onClick={() => { onEdit(board); setShowMenu(false); }} className="workspaces-dropdown-btn"> Edit</button>
            <button onClick={() => onDelete(board._id)} className="workspaces-dropdown-btn btn-delete">{boardTasks.length > 0 ? "Archive" : "Delete"}</button>
          </div>
        )}
      </div>

      <h3>{board.name}</h3>
      <p className="board-desc">{board.description || "No description assigned"}</p>

      <div className="workspaces-tasks-section">
        <span className="workspaces-tasks-title">Tasks ({boardTasks.length}):</span>
        {boardTasks.length === 0 ? (
          <p className="workspaces-no-tasks">No linked tasks</p>
        ) : (
          boardTasks.map(task => (
            <TaskItem key={task._id} task={task} onProgressChange={onProgressChange} />
          ))
        )}
      </div>
    </div>
  );
};

export default BoardCard;