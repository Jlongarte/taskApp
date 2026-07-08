import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (ev) => {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setMessage("");

    const jsonBody = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonBody),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("Server connection error.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/*  Encabezado */}
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Get started with your new management board</p>
        </div>

        {/*  Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Profile Avatar (Optional)</label>
            <div className="custom-file-wrapper">
              <label htmlFor="avatar-upload" className="custom-file-btn">
                Choose File
              </label>
              <span className="custom-file-text">
                {avatar ? avatar.name : "No file chosen"}
              </span>
              <input
                id="avatar-upload"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(ev) => setAvatar(ev.target.files[0])}
                className="hidden-file-input"
              />
            </div>
          </div>

          <button type="submit" className="native-submit-btn">
            Register
          </button>
        </form>

        {message && <div className="auth-error-message">{message}</div>}
      </div>
    </div>
  );
};

export default Register;