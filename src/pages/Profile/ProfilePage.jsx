import { useState } from "react"
import PageHeader from "../../components/common/PageHeader";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordloading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  return (
    <div>
      <PageHeader title="Profile Settings" />
    </div>
  )
}
export default ProfilePage