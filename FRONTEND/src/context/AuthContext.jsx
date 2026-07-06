import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔍 LEER AL ARRANCAR: Inicializamos los estados leyendo directamente del localStorage
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const expiryTime = localStorage.getItem("kanban_expiry");
    const now = new Date().getTime();

    // Si hay token y no ha expirado (5 días), lo cargamos. Si no, devolvemos string vacío.
    if (storedToken && expiryTime && now < parseInt(expiryTime, 10)) {
      return storedToken;
    }

    // Si ya expiró el plazo de 5 días, hacemos una limpieza preventiva
    localStorage.removeItem("token");
    localStorage.removeItem("kanban_expiry");
    return "";
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      // Verificamos si los 5 días expiraron justo en este segundo (durante el uso de la app)
      const expiryTime = localStorage.getItem("kanban_expiry");
      const now = new Date().getTime();
      if (expiryTime && now > parseInt(expiryTime, 10)) {
        logout();
        return;
      }

      const res = await getUserProfile(token);

      // Si el perfil da error o el token fue revocado en el backend, limpiamos sesión
      if (!res || res.message) {
        logout();
        return;
      }
      setUser(res);
    };
    loadUser();
  }, [token]);

  const login = (newToken, userData) => {
    // ⏳ CÁLCULO DE LOS 5 DÍAS EXACTOS:
    // 5 días * 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
    const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date().getTime() + FIVE_DAYS_IN_MS;

    // Guardamos los datos de sesión y la marca de tiempo exacta de expiración
    localStorage.setItem("token", newToken);
    localStorage.setItem("kanban_expiry", expiryDate.toString());

    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // Limpieza total y absoluta del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("kanban_expiry");
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
