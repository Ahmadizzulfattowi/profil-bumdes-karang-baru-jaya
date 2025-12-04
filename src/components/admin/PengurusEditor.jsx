// components/admin/PengurusEditor.jsx
import React, { useState } from "react";
import InputField from "../fields/InputField";
import FileField from "../fields/FileField";

const PengurusCard = ({ member, getImageUrl, onEdit, onDelete }) => (
  <div className="flex flex-col items-center p-4 space-y-3 bg-white rounded-lg shadow-md">
    <img
      src={
        member.imageUrl
          ? getImageUrl(member.imageUrl)
          : "https://placehold.co/100x100/3B82F6/ffffff?text=FOTO"
      }
      alt={member.name}
      className="object-cover w-24 h-24 border-4 border-blue-200 rounded-full"
    />
    <p className="text-lg font-bold text-center text-gray-800">
      {member.name}
    </p>
    <p className="text-sm text-center text-blue-600">{member.position}</p>
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(member)}
        className="text-sm text-yellow-600 hover:text-yellow-800"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(member.id, member.name)}
        className="text-sm text-red-600 hover:text-red-800"
      >
        Hapus
      </button>
    </div>
  </div>
);

const PengurusEditor = ({ pengurus, fetchPengurus, getImageUrl, API_URL }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleEdit = (member) => {
    setIsEditing(true);
    setCurrentMember(member);
    setName(member.name);
    setPosition(member.position);
    setImageFile(null);
    setMessage("");
  };

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentMember(null);
    setName("");
    setPosition("");
    setImageFile(null);
    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    const isNew = currentMember === null;

    if (!name || !position) {
      setMessage("❌ Nama dan Posisi wajib diisi.");
      return;
    }

    if (isNew && !imageFile) {
      setMessage("❌ Foto wajib diunggah untuk anggota baru.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    if (imageFile) formData.append("image", imageFile);

    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? `${API_URL}/pengurus`
      : `${API_URL}/pengurus/${currentMember.id}`;

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Pengurus ${isNew ? "ditambahkan" : "diperbarui"} dengan sukses.`);
        fetchPengurus();
        setIsEditing(false);
      } else {
        setMessage(`❌ Gagal: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      console.error("Kesalahan saat menyimpan:", err);
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus pengurus: ${name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/pengurus/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage(`✅ Pengurus ${name} berhasil dihapus.`);
        fetchPengurus();
      } else {
        const data = await response.json();
        setMessage(`❌ Gagal menghapus: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      console.error("Kesalahan saat menghapus:", err);
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-xl font-[Inter]">
        <h3 className="pb-2 mb-4 text-2xl font-bold text-blue-700 border-b">
          {currentMember ? `Edit Pengurus: ${currentMember.name}` : "Tambah Pengurus Baru"}
        </h3>

        {message && (
          <div
            className={`p-3 text-sm rounded-lg mb-4 ${
              message.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <InputField
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
          <InputField
            label="Posisi / Jabatan"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required={true}
          />
          <FileField
            label="Foto Profil"
            currentImage={currentMember ? currentMember.imageUrl : null}
            getFileUrl={getImageUrl}
            onFileChange={(e) => setImageFile(e.target.files[0])}
            fileState={imageFile}
            required={currentMember === null}
          />
          <div className="flex pt-4 space-x-4">
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Simpan Pengurus
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 text-gray-700 transition duration-300 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl font-[Inter]">
      <h3 className="pb-2 mb-4 text-2xl font-bold text-blue-700 border-b">
        Manajemen Pengurus BUMDes
      </h3>

      <button
        onClick={handleAdd}
        className="px-4 py-2 mb-6 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        + Tambah Pengurus
      </button>

      {message && (
        <div
          className={`p-3 text-sm rounded-lg mb-4 ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {pengurus.map((member) => (
          <PengurusCard
            key={member.id}
            member={member}
            getImageUrl={getImageUrl}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PengurusEditor;
