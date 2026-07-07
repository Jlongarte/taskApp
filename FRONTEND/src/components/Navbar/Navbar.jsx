import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ token, onLogout }) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav >
      <div className="nav-logo">
        <p>TaskApp</p> 
      </div>

      <ul className="nav-links">
        {/* Enlaces de escritorio  */}
        <li className="desktop-link">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>

        {token ? (
          <>
            <li className="desktop-link">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Dashboard
              </NavLink>
            </li>

            <li className="desktop-link">
              <NavLink
                to="/analytics"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Analytics
              </NavLink>
            </li>
            
            <li className="desktop-link">
              <NavLink
                to="/workspaces"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Workspaces
              </NavLink>
            </li>

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

                  {/* Enlaces exclusivos para la versión móvil dentro del menú */}
                  <div className="mobile-menu-links">
                    <NavLink to="/" className="dropdown-item" onClick={closeDropdown}>
                      Home
                    </NavLink>
                    <NavLink to="/dashboard" className="dropdown-item" onClick={closeDropdown}>
                       Dashboard
                    </NavLink>
                    <NavLink to="/analytics" className="dropdown-item" onClick={closeDropdown}>
                      Analytics
                    </NavLink>
                    <NavLink to="/workspaces" className="dropdown-item" onClick={closeDropdown}>
                      Workspaces
                    </NavLink>
                    <hr className="dropdown-divider" />
                  </div>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                     Account Profile
                  </Link>

                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      closeDropdown();
                      onLogout();
                    }}
                  >
                     Sign Out
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="desktop-link">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Login
              </NavLink>
            </li>
            <li className="desktop-link">
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