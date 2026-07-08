import { useState } from "react";
import { updateAvatar } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AvatarForm.css";

const AvatarForm = ({ onMessage }) => {
  const { token, user, setUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  const handleFileChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
        setUser(updatedUser);
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

      <div className="profile-form-group avatar-form-row">
        <div className="avatar-preview">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="avatar-preview-image"
            />
          ) : (
            <span className="avatar-placeholder">👤</span>
          )}
        </div>

        <div className="profile-form-group avatar-input-group">
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="avatar-file-input"
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