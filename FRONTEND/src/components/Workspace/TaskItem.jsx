import { useState } from "react";

const TaskItem = ({ task, onProgressChange }) => {
  const [showSlider, setShowSlider] = useState(false);
  const currentProgress = task.progress ?? 0;
  const isCompleted = currentProgress === 100;

  return (
    <div className={`workspaces-task-item ${isCompleted ? 'is-completed' : ''}`}>
      <div className="workspaces-task-row">
        <span className="workspaces-task-title">{task.title}</span>
        <button onClick={() => setShowSlider(!showSlider)} className="workspaces-btn-percentage">
          {currentProgress}%
        </button>
      </div>
      {task.comments && <p className="workspaces-task-comments"> {task.comments}</p>}
      
      {showSlider && (
        <div className="workspaces-slider-container">
          <div className="workspaces-slider-header">
            <span>Progress:</span>
            <strong>{currentProgress}%</strong>
          </div>
          <input 
            type="range" min="0" max="100" step="25" 
            value={currentProgress} 
            onChange={(e) => onProgressChange(task._id, e.target.value)}
            className="workspaces-range-input"
          />
          <div className="workspaces-slider-labels">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;