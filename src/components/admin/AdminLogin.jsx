// components/admin/AdminLogin.jsx
import React, { useState } from "react";
import InputField from "../fields/InputField";

const API_URL = "https://bumdes-karang-baru-jaya.vercel.app";

const AdminLogin = ({ setIsAdminLoggedIn, setPage, setAdminUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdminLoggedIn(true);
        setPage("admin");
        setAdminUser(data.user);
        console.log("✅ Admin berhasil login");
      } else {
        setError(data.message || "Login gagal. Coba lagi.");
      }
    } catch (err) {
      console.error("Kesalahan saat login:", err);
      setError("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[Inter]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 space-y-6 bg-white shadow-2xl rounded-xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          BUMDes Login
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <InputField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required={true}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />

        <button
          type="submit"
          className="w-full px-4 py-3 text-lg font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Masuk Dashboard
        </button>

        <button
          type="button"
          onClick={() => setPage("public")}
          className="w-full px-4 py-2 text-sm text-gray-600 transition duration-150 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          ← Kembali ke Website Publik
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
