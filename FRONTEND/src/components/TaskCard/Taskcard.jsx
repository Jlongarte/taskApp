import { useState } from "react";
import "./TaskCard.css";

const TaskCard = ({ task, onEdit, onDelete, onStartPomodoro }) => {
  const [isEditHover, setIsEditHover] = useState(false);
  const [isDeleteHover, setIsDeleteHover] = useState(false);
  const [isTimerHover, setIsTimerHover] = useState(false);

  const handleDragStart = (ev) => {
    ev.dataTransfer.setData("text/plain", task._id || task.id);
  };

  const targetId = task._id || task.id;

  // --- STYLES SECTION ---
  const editStyle = {
    fontFamily: "inherit",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: isEditHover
      ? "rgba(99, 102, 241, 0.15)"
      : "rgba(255, 255, 255, 0.04)",
    border: isEditHover
      ? "1px solid rgba(99, 102, 241, 0.4)"
      : "1px solid rgba(255, 255, 255, 0.1)",
    color: isEditHover ? "#a5b4fc" : "#94a3b8",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-block",
    transition: "all 0.2s ease",
    boxShadow: isEditHover ? "0 0 12px rgba(99, 102, 241, 0.15)" : "none",
    pointerEvents: "auto",
  };

  const deleteStyle = {
    fontFamily: "inherit",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: isDeleteHover
      ? "rgba(239, 68, 68, 0.2)"
      : "rgba(248, 113, 113, 0.05)",
    border: isDeleteHover
      ? "1px solid rgba(239, 68, 68, 0.5)"
      : "1px solid rgba(248, 113, 113, 0.15)",
    color: isDeleteHover ? "#fca5a5" : "#f87171",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-block",
    transition: "all 0.2s ease",
    boxShadow: isDeleteHover ? "0 0 12px rgba(239, 68, 68, 0.15)" : "none",
    pointerEvents: "auto",
  };

  const timerButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    opacity: isTimerHover ? 1 : 0.5,
    transform: isTimerHover ? "scale(1.15)" : "scale(1)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // --- RENDER SECTION ---
  return (
    <div 
      className="kanban-task-card" 
      draggable 
      onDragStart={handleDragStart}
      style={{ position: "relative" }} 
    >
      <button
        type="button"
        className="card-pomodoro-trigger"
        style={{
          ...timerButtonStyle,
          position: "absolute",
          top: "14px",
          right: "14px",
          zIndex: 10,
          margin: 0,
        }}
        onClick={() => onStartPomodoro && onStartPomodoro(task)}
        onMouseEnter={() => setIsTimerHover(true)}
        onMouseLeave={() => setIsTimerHover(false)}
        title="Start Pomodoro Focus"
      >
        ⏰
      </button>

      <div className="card-content" style={{ paddingRight: "30px" }}>
        <h3>{task.title || "Untitled Task"}</h3>
      </div>

      <div className="card-footer">
        <span className="task-date">
          {task.createdAt
            ? new Date(task.createdAt).toLocaleDateString()
            : "No date"}
        </span>

        <div className="card-actions">
          <button
            type="button"
            className="edit-task-btn"
            style={editStyle}
            onClick={() => onEdit(task)}
            onMouseEnter={() => setIsEditHover(true)}
            onMouseLeave={() => setIsEditHover(false)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-task-btn"
            style={deleteStyle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete(targetId);
              }
            }}
            onMouseEnter={() => setIsDeleteHover(true)}
            onMouseLeave={() => setIsDeleteHover(false)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;