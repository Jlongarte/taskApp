import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserNameForm from "../../components/UserNameForm/UserNameForm";
import PasswordForm from "../../components/PasswordForm/PasswordForm";
import AvatarForm from "../../components/AvatarForm/AvatarForm";
import "./Profile.css";

const Profile = () => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  // ESTADO CLAVE: Controla qué pestaña está activa ("profile", "security" o "appearance")
  const [activeTab, setActiveTab] = useState("profile");

  // Función auxiliar para cambiar de pestaña limpiando el mensaje anterior
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setMessage(""); 
  };

  return (
    <div className="profile-page-wrapper">
      {/* Barra lateral con navegación interactiva */}
      <aside className="profile-navigation-sidebar">
        <button
          className={`nav-tab-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => handleTabChange("profile")}
        >
          My Profile
        </button>
        <button
          className={`nav-tab-item ${activeTab === "security" ? "active" : ""}`}
          onClick={() => handleTabChange("security")}
        >
          Security
        </button>
        <button
          className={`nav-tab-item ${activeTab === "appearance" ? "active" : ""}`}
          onClick={() => handleTabChange("appearance")}
        >
          Appearance
        </button>
      </aside>

      {/* Panel Central Dinámico */}
      <main className="profile-content-panel">
        <div className="profile-section-header">
          <h2>Account Settings</h2>
          <p>
            Logged in as: <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Mensaje global para los formularios */}
        {message && <div className="profile-alert-message">{message}</div>}

        {/* RENDERIZADO CONDICIONAL: Solo se muestra el componente que coincide con la pestaña activa */}
        {activeTab === "profile" && <UserNameForm onMessage={setMessage} />}
        {activeTab === "security" && <PasswordForm onMessage={setMessage} />}
        {activeTab === "appearance" && <AvatarForm onMessage={setMessage} />}
      </main>
    </div>
  );
};

export default Profile;
