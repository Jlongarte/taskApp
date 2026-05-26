import { useState } from "react";
import { updatePassword } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PasswordForm = ({ onMessage }) => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updatePassword(token, currentPassword, newPassword);
    if (res.success) {
      onMessage("Password updated successfully!");
    } else {
      onMessage(res.message || "Failed to update password. Please try again.");
    }
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Password</h2>
      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Update Password</button>
    </form>
  );
};

export default PasswordForm;
