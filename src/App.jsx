import React from 'react';

export default function App() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">KB</div>
            <div>
              <h1 className="text-xl font-semibold">BUMDes Karang Baru</h1>
              <p className="text-sm text-gray-500">Wanasaba, Lombok Timur</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:underline">Tentang</a>
            <a href="#layanan" className="hover:underline">Layanan</a>
            <a href="#produk" className="hover:underline">Produk</a>
            <a href="#kegiatan" className="hover:underline">Kegiatan</a>
            <a href="#kontak" className="hover:underline">Kontak</a>
          </nav>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-md border text-sm shadow-sm bg-white hover:bg-gray-100"
            >
              Cetak / PDF
            </button>
            <a
              href="#kontak"
              className="px-3 py-2 rounded-md bg-green-600 text-white text-sm shadow-sm hover:bg-green-700"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold">BUMDes Karang Baru</h2>
            <p className="mt-4 text-gray-600">Selamat datang di profil resmi BUMDes Karang Baru — Wanasaba, Lombok Timur. Kami bekerja untuk memberdayakan ekonomi desa melalui usaha produktif, pelayanan masyarakat, dan kerjasama lokal.</p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="p-3 bg-white rounded-lg shadow-sm">
                <strong>Visi</strong>
                <div className="text-sm text-gray-500">Membangun ekonomi desa yang mandiri dan berkelanjutan.</div>
              </li>
              <li className="p-3 bg-white rounded-lg shadow-sm">
                <strong>Misi</strong>
                <div className="text-sm text-gray-500">Memberdayakan UMKM lokal, mengelola aset desa, dan meningkatkan kesejahteraan masyarakat.</div>
              </li>
            </ul>

          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold">Profil Singkat</h3>
            <table className="w-full mt-4 text-sm">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">Nama BUMDes</td>
                  <td className="py-2">BUMDes Karang Baru</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Desa / Kecamatan</td>
                  <td className="py-2">Wanasaba, Lombok Timur</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Bidang usaha</td>
                  <td className="py-2">Marketplace produk lokal, penyewaan alat pertanian, pengolahan hasil pertanian</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Kontak</td>
                  <td className="py-2">+62 8xx-xxxx-xxxx | bumdes.karangbaru@example.com</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 font-medium">Alamat</td>
                  <td className="py-2">Dusun Karang, Desa Karang Baru, Kec. Wanasaba, Lombok Timur</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 flex gap-2">
              <a href="#produk" className="px-3 py-2 bg-green-600 text-white rounded-md text-sm">Lihat Produk</a>
              <a href="#kegiatan" className="px-3 py-2 border rounded-md text-sm">Agenda & Kegiatan</a>
            </div>
          </div>
        </section>

        <section id="layanan" className="mt-12">
          <h3 className="text-2xl font-semibold">Layanan & Usaha</h3>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">Marketplace Produk Lokal</h4>
              <p className="text-sm text-gray-500 mt-2">Menjual hasil pertanian, kerajinan, dan makanan olahan warga desa secara online dan offline.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">Penyewaan Alat Pertanian</h4>
              <p className="text-sm text-gray-500 mt-2">Sewa alat untuk musim tanam agar produktivitas meningkat tanpa biaya investasi besar bagi petani.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">Pengolahan Hasil Pertanian</h4>
              <p className="text-sm text-gray-500 mt-2">Unit pengolahan untuk menambah nilai (pengemasan, pengeringan, pengolahan makanan).</p>
            </div>
          </div>
        </section>

        <section id="produk" className="mt-12">
          <h3 className="text-2xl font-semibold">Produk Unggulan</h3>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="h-36 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Foto Produk</div>
              <h5 className="font-semibold mt-3">Beras Organik Karang</h5>
              <p className="text-sm text-gray-500">Beras lokal kualitas unggul dari petani setempat.</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="h-36 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Foto Produk</div>
              <h5 className="font-semibold mt-3">Kerajinan Anyaman</h5>
              <p className="text-sm text-gray-500">Kerajinan tangan khas Lombok dari pengrajin desa.</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="h-36 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Foto Produk</div>
              <h5 className="font-semibold mt-3">Kopi Robusta Lokal</h5>
              <p className="text-sm text-gray-500">Kopi sangrai hasil perkebunan desa.</p>
            </div>
          </div>
        </section>

        <section id="kegiatan" className="mt-12">
          <h3 className="text-2xl font-semibold">Agenda & Kegiatan</h3>
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <strong>Pelatihan Pengemasan Produk</strong>
                  <div className="text-sm text-gray-500 mt-1">12 Agustus 2025 — Balai Desa Karang Baru</div>
                  <p className="text-sm text-gray-600 mt-2">Pelatihan meningkatkan mutu kemasan dan labeling untuk pasar modern.</p>
                </div>
                <div className="text-sm text-green-600">Terbuka untuk warga</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <strong>Panen Bersama & Pasar Rakyat</strong>
                  <div className="text-sm text-gray-500 mt-1">30 September 2025 — Lapangan Dusun Karang</div>
                  <p className="text-sm text-gray-600 mt-2">Acara tahunan mempromosikan produk lokal dan tourism desa.</p>
                </div>
                <div className="text-sm text-green-600">Gratis</div>
              </div>
            </div>
          </div>
        </section>

        <section id="kontak" className="mt-12">
          <h3 className="text-2xl font-semibold">Kontak & Lokasi</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm">Hubungi kami untuk kerja sama, pemesanan produk, atau penyewaan alat.</p>

              <ul className="mt-4 text-sm space-y-2">
                <li><strong>Telepon:</strong> +62 8xx-xxxx-xxxx</li>
                <li><strong>Email:</strong> bumdes.karangbaru@example.com</li>
                <li><strong>Alamat:</strong> Dusun Karang, Desa Karang Baru, Kec. Wanasaba, Lombok Timur</li>
              </ul>

              <div className="mt-4 flex gap-2">
                <a href="mailto:bumdes.karangbaru@example.com" className="px-3 py-2 rounded-md border text-sm">Email</a>
                <a href="#" className="px-3 py-2 rounded-md bg-green-600 text-white text-sm">WhatsApp</a>
              </div>
            </div>

             <div className="rounded-2xl overflow-hidden shadow-lg border">
            <iframe
              title="Lokasi BUMDes Karang Baru"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126273.38186766845!2d116.44228015647703!3d-8.495182392358913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcc36a2ba2cf755%3A0xe7595b3bdbc78559!2sKarang%20Baru%2C%20Kec.%20Wanasaba%2C%20Kabupaten%20Lombok%20Timur%2C%20Nusa%20Tenggara%20Bar.!5e0!3m2!1sid!2sid!4v1760168563942!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            </div>
          </div>
        </section>

        <footer className="mt-12 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BUMDes Karang Baru — Wanasaba, Lombok Timur. All rights reserved.
        </footer>
      </main>

      <style>{`@media print { header, nav, a[href="#kontak"] { display: none !important; } body { background: white; } }`}</style>
    </div>
  );
}
