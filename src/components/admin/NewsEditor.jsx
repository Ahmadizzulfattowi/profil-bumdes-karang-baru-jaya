// components/admin/NewsEditor.jsx

import React, { useState, useEffect } from "react";
import InputField from "../fields/InputField"; // Asumsi Anda punya komponen ini
import TextAreaField from "../fields/TextAreaField"; // Asumsi Anda punya komponen ini
import FileField from "../fields/FileField"; // Asumsi Anda punya komponen ini

// Asumsi fetchNews mengambil semua data berita untuk admin, termasuk konten penuh
const NewsEditor = ({ news = [], fetchNews, API_URL }) => {
    const initialFormData = { id: null, title: "", isi: "", tanggal: "", gambar: null, imageUrl: null };

    const [formData, setFormData] = useState(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [message, setMessage] = useState(null);

    // Fungsi untuk mengambil detail berita lengkap saat Edit
    const fetchNewsDetail = async (id) => {
        try {
            const response = await fetch(`${API_URL}/admin/news/${id}`);
            const data = await response.json();
            if (response.ok) {
                // Perlu format tanggal dari DB (YYYY-MM-DD HH:mm:ss) menjadi (YYYY-MM-DD)
                const formattedDate = new Date(data.tanggal).toISOString().split('T')[0];
                setFormData({
                    id: data.id,
                    title: data.judul,
                    isi: data.isi,
                    tanggal: formattedDate,
                    gambar: data.gambar, // Nama file di DB
                    imageUrl: data.imageUrl, // URL lengkap untuk preview
                });
                setIsEditing(true);
            } else {
                setMessage(`❌ Gagal mengambil detail: ${data.message}`);
            }
        } catch (err) {
            setMessage("❌ Tidak dapat terhubung ke server untuk detail berita.");
        }
    };

    const handleAdd = () => {
        setFormData(initialFormData);
        setFileToUpload(null);
        setIsEditing(true);
        setMessage(null);
    };

    const handleEdit = (berita) => {
        // Panggil fetchNewsDetail untuk mendapatkan konten penuh
        fetchNewsDetail(berita.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
        
        try {
            const response = await fetch(`${API_URL}/admin/news/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setMessage("✅ Berita berhasil dihapus.");
                fetchNews(); // Refresh daftar berita
            } else {
                const data = await response.json();
                setMessage(`❌ Gagal hapus: ${data.message || "Kesalahan server."}`);
            }
        } catch (err) {
            setMessage("❌ Tidak dapat terhubung ke server.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    // ⭐ FUNGSI UTAMA: MENGIRIM DATA DENGAN FORMDATA
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // 1. Buat FormData
        const data = new FormData();
        data.append('judul', formData.title);
        data.append('isi', formData.isi);
        data.append('tanggal', formData.tanggal);

        // 2. Tambahkan File Gambar
        if (fileToUpload) {
            // Field name 'gambar' harus sesuai dengan Multer di server.js
            data.append('gambar', fileToUpload); 
        } 
        
        // 3. Tambahkan Logika Clear Gambar saat Edit
        // Jika sedang edit, tidak ada file baru, dan user menghapus file lama
        const isClearingOldImage = isEditing && !fileToUpload && !formData.imageUrl && formData.gambar;
        if (isClearingOldImage) {
            data.append('clearImage', 'true');
        }


        // Tentukan metode dan URL
        const method = formData.id ? "PUT" : "POST";
        const url = formData.id ? `${API_URL}/admin/news/${formData.id}` : `${API_URL}/admin/news`;

        try {
            const response = await fetch(url, {
                method: method,
                // PENTING: JANGAN set Content-Type: 'application/json' 
                // Biarkan browser menanganinya untuk FormData (multipart/form-data)
                body: data, 
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(`✅ Berita berhasil ${formData.id ? 'diperbarui' : 'ditambahkan'}.`);
                fetchNews(); // Refresh daftar
                setIsEditing(false);
                setFormData(initialFormData);
                setFileToUpload(null);
            } else {
                setMessage(`❌ Gagal ${formData.id ? 'update' : 'simpan'}: ${result.message || result.error || "Kesalahan server."}`);
            }

        } catch (err) {
            console.error("Kesalahan koneksi:", err);
            setMessage("❌ Tidak dapat terhubung ke server.");
        }
    };

    if (isEditing) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-xl font-[Inter]">
                <h3 className="pb-2 mb-4 text-2xl font-bold text-red-700 border-b">
                    {formData.id ? "Edit Berita" : "Tambah Berita Baru"}
                </h3>
                
                {message && (
                    <div
                        className={`p-3 text-sm rounded-lg mb-4 ${
                            message.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Judul Berita"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <TextAreaField
                        label="Isi Berita"
                        name="isi"
                        value={formData.isi}
                        onChange={handleChange}
                        rows={8}
                        required
                    />
                    <InputField
                        label="Tanggal Publikasi"
                        name="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={handleChange}
                        required
                    />

                    {/* Komponen FileField untuk Gambar */}
                    <FileField
                        label="Gambar Berita (Max 2MB)"
                        currentImage={formData.imageUrl} // URL gambar saat ini
                        onFileChange={handleFileChange}
                        fileState={fileToUpload}
                        // Jika ada gambar lama dan tidak ada fileToUpload, tampilkan opsi hapus
                        onClear={() => {
                            setFormData(prev => ({ ...prev, gambar: null, imageUrl: null }));
                            setFileToUpload(null);
                        }}
                    />

                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="submit"
                            className="px-6 py-2 font-semibold text-white transition duration-300 bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            {formData.id ? "Perbarui Berita" : "Simpan Berita"}
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
            <h3 className="pb-2 mb-4 text-2xl font-bold text-red-700 border-b">
                Manajemen Berita & Aktivitas
            </h3>

            <button
                onClick={handleAdd}
                className="px-4 py-2 mb-6 font-semibold text-white transition duration-300 bg-red-600 rounded-lg hover:bg-red-700"
            >
                + Tambah Berita
            </button>

            {message && (
                <div
                    className={`p-3 text-sm rounded-lg mb-4 ${
                        message.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {news && news.length > 0 ? (
                    news.map((berita) => (
                        <div key={berita.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg shadow-sm">
                            <div className="flex items-center space-x-4">
                                {berita.imageUrl && (
                                    <img 
                                        src={berita.imageUrl} 
                                        alt={berita.title} 
                                        className="object-cover w-16 h-16 rounded-lg"
                                    />
                                )}
                                <div>
                                    <p className="text-lg font-bold text-gray-900">{berita.title}</p>
                                    <p className="text-sm text-gray-500">Tanggal: {new Date(berita.tanggal).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(berita)}
                                    className="px-3 py-1 text-sm text-white transition duration-300 bg-yellow-500 rounded-md hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(berita.id)}
                                    className="px-3 py-1 text-sm text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">Belum ada berita yang diunggah.</p>
                )}
            </div>
        </div>
    );
};

export default NewsEditor;