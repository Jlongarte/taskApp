import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; //
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskForm from "../components/TaskForm/TaskForm";
import TaskFilters from "../components/TaskFilters/TaskFilters";
import TaskList from "../components/TaskLists/TaskList";
import "./Dashboard.css";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filters, setFilters] = useState({ status: "", date: "", sort: "" });

  const loadTasks = async () => {
    const res = await getTasks(token, filters);
    if (Array.isArray(res)) setTasks(res);
    else if (res && Array.isArray(res.data)) setTasks(res.data);
    else setTasks([]);
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleSubmitTask = async (formData) => {
    if (taskToEdit) {
      await updateTask(token, taskToEdit._id, formData);
      setTaskToEdit(null);
    } else {
      await createTask(token, formData);
    }
    loadTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(token, id);
    loadTasks();
  };

  // LÓGICA DRAG & DROP DEL TABLERO
  const handleDragOver = (ev) => {
    ev.preventDefault();
  };

  const handleDrop = async (ev, newStatus) => {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text/plain");

    if (!taskId) return;

    // Buscamos la tarea local para no perder sus campos (título, descripción, etc.)
    const taskToUpdate = tasks.find((t) => t._id === taskId);
    if (!taskToUpdate) return;

    // Si el estado no ha cambiado, no hacemos nada
    if (taskToUpdate.status === newStatus) return;

    // Enviamos la actualización al backend en Node.js con el nuevo estado
    await updateTask(token, taskId, {
      ...taskToUpdate,
      status: newStatus,
    });

    // Recargamos el tablero de inmediato para reflejar el cambio real
    loadTasks();
  };

  // Separación por estados para el flujo Kanban
  const validTasks = Array.isArray(tasks) ? tasks : [];
  const pendingTasks = validTasks.filter(
    (t) => t.status === "pending" || t.status === "todo" || !t.status,
  );
  const inProgressTasks = validTasks.filter((t) => t.status === "in-progress");
  const completedTasks = validTasks.filter(
    (t) => t.status === "completed" || t.status === "done",
  );

  return (
    <div className="kanban-wrapper">
      <header className="kanban-header">
        <div className="kanban-info">
          <h2>Tablero de Gestión</h2>
          <span className="user-badge">👋 Hola, {user?.username}</span>
        </div>
        <TaskFilters filters={filters} setFilters={setFilters} />
      </header>

      <div className="kanban-content">
        <aside className="kanban-sidebar">
          <div className="sidebar-card">
            <h3>{taskToEdit ? "📝 Editar Tarea" : "➕ Nueva Tarea"}</h3>
            <TaskForm
              onSubmitTask={handleSubmitTask}
              taskToEdit={taskToEdit}
              clearTaskToEdit={() => setTaskToEdit(null)}
            />
          </div>
        </aside>

        <main className="kanban-columns-container">
          {/* Columna: Por Hacer (mapeada a 'todo') */}
          <div
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(ev) => handleDrop(ev, "todo")}
          >
            <div className="column-header">
              <span className="column-dot todo"></span>
              <h3>Por Hacer</h3>
              <span className="task-count">{pendingTasks.length}</span>
            </div>
            <TaskList
              tasks={pendingTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Columna: En Progreso (mapeada a 'in-progress') */}
          <div
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(ev) => handleDrop(ev, "in-progress")}
          >
            <div className="column-header">
              <span className="column-dot doing"></span>
              <h3>En Progreso</h3>
              <span className="task-count">{inProgressTasks.length}</span>
            </div>
            <TaskList
              tasks={inProgressTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Columna: Completado (mapeada a 'completed') */}
          <div
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(ev) => handleDrop(ev, "completed")}
          >
            <div className="column-header">
              <span className="column-dot done"></span>
              <h3>Completado</h3>
              <span className="task-count">{completedTasks.length}</span>
            </div>
            <TaskList
              tasks={completedTasks}
              onEdit={setTaskToEdit}
              onDelete={handleDeleteTask}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
