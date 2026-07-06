import { useState } from "react";
import { updateAvatar } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AvatarForm = ({ onMessage }) => {
  const { token, user, setUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  const handleFileChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setAvatarFile(file); // Guardamos el archivo binario real para enviar a la API
      setPreviewUrl(URL.createObjectURL(file)); // Generamos la URL local para la imagen preview
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!avatarFile) {
      onMessage("Please select an image file first.");
      return;
    }

    const data = new FormData();
    data.append("avatar", avatarFile);

    try {
      const res = await updateAvatar(token, data);
      if (res && (res.success || res.user || !res.message)) {
        const updatedUser = res.user || res;
        setUser(updatedUser); // Actualiza la foto en toda la app de inmediato
        onMessage("Avatar updated successfully!");
      } else {
        onMessage(res?.message || "Failed to update avatar.");
      }
    } catch (error) {
      onMessage("Server error updating avatar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h3>Update Avatar</h3>
      <p className="form-subtitle">
        Change your profile picture profile presence
      </p>

      <div
        className="profile-form-group"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          margin: "10px 0",
        }}
      >
        {/* Círculo de Previsualización elegante estilo Taskify */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#f2f4f7",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #eaecf0",
            flexShrink: 0,
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "24px" }}>👤</span>
          )}
        </div>

        <div className="profile-form-group" style={{ flexGrow: 1 }}>
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ padding: "6px 10px" }} // Ajuste ligero para inputs tipo file
          />
        </div>
      </div>

      <button type="submit" className="profile-submit-btn">
        Upload Avatar
      </button>
    </form>
  );
};

export default AvatarForm;
