import { useState } from "react";
import { updateUserName } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserNameForm = ({ onMessage }) => {
  const { token, user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const res = await updateUserName(token, username);
    if (res.success) {
      setUser(res.user);
      onMessage("Username updated successfully!");
    } else {
      onMessage(res.message || "Failed to update username. Please try again.");
    }
  };

  const res = getProfile(token);
  setUser(res);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Username</h2>
      <input
        type="text"
        name="username"
        placeholder="New Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        required
      />
      <button type="submit">Update Username</button>
    </form>
  );
};

export default UserNameForm;
