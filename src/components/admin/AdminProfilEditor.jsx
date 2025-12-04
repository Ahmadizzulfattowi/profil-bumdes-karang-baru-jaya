// components/admin/AdminProfileEditor.jsx
import React, { useState } from "react";
import InputField from "../fields/InputField";
import FileField from "../fields/FileField";

const AdminProfileEditor = ({ adminUser, setAdminUser, API_URL }) => {
  const [username, setUsername] = useState(adminUser.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setMessage("❌ Kata sandi baru dan konfirmasi tidak cocok.");
      return;
    }

    if (newPassword && !oldPassword) {
      setMessage("❌ Masukkan kata sandi lama untuk mengubah sandi.");
      return;
    }

    if (username === adminUser.username && !newPassword && !profileImageFile) {
      setMessage("⚠️ Tidak ada perubahan yang dilakukan.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    if (newPassword) {
      formData.append("old_password", oldPassword);
      formData.append("new_password", newPassword);
    }
    if (profileImageFile) {
      formData.append("profile_image", profileImageFile);
    }

    try {
      const response = await fetch(`${API_URL}/admin/profile/${adminUser.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Profil berhasil diperbarui.");
        setAdminUser((prev) => ({ ...prev, username }));
      } else {
        setMessage(`❌ Gagal memperbarui profil: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl font-[Inter]">
      <h3 className="pb-2 mb-4 text-2xl font-bold text-blue-700 border-b">
        Edit Profil Admin
      </h3>

      {message && (
        <div
          className={`p-3 text-sm rounded-lg mb-4 ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : message.startsWith("⚠️")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <InputField
          label="Username Baru"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <FileField
          label="Foto Profil"
          onFileChange={(e) => setProfileImageFile(e.target.files[0])}
          fileState={profileImageFile}
        />

        <h4 className="pt-4 mt-6 text-xl font-bold text-gray-700 border-t">
          Ubah Kata Sandi
        </h4>

        <InputField
          label="Kata Sandi Lama"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <InputField
          label="Kata Sandi Baru"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <InputField
          label="Konfirmasi Kata Sandi Baru"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full px-4 py-3 mt-6 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default AdminProfileEditor;
