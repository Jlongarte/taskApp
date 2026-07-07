
import TaskList from "../TaskLists/TaskList"; // Ajusta la ruta a tu estructura

const KanbanColumn = ({ title, type, tasks, activeColumn, statusFilter, filterType, onDragOver, onDragLeave, onDrop, onEdit, onDelete, onStartPomodoro }) => {
  const isDimmed = statusFilter !== "all" && statusFilter !== filterType;
  const isHovered = activeColumn === type;

  return (
    <div
      className={`kanban-column ${isHovered ? "column-drag-hover" : ""} ${isDimmed ? "column-dimmed" : ""}`}
      onDragOver={(ev) => onDragOver(ev, type)}
      onDragLeave={onDragLeave}
      onDrop={(ev) => onDrop(ev, type)}
    >
      <div className="column-header">
        <span className={`column-dot ${type === "pending" ? "todo" : type === "in progress" ? "doing" : "done"}`}></span>
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <TaskList 
        tasks={tasks} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        onStartPomodoro={onStartPomodoro} // 👈 Verifica que esta línea exista aquí
      />
    </div>
  );
};

export default KanbanColumn;