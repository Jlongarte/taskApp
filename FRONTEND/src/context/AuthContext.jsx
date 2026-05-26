import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Busca dónde defines el useState del token y ponle un string de prueba:
  const [token, setToken] = useState("token-falso-de-prueba-123");
  const [user, setUser] = useState({
    username: "Developer",
    email: "test@test.com",
  });

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      const res = await getUserProfile(token);
      if (res.message) {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        return;
      }
      setUser(res);
    };
    loadUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
