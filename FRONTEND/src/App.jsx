import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <Navbar token={token} onLogout={handleLogout} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
