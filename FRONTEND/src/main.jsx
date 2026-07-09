import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from '../src/pages/Home/Home.jsx';
import Login from '../src/pages/Login/Login.jsx';
import Register from '../src/pages/Register.jsx';
import Profile from '../src/pages/Profile/Profile.jsx';
import Dashboard from '../src/pages/Dashboard/Dashboard.jsx';
import NotFound from "./pages/NotFound/NotFound";
import { AnalyticsView } from '../src/pages/AnalyticsView/AnalyticsView.jsx';
import  WorkspacesView  from '../src/pages/WorkspacesView/WorkspacesView.jsx';
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
