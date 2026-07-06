import { useState, useEffect } from "react";
import { updateUserName } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserNameForm = ({ onMessage }) => {
  const { token, user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (username === user?.username) {
      onMessage("The username is the same as the current one.");
      return;
    }

    try {
      const res = await updateUserName(token, username);
      if (res && (res.success || res.user || !res.message)) {
        const updatedUser = res.user || res;
        setUser(updatedUser);
        onMessage("Username updated successfully!");
      } else {
        onMessage(res?.message || "Failed to update username.");
      }
    } catch (error) {
      onMessage("Server error updating username.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h3>Update Username</h3>
      <p className="form-subtitle">Change your public display name</p>

      <div className="profile-form-group">
        <label>New Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter new username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
      </div>

      <button type="submit" className="profile-submit-btn">
        Save Changes
      </button>
    </form>
  );
};

export default UserNameForm;
