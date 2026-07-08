
import "./TaskForm.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TaskForm = ({ onSubmitTask, taskToEdit, clearTaskToEdit }) => {
  const { token } = useAuth();

  const [boards, setBoards] = useState([]);
  const [hasBoardOption, setHasBoardOption] = useState("no");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    status: "pending",
    comments: "",
    board: "",
  });

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBoards(data);
        }
      })
      .catch((err) => console.error("Error cargando tableros:", err));
  }, [token]);

  useEffect(() => {
    if (!taskToEdit) return;

    setFormData({
      title: taskToEdit.title,
      date: taskToEdit.date?.slice(0, 10) || "",
      status: taskToEdit.status || "pending",
      comments: taskToEdit.comments || "",
      board: taskToEdit.board?._id || taskToEdit.board || "",
    });

    setHasBoardOption(taskToEdit.board ? "yes" : "no");
  }, [taskToEdit]);

  const handleChange = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleRadioChange = (ev) => {
    const value = ev.target.value;

    setHasBoardOption(value);

    if (value === "no") {
      setFormData((prev) => ({
        ...prev,
        board: "",
      }));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const finalData = {
      ...formData,
      board:
        hasBoardOption === "yes" && formData.board
          ? formData.board
          : null,
    };

    onSubmitTask(finalData);

    setFormData({
      title: "",
      date: "",
      status: "pending",
      comments: "",
      board: "",
    });

    setHasBoardOption("no");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="comments"
          placeholder="Add comments or extra notes..."
          value={formData.comments}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label className="board-question">
          Would you like to add this to a board?
        </label>

        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="hasBoardOption"
              value="no"
              checked={hasBoardOption === "no"}
              onChange={handleRadioChange}
            />
            No
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="hasBoardOption"
              value="yes"
              checked={hasBoardOption === "yes"}
              onChange={handleRadioChange}
            />
            Yes
          </label>
        </div>
      </div>

      {hasBoardOption === "yes" && (
        <div className="form-group board-selector">
          {boards.length === 0 ? (
            <div className="no-boards-box">
              <p className="no-boards-text">
                You don't have any boards yet.
              </p>

              <Link
                to="/workspaces"
                className="create-board-link"
              >
                Create Board
              </Link>
            </div>
          ) : (
            <>
              <label className="board-select-label">
                Select a destination board
              </label>

              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required={hasBoardOption === "yes"}
                className="board-select"
              >
                <option value="">-- Select a board --</option>

                {boards.map((board) => (
                  <option
                    key={board._id}
                    value={board._id}
                  >
                    {board.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={
          hasBoardOption === "yes" &&
          boards.length === 0
        }
      >
        {taskToEdit ? "Save Changes" : "Create Task"}
      </button>

      {taskToEdit && (
        <button
          type="button"
          className="cancel-edit-btn"
          onClick={() => {
            clearTaskToEdit();

            setFormData({
              title: "",
              date: "",
              status: "pending",
              comments: "",
              board: "",
            });

            setHasBoardOption("no");
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
};

export default TaskForm;

