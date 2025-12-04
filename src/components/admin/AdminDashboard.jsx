// components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import NavItem from "./NavItem";
import AdminProfileEditor from "../admin/AdminProfilEditor.jsx";
import ProfilBumdesEditor from "./ProfilBumdesEditor";
import PengurusEditor from "./PengurusEditor";
import ProductEditor from "./ProductEditor";
import NewsEditor from "./NewsEditor"; // ⭐ IMPORT KOMPONEN EDITOR BARU

const API_URL = "http://localhost:3001";

const AdminDashboard = ({
  products,
  setPage,
  handleAdminLogout,
  refreshProducts,
  pengurus,
  fetchPengurus,
  getImageUrl,
  profil,
  setProfil,
  adminUser,
  setAdminUser,
  news, // Prop untuk data berita
  fetchNews, // Prop untuk fungsi refresh berita
}) => {
  const [activeTab, setActiveTab] = useState("profilAdmin");

  const renderContent = () => {
    switch (activeTab) {
      case "profilAdmin":
        return (
          <AdminProfileEditor
            adminUser={adminUser}
            setAdminUser={setAdminUser}
            API_URL={API_URL}
          />
        );
      case "profilBumdes":
        return (
          <ProfilBumdesEditor
            profil={profil}
            setProfil={setProfil}
            getImageUrl={getImageUrl}
            API_URL={API_URL}
          />
        );
      case "pengurus":
        return (
          <PengurusEditor
            pengurus={pengurus}
            fetchPengurus={fetchPengurus}
            getImageUrl={getImageUrl}
            API_URL={API_URL}
          />
        );
      case "produk":
        return (
          <ProductEditor
            products={products}
            refreshProducts={refreshProducts}
            API_URL={API_URL}
          />
        );
    // ⭐ CASE BARU: Menampilkan NewsEditor
      case "berita":
        return (
          <NewsEditor
            news={news}
            fetchNews={fetchNews}
            API_URL={API_URL}
          />
        );
      default:
        return <h2 className="text-xl">Selamat datang di Dashboard Admin!</h2>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-[Inter]">
      {/* Sidebar */}
      <div className="flex flex-col w-64 p-4 text-white bg-blue-800 shadow-2xl">
        <div className="pb-4 mb-8 text-3xl font-extrabold text-blue-200 border-b border-blue-700">
          BUMDes Admin Panel
        </div>

        {/* Profil admin singkat di sidebar */}
        <div className="flex items-center p-2 mb-6 bg-blue-700 rounded-lg">
          <img
            src={
              adminUser?.profile_image_url ||
              "https://placehold.co/40x40/ffffff/3B82F6?text=A"
            }
            alt="Admin"
            className="object-cover w-10 h-10 mr-3 border-2 border-white rounded-full"
          />
          <div>
            <p className="text-sm font-bold">{adminUser?.username || "Admin"}</p>
            <p className="text-xs text-blue-300">Online</p>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-grow">
          <NavItem
            text="Profil Admin"
            label="Profil Admin"
            icon="🛠️"
            active={activeTab === "profilAdmin"}
            onClick={() => setActiveTab("profilAdmin")}
            style ={{ 
        // Warna saat aktif tetap '#00698f'
              color: activeTab === "profilAdmin" ? '#00698f' : '#ffffff',
        // ^^^ Nilai ini adalah warna default/awal
    }}
            />
          <NavItem
            text="Profil BUMDes"
            label="Profil BUMDes"
            icon="🏢"
            active={activeTab === "profilBumdes"}
            onClick={() => setActiveTab("profilBumdes")}
          />
          <NavItem
            text="Pengurus"
            label="Pengurus"
            icon="👥"
            active={activeTab === "pengurus"}
            onClick={() => setActiveTab("pengurus")}
          />
          <NavItem
            text="Produk"
            label="Produk"
            icon="📦"
            active={activeTab === "produk"}
            onClick={() => setActiveTab("produk")}
          />
            {/* ⭐ NAVITEM BARU UNTUK BERITA */}
            <NavItem
            text="Berita & Aktivitas"
            label="Berita & Aktivitas"
            icon="📰"
            active={activeTab === "berita"}
            onClick={() => setActiveTab("berita")}
          />
        </nav>

        {/* Tombol logout & kembali */}
        <div className="pt-4 mt-auto border-t border-blue-700">
          <button
            onClick={handleAdminLogout}
            className="w-full px-4 py-3 font-semibold text-red-100 transition duration-150 bg-red-600 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
          <button
            onClick={() => setPage("public")}
            className="w-full px-4 py-2 mt-2 text-sm text-white transition duration-150 border border-white rounded-lg hover:bg-blue-700"
          >
            Lihat Website Publik
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;