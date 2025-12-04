// components/admin/ProfilBumdesEditor.jsx
import React, { useState, useEffect } from "react";
import InputField from "../fields/InputField";
import TextAreaField from "../fields/TextAreaField";
import FileField from "../fields/FileField";

const ProfilBumdesEditor = ({ profil, setProfil, getImageUrl, API_URL }) => {
  const [formData, setFormData] = useState({
    nama_bumdes: profil.nama_bumdes || "",
    slogan: profil.slogan || "",
    deskripsi_singkat: profil.deskripsi_singkat || "",
    misi: profil.misi || "",
    kontak: profil.kontak || "",
    email: profil.email || "",
    alamat: profil.alamat || "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [message, setMessage] = useState("");

  // Sinkronisasi ketika prop `profil` berubah
  useEffect(() => {
    setFormData({
      nama_bumdes: profil.nama_bumdes || "",
      slogan: profil.slogan || "",
      deskripsi_singkat: profil.deskripsi_singkat || "",
      misi: profil.misi || "",
      kontak: profil.kontak || "",
      email: profil.email || "",
      alamat: profil.alamat || "",
    });
    setLogoFile(null);
    setBackgroundFile(null);
    setMessage("");
  }, [profil]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setFileState) => {
    setFileState(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      updateData.append(key, formData[key]);
    });

    if (logoFile) updateData.append("logo_file", logoFile);
    if (backgroundFile) updateData.append("background_file", backgroundFile);

    try {
      const response = await fetch(`${API_URL}/profil`, {
        method: "PUT",
        body: updateData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Profil BUMDes berhasil diperbarui.");

        // Ambil data terbaru dari server
        const refreshResponse = await fetch(`${API_URL}/profil`);
        if (refreshResponse.ok) {
          const newProfil = await refreshResponse.json();
          setProfil(newProfil);
        }

        setLogoFile(null);
        setBackgroundFile(null);
      } else {
        setMessage(`❌ Gagal memperbarui profil: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      console.error("Kesalahan saat update profil:", err);
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl font-[Inter]">
      <h3 className="pb-2 mb-6 text-2xl font-bold text-green-700 border-b">
        Edit Profil BUMDes
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          name="nama_bumdes"
          label="Nama BUMDes"
          value={formData.nama_bumdes}
          onChange={handleChange}
          required={true}
        />
        <InputField
          name="slogan"
          label="Slogan"
          value={formData.slogan}
          onChange={handleChange}
          required={true}
        />
        <TextAreaField
          name="deskripsi_singkat"
          label="Deskripsi Singkat"
          value={formData.deskripsi_singkat}
          onChange={handleChange}
          required={true}
        />
        <TextAreaField
          name="misi"
          label="Misi (pisahkan per baris)"
          value={formData.misi}
          onChange={handleChange}
          required={true}
        />
        <InputField
          name="kontak"
          label="Kontak / Telepon"
          value={formData.kontak}
          onChange={handleChange}
        />
        <InputField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <TextAreaField
          name="alamat"
          label="Alamat"
          value={formData.alamat}
          onChange={handleChange}
        />

        <div className="pt-4 border-t">
          <h4 className="mb-3 text-lg font-medium text-gray-700">
            Ganti Gambar
          </h4>

          <FileField
            label="Logo BUMDes"
            currentImage={profil.logo_url}
            getFileUrl={getImageUrl}
            onFileChange={(e) => handleFileChange(e, setLogoFile)}
            fileState={logoFile}
          />

          <FileField
            label="Background / Header Image"
            currentImage={profil.background_url}
            getFileUrl={getImageUrl}
            onFileChange={(e) => handleFileChange(e, setBackgroundFile)}
            fileState={backgroundFile}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 mt-6 text-lg font-semibold text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-700"
        >
          Simpan Profil BUMDes
        </button>
      </form>
    </div>
  );
};

export default ProfilBumdesEditor;
