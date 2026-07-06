import TaskCard from "../TaskCard/TaskCard";

// 🔗 CLAVE: ¡Tenemos que recibir 'startPomodoro' aquí arriba!
const TaskList = ({ tasks, onEdit, onDelete, startPomodoro }) => {
  return (
    <div className="task-cards-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id || task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          startPomodoro={startPomodoro} // 🔗 Y volver a pasarlo hacia abajo aquí
        />
      ))}
    </div>
  );
};

export default TaskList;
