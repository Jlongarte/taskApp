import React from "react";

const PomodoroWidget = ({ activePomodoro, isTimerRunning, setIsTimerRunning, formatTime, pomodoroTime, setActivePomodoro }) => {
  if (!activePomodoro) return null;

  return (
    <div className="pomodoro-floating-widget">
      <div className="pomodoro-info">
        <span className="pomodoro-dot">⏰</span>
        <p className="pomodoro-task-title">
          Focusing on: <strong>{activePomodoro.title}</strong>
        </p>
      </div>
      <div className="pomodoro-controls">
        <span className="pomodoro-timer">{formatTime(pomodoroTime)}</span>
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className={`pomodoro-btn ${isTimerRunning ? "pause" : "play"}`}
        >
          {isTimerRunning ? "⏸️ Pause" : "▶️ Start"}
        </button>
        <button
          onClick={() => {
            setActivePomodoro(null);
            setIsTimerRunning(false);
          }}
          className="pomodoro-btn close"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default PomodoroWidget;