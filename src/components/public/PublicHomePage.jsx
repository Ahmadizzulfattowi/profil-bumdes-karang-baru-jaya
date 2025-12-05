// components/public/PublicHomePage.jsx
import React from "react"; 

// MENERIMA PROP 'news' DARI KOMPONEN INDUK
const PublicHomePage = ({ products, pengurus, profil, news, setPage, getImageUrl }) => {
  
  // Data Pengurus digandakan untuk efek looping Marquee CSS yang mulus
  const marqueePengurus = [...pengurus, ...pengurus];

  return (
    <div className="container mx-auto p-4 font-[Inter] min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 mb-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-extrabold text-blue-700">
          {profil.nama_bumdes || "BUMDes Default"}
        </h1>
        <button
          onClick={() => setPage("admin")}
          className="px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Admin Login 🔑
        </button>
      </header>

      {/* Profil Section */}
      <section className="p-10 my-8 text-center text-white shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
        <img
          src={
            profil.logo_url
              ? getImageUrl(profil.logo_url)
              : "https://placehold.co/120x120/ffffff/3B82F6?text=LOGO"
          }
          alt="Logo BUMDes"
          className="object-cover w-32 h-32 mx-auto mb-4 border-4 border-white rounded-full shadow-lg"
        />
        <h2 className="mb-2 text-4xl font-extrabold">
          {profil.slogan || "Membangun Desa Mandiri"}
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-blue-100">
          {profil.deskripsi_singkat ||
            "Badan Usaha Milik Desa yang berkomitmen untuk meningkatkan kesejahteraan masyarakat melalui unit usaha yang inovatif dan berkelanjutan."}
        </p>

        <h3 className="mt-8 text-xl font-bold">Misi Kami:</h3>
        <ul className="max-w-xl mx-auto space-y-1 text-left text-blue-100 list-disc list-inside">
          {profil.misi
            ? profil.misi
                .split("\n")
                .map(
                  (m, i) => m.trim() && <li key={i}>{m.trim()}</li>
                )
            : <li>Misi BUMDes belum diatur.</li>}
        </ul>
      </section>
      
      <hr className="my-8" />

      {/* 📰 Bagian Berita & Aktivitas Terbaru (Sudah Dikoreksi untuk Gambar) */}
      <h3 className="pb-2 mt-12 mb-6 text-3xl font-bold text-red-700 border-b-4 border-red-200">
        📰 Berita & Aktivitas Terbaru
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {news && news.length > 0 ? (
          news.map((berita) => (
          <div
            key={berita.id}
            className="p-0 bg-white border-l-4 border-red-500 shadow-xl rounded-xl transition duration-300 hover:shadow-2xl overflow-hidden" 
          >
                {/* Menampilkan Gambar Berita */}
                <img 
                    src={berita.imageUrl || "https://placehold.co/400x200/F87171/ffffff?text=No+Image"} 
                    alt={berita.title}
                    className="object-cover w-full h-40 mb-4" 
                />

                <div className="p-6">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      {/* Memformat tanggal */}
                      {new Date(berita.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h4 className="mb-3 text-xl font-extrabold text-gray-900 line-clamp-2">
                      {berita.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {berita.summary}
                    </p>
                    {/* Tombol Baca Selengkapnya - Anda bisa mengganti alert ini dengan navigasi ke halaman detail */}
                    <button 
                        onClick={() => alert(`Anda akan diarahkan ke Detail Berita ID: ${berita.id}`)} 
                        className="mt-4 text-red-600 font-semibold text-sm hover:text-red-700"
                    >
                        Baca Selengkapnya →
                    </button>
                </div>
          </div>
        ))
        ) : (
          // Pesan jika tidak ada berita dari database
          <p className="text-gray-500 col-span-full">Belum ada berita atau aktivitas terbaru yang ditemukan.</p>
        )}
      </div>
      {/* AKHIR Bagian Berita Terbaru */}

      <hr className="my-8" />

      {/* Produk Unggulan */}
      <h3 className="pb-2 mt-12 mb-6 text-3xl font-bold text-purple-700 border-b-4 border-purple-200">
        ⭐ Produk Unggulan
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {products.filter((p) => p.isTop).length > 0 ? (
          products
            .filter((p) => p.isTop)
            .map((product) => (
              <div
                key={product.id}
                className="p-6 transition duration-300 bg-white border-t-4 border-purple-500 shadow-lg rounded-xl hover:shadow-2xl"
              >
                <img
                  src={
                    product.imageUrl ||
                    "https://placehold.co/400x200/500095/ffffff?text=Produk+BUMDes"
                  }
                  alt={product.name}
                  className="object-cover w-full h-40 mb-4 rounded-lg"
                />
                <h4 className="mb-2 text-xl font-extrabold text-gray-800">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-500">Belum ada produk unggulan.</p>
        )}
      </div>

      <hr className="my-8" />

      {/* Struktur Pengurus - Menggunakan Gerakan Konstan (Marquee CSS) */}
      <h3 className="pb-2 mt-12 mb-6 text-3xl font-bold text-green-700 border-b-4 border-green-200">
        👥 Struktur Pengurus
      </h3>
      {/* Container utama, overflow-x-hidden agar scrollbar tidak muncul */}
      <div className="overflow-x-hidden">
        {/* Konten yang akan digerakkan. Class 'marquee' akan menggunakan animasi CSS. */}
        <div className="flex space-x-6 marquee"> 
          {marqueePengurus.length > 0 ? (
            marqueePengurus.map((p, index) => (
              <div
                key={p.id + '-' + index} // Key unik untuk duplikasi
                className="p-6 text-center bg-white border-b-4 border-green-500 shadow-lg rounded-xl flex-shrink-0 w-64" 
              >
                <img
                  src={
                    p.imageUrl
                      ? getImageUrl(p.imageUrl)
                      : "https://placehold.co/100x100/10B981/ffffff?text=P"
                  }
                  alt={p.name}
                  className="object-cover w-24 h-24 mx-auto mb-3 border-4 border-gray-100 rounded-full shadow-md"
                />
                <p className="text-lg font-extrabold text-gray-800">{p.name}</p>
                <p className="font-semibold text-green-600 text-md">
                  {p.position}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada data pengurus.</p>
          )}
        </div>
      </div>

      <hr className="my-8" />

      {/* Footer */}
      <footer className="pt-8 pb-4 mt-16 text-center text-gray-700 bg-white border-t-2 border-gray-200 shadow-lg rounded-xl">
        <p className="mb-2 text-lg font-bold">Kontak Kami</p>
        <div className="space-y-1 text-sm">
          <p>
            📞 Kontak:{" "}
            <span className="font-medium">{profil.kontak || "-"}</span>
          </p>
          <p>
            📧 Email:{" "}
            <span className="font-medium">{profil.email || "-"}</span>
          </p>
          <p>
            📍 Alamat:{" "}
            <span className="font-medium">{profil.alamat || "-"}</span>
          </p>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          &copy; {new Date().getFullYear()}{" "}
          {profil.nama_bumdes || "BUMDes Karang Baru Jaya"}. Semua Hak Dilindungi.
        </p>
      </footer>
    </div>
  );
};

export default PublicHomePage;
