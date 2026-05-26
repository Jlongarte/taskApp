import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserNameForm from "../components/UserNameForm/UserNameForm";
import AvatarForm from "../components/AvatarForm/AvatarForm";
import PasswordForm from "../components/PasswordForm/PasswordForm";

const Profile = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  return (
    <section>
      <h1>Profile</h1>

      {user?.avatarUrl && <img src={user.avatarUrl} alt={user.userName} />}

      <UserNameForm onMessage={setMessage} />
      <PasswordForm onMessage={setMessage} />
      <AvatarForm onMessage={setMessage} />

      {message && <p>{message}</p>}
    </section>
  );
};

export default Profile;
