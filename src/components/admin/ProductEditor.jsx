// components/admin/ProductEditor.jsx
import React, { useState } from "react";
import InputField from "../fields/InputField";
import TextAreaField from "../fields/TextAreaField";

const ProductCard = ({ product, refreshProducts, API_URL }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [isTop, setIsTop] = useState(product.isTop);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const updatedProduct = { name, description, imageUrl, isTop: isTop ? 1 : 0 };

    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setMessage("✅ Produk diperbarui.");
        refreshProducts();
        setIsEditing(false);
      } else {
        const data = await response.json();
        setMessage(`❌ Gagal update: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus produk: ${product.name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessage("✅ Produk dihapus.");
        refreshProducts();
      } else {
        const data = await response.json();
        setMessage(`❌ Gagal hapus: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  const handleToggleTop = async () => {
    const newTopStatus = !isTop;

    try {
      const response = await fetch(`${API_URL}/products/${product.id}/toggle-top`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTop: newTopStatus ? 1 : 0 }),
      });

      if (response.ok) {
        setIsTop(newTopStatus);
        refreshProducts();
        setMessage(
          `✅ Status unggulan diubah menjadi ${newTopStatus ? "YA" : "TIDAK"}.`
        );
      } else {
        const data = await response.json();
        setMessage(`❌ Gagal ubah status: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="p-4 space-y-3 border-l-4 border-yellow-500 rounded-lg shadow-lg bg-yellow-50"
      >
        <h4 className="text-lg font-bold text-yellow-800">Edit Produk</h4>
        {message && (
          <div
            className={`p-2 text-xs rounded ${
              message.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <InputField
          label="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <TextAreaField
          label="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />
        <InputField
          label="URL Gambar (Mock)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isTop}
            onChange={(e) => setIsTop(e.target.checked)}
            className="text-blue-600 rounded"
          />
          <label className="text-sm">Produk Unggulan</label>
        </div>
        <div className="flex pt-2 space-x-2">
          <button
            type="submit"
            className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-md border ${
        product.isTop ? "bg-yellow-100 border-yellow-500" : "bg-white border-gray-200"
      }`}
    >
      <h4 className="text-lg font-bold">{product.name}</h4>
      <p className="mb-2 text-sm text-gray-600">{product.description}</p>
      <p className="text-xs font-semibold text-red-500">
        {product.isTop ? "⭐ Produk Unggulan" : "Produk Biasa"}
      </p>

      <div className="flex mt-3 space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
        >
          Hapus
        </button>
        <button
          onClick={handleToggleTop}
          className="px-2 py-1 text-xs text-blue-700 border border-blue-700 rounded hover:bg-blue-50"
        >
          {product.isTop ? "Hapus Unggulan" : "Jadikan Unggulan"}
        </button>
      </div>
    </div>
  );
};

const ProductCreator = ({ refreshProducts, API_URL }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isTop, setIsTop] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    const newProduct = { name, description, imageUrl, isTop: isTop ? 1 : 0 };

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setMessage("✅ Produk baru ditambahkan.");
        refreshProducts();
        setName("");
        setDescription("");
        setImageUrl("");
        setIsTop(false);
      } else {
        const data = await response.json();
        setMessage(`❌ Gagal tambah: ${data.message || "Kesalahan server."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-inner font-[Inter]">
      <h4 className="mb-3 text-xl font-bold text-blue-700">Tambah Produk Baru</h4>
      {message && (
        <div
          className={`p-2 text-sm rounded-lg mb-4 ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-3">
        <InputField
          label="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <TextAreaField
          label="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />
        <InputField
          label="URL Gambar (Mock)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Misal: https://..."
        />
        <div className="flex items-center pt-2 space-x-2">
          <input
            type="checkbox"
            checked={isTop}
            onChange={(e) => setIsTop(e.target.checked)}
            className="text-blue-600 rounded"
          />
          <label className="text-sm text-gray-700">Jadikan Produk Unggulan</label>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Tambah Produk
        </button>
      </form>
    </div>
  );
};

const ProductEditor = ({ products, refreshProducts, API_URL }) => (
  <div className="font-[Inter]">
    <h3 className="pb-2 mb-6 text-2xl font-bold text-purple-700 border-b">
      Manajemen Produk BUMDes
    </h3>

    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
      <ProductCreator refreshProducts={refreshProducts} API_URL={API_URL} />

      <div className="col-span-2 p-6 bg-white rounded-lg shadow-xl">
        <h4 className="mb-4 text-xl font-bold text-purple-700">
          Daftar Produk ({products.length})
        </h4>
        <div className="pr-2 space-y-4 overflow-y-auto max-h-96">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              refreshProducts={refreshProducts}
              API_URL={API_URL}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProductEditor;
