import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Vinculamos sus estilos profesionales

const Navbar = ({ token, onLogout }) => {
  return (
    <nav className="trello-nav">
      <div className="nav-logo">
        <span className="logo-icon">📋</span> TaskApp
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        {token ? (
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Profile
              </NavLink>
            </li>
            <li className="logout-item">
              {/* Usamos tu Web Component aquí */}
              <custom-button variant="danger" onClick={onLogout}>
                Logout
              </custom-button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
