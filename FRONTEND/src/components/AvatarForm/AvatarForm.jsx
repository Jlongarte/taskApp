import { useState } from "react";
import { updateAvatar } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AvatarForm = ({ onMessage }) => {
  const { token, setUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const data = new FormData();
    if (avatar) {
      data.append("avatar", avatar);
    }

    const res = await updateAvatar(token, data);
    if (res.success) {
      onMessage("Avatar updated successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Avatar</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setAvatarUrl(URL.createObjectURL(ev.target.files[0]))}
      />
      <button type="submit">Update Avatar</button>
    </form>
  );
};

export default AvatarForm;
