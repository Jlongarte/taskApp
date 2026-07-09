import "./TaskCard.css";

const TaskCard = ({ task, onEdit, onDelete, onStartPomodoro }) => {
  const handleDragStart = (ev) => {
    ev.dataTransfer.setData("text/plain", task._id || task.id);
  };

  const targetId = task._id || task.id;

  return (
    <div
      className="kanban-task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <button
        type="button"
        className="card-pomodoro-trigger"
        onClick={() => onStartPomodoro && onStartPomodoro(task)}
        title="Start Pomodoro Focus"
      >
        ⏰
      </button>

      <div className="card-content">
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
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-task-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete(targetId);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;