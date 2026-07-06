import { useState } from "react";
import { updatePassword } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PasswordForm = ({ onMessage }) => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePassword(token, currentPassword, newPassword);
      if (res && (res.success || !res.message)) {
        onMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        onMessage(
          res?.message || "Failed to update password. Please try again.",
        );
      }
    } catch (error) {
      onMessage("Server error updating password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h3>Update Password</h3>
      <p className="form-subtitle">
        Ensure your account is using a long, secure password
      </p>

      <div className="profile-form-group">
        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="profile-form-group">
        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="profile-submit-btn">
        Update Password
      </button>
    </form>
  );
};

export default PasswordForm;
