import { Navlink } from "react-router-dom";

const Navbar = ({ token, onLogout }) => {
  return (
    <nav>
      <ul>
        <li>
          <Navlink to="/">Home</Navlink>
        </li>
        {token ? (
          <>
            <li>
              <Navlink to="/dashboard">Dashboard</Navlink>
            </li>
            <li>
              <Navlink to="/profile">Profile</Navlink>
            </li>
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Navlink to="/login">Login</Navlink>
            </li>
            <li>
              <Navlink to="/register">Register</Navlink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
