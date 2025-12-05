// App.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

// Import komponen dari folder components
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import PublicHomePage from "./components/public/PublicHomePage";

// URL dasar server Express kamu
const API_URL = "https://bumdes-karang-baru-jaya.vercel.app";

function App() {
  const [products, setProducts] = useState([]);
  const [pengurus, setPengurus] = useState([]);
  const [profil, setProfil] = useState({});
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [page, setPage] = useState("public");
  const [loading, setLoading] = useState(true);

  // Helper untuk URL gambar
  const getImageUrl = useCallback((filename) => {
    return filename
      ? `${API_URL}/images/${filename}`
      : "https://via.placeholder.com/100?text=No+Image";
  }, []);

  // Fetch data produk dari backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Gagal memuat produk.");
      }
    } catch (error) {
      console.error("Error memuat produk:", error);
    }
  }, []);

  // Fetch data pengurus
  const fetchPengurus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/pengurus`);
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((p) => ({
          ...p,
          image_url: p.image_url ? getImageUrl(p.image_url) : null,
        }));
        setPengurus(mappedData);
      } else {
        console.error("Gagal memuat data pengurus.");
      }
    } catch (error) {
      console.error("Error memuat pengurus:", error);
    }
  }, [getImageUrl]);

  // Fetch data profil BUMDes
  const fetchProfil = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/profil`);
      if (response.ok) {
        const data = await response.json();
        setProfil(data);
      } else {
        console.error("Gagal memuat data profil BUMDes.");
      }
    } catch (error) {
      console.error("Error memuat profil BUMDes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Jalankan fetch saat awal render
  useEffect(() => {
    fetchProducts();
    fetchPengurus();
    fetchProfil();
  }, [fetchProducts, fetchPengurus, fetchProfil]);

  // Fungsi Logout Admin
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setPage("public");
    setAdminUser(null);
    console.log("Admin berhasil logout.");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 font-[Inter]">
        <div className="p-4 text-2xl font-semibold text-blue-600 bg-white rounded-lg shadow-lg animate-pulse">
          Memuat data dari MySQL Server...
        </div>
      </div>
    );
  }

  // Logika render halaman admin
  if (page === "admin") {
    if (isAdminLoggedIn && adminUser) {
      return (
        <AdminDashboard
          products={products}
          setPage={setPage}
          handleAdminLogout={handleAdminLogout}
          refreshProducts={fetchProducts}
          pengurus={pengurus}
          fetchPengurus={fetchPengurus}
          getImageUrl={getImageUrl}
          profil={profil}
          setProfil={setProfil}
          adminUser={adminUser}
          setAdminUser={setAdminUser}
        />
      );
    } else {
      return (
        <AdminLogin
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          setPage={setPage}
          setAdminUser={setAdminUser}
        />
      );
    }
  }

  // Halaman Publik
  return (
    <PublicHomePage
      products={products}
      pengurus={pengurus}
      profil={profil}
      setPage={setPage}
      getImageUrl={getImageUrl}
    />
  );
}

export default App;
