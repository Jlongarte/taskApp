import "./TaskCard.css";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formattedDate = task.date
    ? task.date.slice(0, 10).split("-").reverse().join("/")
    : "No date";

  // Guardamos el ID de la tarea cuando el usuario empieza a arrastrarla
  const handleDragStart = (ev) => {
    ev.dataTransfer.setData("text/plain", task._id);
    ev.dataTransfer.effectAllowed = "move";
  };

  return (
    <article
      className="kanban-task-card"
      draggable={true}
      onDragStart={handleDragStart}
    >
      <div className="card-content">
        <h3>{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="card-footer">
        <span className="task-date">📅 {formattedDate}</span>

        <div className="card-actions">
          <button
            onClick={() => onEdit(task)}
            className="action-btn-wrapper"
            title="Edit task"
          >
            <custom-button variant="secondary">Edit</custom-button>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="delete-task-btn"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
