import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AnalyticsView } from '../src/components/AnalyticsView/AnalyticsView.jsx';
import  WorkspacesView  from '../src/components/WorkspacesView/WorkspacesView.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* Rutas Públicas */}
            <Route index element={<Home />} />{" "}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="/workspaces" element={<WorkspacesView />} />
            </Route>
          </Route>

          {/* Error 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
