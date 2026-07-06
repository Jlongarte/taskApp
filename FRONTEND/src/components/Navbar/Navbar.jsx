import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 💡 Extraemos los datos del usuario real
import "./Navbar.css";

const Navbar = ({ token, onLogout }) => {
  const { user } = useAuth();
  // 💡 Estado para abrir y cerrar el menú flotante
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Cierra el menú al hacer clic en un enlace
  const closeDropdown = () => setDropdownOpen(false);

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
            {/* 📊 NUEVO ENLACE A LA PANTALLA DE ANALÍTICAS */}
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Analytics
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            {/* 💼 NUEVO ENLACE A LA GESTIÓN DE MÚLTIPLES TABLEROS */}
            <li>
              <NavLink
                to="/workspaces"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Workspaces
              </NavLink>
            </li>

            {/* 👤 MENÚ DESPLEGABLE CON EL AVATAR DEL USUARIO */}
            <li className="avatar-dropdown-container">
              <button className="avatar-trigger-btn" onClick={toggleDropdown}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="nav-user-avatar"
                  />
                ) : (
                  <div className="nav-avatar-placeholder">
                    {user?.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </button>

              {/* Menú flotante condicional */}
              {dropdownOpen && (
                <div className="nav-dropdown-menu">
                  <div className="dropdown-user-info">
                    <span className="dropdown-username">
                      {user?.username || "Developer"}
                    </span>
                    <span className="dropdown-email">
                      {user?.email || "user@test.com"}
                    </span>
                  </div>

                  <hr className="dropdown-divider" />

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    ⚙️ Account Profile
                  </Link>

                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      closeDropdown();
                      onLogout();
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
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