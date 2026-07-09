
import TaskCard from "../TaskCard/TaskCard.jsx"; 

const TaskList = ({ tasks, onEdit, onDelete, onStartPomodoro }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id || task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStartPomodoro={onStartPomodoro} 
        />
      ))}
    </div>
  );
};

export default TaskList;
