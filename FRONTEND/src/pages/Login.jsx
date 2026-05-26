import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
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

    try {
      const res = await loginUser(formData);

      if (res && res.token) {
        login(res.token, res.user);
        navigate("/dashboard");
      } else {
        setMessage(res?.message || "Invalid email or password.");
      }
    } catch (error) {
      setMessage("Server connection error.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Manage your projects seamlessly</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
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
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="native-submit-btn">
            Sign In
          </button>
        </form>

        {message && <div className="auth-error-message">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
