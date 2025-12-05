// server.js (LENGKAP DAN TERBARU)

import express from "express";
import mysql2 from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Konfigurasi Database (WAJIB DIUBAH) ---


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});


db.connect((err) => {
  if (err) {
    console.error("Gagal terhubung ke database:", err.stack);
    return;
  }
  console.log("Terhubung ke database MySQL sebagai id", db.threadId);
});

API_URL=https://bumdes-karang-baru-jaya.vercel.app
const SALT_ROUNDS = 10; 

// --- Konfigurasi File Upload ---

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'images');

// Cek dan buat folder images jika belum ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(express.static(PUBLIC_DIR));

// Fungsi untuk membuat nama file unik
const createUniqueFilename = (originalName) => {
    const ext = path.extname(originalName);
    const basename = path.basename(originalName, ext);
    return `${basename}-${Date.now()}${ext}`;
};

// Konfigurasi Multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, createUniqueFilename(file.originalname));
  },
});

const upload = multer({ storage: storage });

// =========================================================================
// --- ENDPOINT ADMIN LOGIN & PROFILE ---
// =========================================================================

// Endpoint Inisialisasi Admin (Hanya untuk setup awal)
app.post("/setup-admin", async (req, res) => {
    // Gunakan fungsi ini untuk membuat user admin awal jika tabel kosong
    // Username: admin, Password: password123
    const qCheck = "SELECT COUNT(*) AS count FROM admin_users";
    db.query(qCheck, async (err, result) => {
        if (err) return res.status(500).json(err);
        if (result[0].count > 0) {
            return res.status(400).json({ message: "Admin user sudah ada. Gunakan /login." });
        }

        const username = 'admin';
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const qInsert = "INSERT INTO admin_users (`username`, `password_hash`) VALUES (?, ?)";
        
        db.query(qInsert, [username, passwordHash], (err, data) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Admin user berhasil dibuat. Username: admin, Password: password123" });
        });
    });
});

// 1. POST /login: Admin Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const q = "SELECT * FROM admin_users WHERE username = ?";

    db.query(q, [username], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(401).json({ message: "Username tidak ditemukan." });

        const user = data[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) return res.status(401).json({ message: "Password salah." });

        // Login Berhasil
        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                profile_image_url: user.profile_image_url ? `${API_URL}/images/${user.profile_image_url}` : null
            }
        });
    });
});

// 2. PUT /admin/profile/:id: Update Profil Admin
app.put("/admin/profile/:id", upload.single('profile_image'), (req, res) => {
    const adminId = req.params.id;
    const { username, old_password, new_password } = req.body;
    const profileImageFile = req.file;
    let oldImageFilename = null;

    // 1. Ambil data user saat ini
    const qSelect = "SELECT password_hash, profile_image_url FROM admin_users WHERE id = ?";
    db.query(qSelect, [adminId], async (err, result) => {
        if (err) {
            if (profileImageFile) fs.unlinkSync(profileImageFile.path); // Hapus file jika ada error
            return res.status(500).json({ error: "Gagal mencari data user: " + err.message });
        }
        if (result.length === 0) {
            if (profileImageFile) fs.unlinkSync(profileImageFile.path); 
            return res.status(404).json({ message: "Admin tidak ditemukan." });
        }
        
        const user = result[0];
        oldImageFilename = user.profile_image_url;
        let updateFields = [];
        let updateValues = [];

        // Cek dan tambahkan username jika berubah
        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }

        // Cek dan proses password baru
        if (new_password) {
            // Validasi password lama
            const match = await bcrypt.compare(old_password, user.password_hash);
            if (!match) {
                if (profileImageFile) fs.unlinkSync(profileImageFile.path);
                return res.status(401).json({ message: "Kata Sandi Lama tidak valid." });
            }
            // Hash password baru
            const newPasswordHash = await bcrypt.hash(new_password, SALT_ROUNDS);
            updateFields.push('password_hash = ?');
            updateValues.push(newPasswordHash);
        }

        // Tambahkan foto profil baru
        if (profileImageFile) {
            updateFields.push('profile_image_url = ?');
            updateValues.push(profileImageFile.filename);
        }

        if (updateFields.length === 0) {
             if (profileImageFile) fs.unlinkSync(profileImageFile.path);
             return res.status(400).json({ message: "Tidak ada data yang diubah." });
        }
        
        // 2. Eksekusi query UPDATE
        const qUpdate = `UPDATE admin_users SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(adminId);

        db.query(qUpdate, updateValues, (err, updateResult) => {
            if (err) {
                if (profileImageFile) fs.unlinkSync(profileImageFile.path);
                return res.status(500).json({ error: "Gagal update profil: " + err.message });
            }

            // 3. Jika berhasil: Hapus foto lama jika ada foto baru
            if (profileImageFile && oldImageFilename) {
                const oldImagePath = path.join(UPLOAD_DIR, oldImageFilename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Gagal menghapus file lama:", unlinkErr);
                    });
                }
            }
            
            // 4. Ambil data user yang baru diupdate
            const qUpdated = "SELECT id, username, profile_image_url FROM admin_users WHERE id = ?";
            db.query(qUpdated, [adminId], (err, updatedResults) => {
                 if (err || updatedResults.length === 0) return res.status(500).json({ error: "Gagal mengambil data baru." });
                
                const updatedUser = updatedResults[0];
                res.json({ 
                    message: "Profil Admin berhasil diperbarui", 
                    user: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        profile_image_url: updatedUser.profile_image_url ? `${API_URL}/images/${updatedUser.profile_image_url}` : null
                    }
                });
            });
        });
    });
});


// =========================================================================
// --- ENDPOINT BERITA & AKTIVITAS (Admin) ---
// =========================================================================

// 1. POST /admin/news: Menambah berita baru
app.post("/admin/news", (req, res) => {
    const { judul, isi, tanggal } = req.body;
    
    if (!judul || !isi || !tanggal) {
        return res.status(400).json({ message: "Judul, isi, dan tanggal wajib diisi." });
    }

    // Perhatian: Pastikan tanggal dalam format YYYY-MM-DD
    const q = "INSERT INTO berita (`judul`, `isi`, `tanggal`) VALUES (?, ?, ?)";
    const values = [judul, isi, tanggal];
    
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Gagal menyimpan berita: " + err.message });
        res.json({ message: "Berita berhasil ditambahkan.", id: data.insertId });
    });
});

// 2. GET /admin/news/:id: Mengambil detail berita (untuk edit)
app.get("/admin/news/:id", (req, res) => {
    const newsId = req.params.id;
    const q = "SELECT id, judul, isi, tanggal FROM berita WHERE id = ?";
    
    db.query(q, [newsId], (err, data) => {
        if (err) return res.status(500).json({ error: "Gagal mengambil detail berita: " + err.message });
        if (data.length === 0) return res.status(404).json({ message: "Berita tidak ditemukan." });
        
        res.json(data[0]);
    });
});

// 3. PUT /admin/news/:id: Memperbarui berita
app.put("/admin/news/:id", (req, res) => {
    const newsId = req.params.id;
    const { judul, isi, tanggal } = req.body;

    if (!judul || !isi || !tanggal) {
        return res.status(400).json({ message: "Judul, isi, dan tanggal wajib diisi." });
    }
    
    const q = "UPDATE berita SET `judul` = ?, `isi` = ?, `tanggal` = ? WHERE id = ?";
    const values = [judul, isi, tanggal, newsId];
    
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Gagal memperbarui berita: " + err.message });
        if (data.affectedRows === 0) return res.status(404).json({ message: "Berita tidak ditemukan." });

        res.json({ message: "Berita berhasil diperbarui." });
    });
});

// 4. DELETE /admin/news/:id: Menghapus berita
app.delete("/admin/news/:id", (req, res) => {
    const newsId = req.params.id;
    
    const q = "DELETE FROM berita WHERE id = ?";
    
    db.query(q, [newsId], (err, data) => {
        if (err) return res.status(500).json({ error: "Gagal menghapus berita: " + err.message });
        if (data.affectedRows === 0) return res.status(404).json({ message: "Berita tidak ditemukan." });
        
        res.json({ message: "Berita berhasil dihapus." });
    });
});


// =========================================================================
// --- ENDPOINT PENGURUS BUMDES (PASTIKAN SEMUA ADA) ---
// =========================================================================

// 1. GET /pengurus: Mengambil semua data pengurus
app.get("/pengurus", (req, res) => {
    const q = "SELECT * FROM pengurus ORDER BY id ASC";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// 2. POST /pengurus: Menambah pengurus baru
app.post("/pengurus", upload.single('image'), (req, res) => {
    const { name, position } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !position || !image_url) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Nama, posisi, dan foto wajib diisi." });
    }

    const q = "INSERT INTO pengurus (`name`, `position`, `imageUrl`) VALUES (?, ?, ?)";
    const values = [name, position, image_url];
    
    db.query(q, values, (err, data) => {
        if (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(500).json(err);
        }
        res.json({ message: "Pengurus berhasil ditambahkan.", id: data.insertId });
    });
});

// 3. PUT /pengurus/:id: Memperbarui pengurus (TELAH DIPERBAIKI)
app.put("/pengurus/:id", upload.single('image'), (req, res) => {
    const memberId = req.params.id;
    // Tambahkan clearImage dari body untuk menghapus foto
    const { name, position, clearImage } = req.body; 
    const newImageFile = req.file;
    let oldImageFilename = null;

    // --- VALIDASI UNTUK NOT NULL ---
    if (!name || name.trim() === "") {
        if (newImageFile) fs.unlinkSync(newImageFile.path);
        return res.status(400).json({ message: "Nama pengurus wajib diisi." });
    }
    if (!position || position.trim() === "") {
        if (newImageFile) fs.unlinkSync(newImageFile.path);
        return res.status(400).json({ message: "Posisi/Jabatan pengurus wajib diisi." });
    }
    // ---------------------------------

    // 1. Ambil data lama untuk cek image_url
    const qSelect = "SELECT imageUrl FROM pengurus WHERE id = ?";
    db.query(qSelect, [memberId], (err, result) => {
        if (err) {
             if (newImageFile) fs.unlinkSync(newImageFile.path);
             return res.status(500).json({ error: "Gagal mencari data lama: " + err.message });
        }
        if (result.length === 0) {
             if (newImageFile) fs.unlinkSync(newImageFile.path);
             return res.status(404).json({ message: "Pengurus tidak ditemukan." });
        }
        
        oldImageFilename = result[0].imageUrl; // Pastikan menggunakan imageUrl, bukan image_url

        let updateFields = [];
        let updateValues = [];
        let shouldDeleteOldImage = false;

        // name dan position selalu diupdate karena sudah divalidasi tidak kosong
        updateFields.push('name = ?');
        updateValues.push(name);
        
        updateFields.push('position = ?');
        updateValues.push(position);

        if (newImageFile) {
            // Case 1: Upload foto baru
            updateFields.push('imageUrl = ?');
            updateValues.push(newImageFile.filename);
            shouldDeleteOldImage = true;
        } else if (clearImage === 'true' && oldImageFilename) { 
            // Case 2: Hapus foto lama (Client mengirim clearImage: 'true')
            updateFields.push('imageUrl = ?'); 
            updateValues.push(null); // Set ke NULL di database
            shouldDeleteOldImage = true;
        } 
        // Case 3: Tidak ada foto baru dan tidak ada permintaan clear -> imageUrl tidak diubah.

        if (updateFields.length === 0) {
             if (newImageFile) fs.unlinkSync(newImageFile.path);
             // Seharusnya tidak tercapai karena name dan position selalu ada
             return res.status(400).json({ message: "Tidak ada data yang diubah." });
        }

        // 2. Eksekusi query UPDATE
        const qUpdate = `UPDATE pengurus SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(memberId);

        db.query(qUpdate, updateValues, (err, updateResult) => {
            if (err) {
                 if (newImageFile) fs.unlinkSync(newImageFile.path);
                 return res.status(500).json({ error: "Gagal update pengurus: " + err.message });
            }

            // 3. Jika berhasil: Hapus foto lama jika ada foto baru ATAU jika dikosongkan
            if (shouldDeleteOldImage && oldImageFilename) {
                const oldImagePath = path.join(UPLOAD_DIR, oldImageFilename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Gagal menghapus file lama:", unlinkErr);
                    });
                }
            }
            
            res.json({ message: "Pengurus berhasil diperbarui." });
        });
    });
});

// 4. DELETE /pengurus/:id: Menghapus pengurus
app.delete("/pengurus/:id", (req, res) => {
    const memberId = req.params.id;

    // 1. Ambil data lama untuk mendapatkan nama file gambar
    const qSelect = "SELECT imageUrl FROM pengurus WHERE id = ?";
    db.query(qSelect, [memberId], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal mencari data lama: " + err.message });
        if (result.length === 0) return res.status(404).json({ message: "Pengurus tidak ditemukan." });
        
        const oldImageFilename = result[0].imageUrl;

        // 2. Eksekusi query DELETE
        const qDelete = "DELETE FROM pengurus WHERE id = ?";
        db.query(qDelete, [memberId], (err, data) => {
            if (err) return res.status(500).json({ error: "Gagal menghapus pengurus: " + err.message });

            // 3. Jika berhasil: Hapus file gambar lama
            if (oldImageFilename) {
                const oldImagePath = path.join(UPLOAD_DIR, oldImageFilename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Gagal menghapus file lama:", unlinkErr);
                    });
                }
            }

            res.json({ message: "Pengurus berhasil dihapus." });
        });
    });
});


// =========================================================================
// --- ENDPOINT LAIN (Produk, Profil BUMDes) ---
// =========================================================================

// --- ENDPOINT PRODUK (Asumsikan sudah ada) ---

// 1. GET /products: Mengambil semua produk
app.get("/products", (req, res) => {
    const q = "SELECT * FROM produk ORDER BY id DESC";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// 2. POST /products: Menambah produk baru
app.post("/products", (req, res) => {
    const { name, description, imageUrl, isTop } = req.body;
    const q = "INSERT INTO produk (`name`, `description`, `imageUrl`, `isTop`) VALUES (?, ?, ?, ?)";
    const values = [name, description, imageUrl, isTop];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Produk berhasil ditambahkan.");
    });
});

// 3. PUT /products/:id: Memperbarui produk
app.put("/products/:id", (req, res) => {
    const productId = req.params.id;
    const { name, description, imageUrl, isTop } = req.body;
    const q = "UPDATE produk SET `name` = ?, `description` = ?, `imageUrl` = ?, `isTop` = ? WHERE id = ?";
    const values = [name, description, imageUrl, isTop, productId];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Produk berhasil diperbarui.");
    });
});

// 4. DELETE /products/:id: Menghapus produk
app.delete("/products/:id", (req, res) => {
    const productId = req.params.id;
    const q = "DELETE FROM produk WHERE id = ?";
    db.query(q, [productId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Produk berhasil dihapus.");
    });
});

// 5. PATCH /products/:id/toggle-top: Mengubah status unggulan
app.patch("/products/:id/toggle-top", (req, res) => {
    const productId = req.params.id;
    const { isTop } = req.body;
    const q = "UPDATE produk SET `isTop` = ? WHERE id = ?";
    db.query(q, [isTop, productId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json("Status unggulan berhasil diubah.");
    });
});


// --- ENDPOINT PROFIL BUMDES (Asumsikan sudah ada) ---

// 1. GET /profil: Mengambil data profil BUMDes
app.get("/profil", (req, res) => {
    const q = "SELECT * FROM profil_bumdes WHERE id = 1"; // Asumsi hanya ada 1 baris
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) {
            // Jika kosong, kembalikan objek default agar frontend tidak error
            return res.json({ id: 1, nama_bumdes: "BUMDes Default", slogan: "Slogan Default" });
        }
        res.json(data[0]);
    });
});

// 2. PUT /profil: Memperbarui data profil BUMDes
app.put("/profil", upload.fields([
    { name: 'logo_file', maxCount: 1 },
    { name: 'background_file', maxCount: 1 }
]), (req, res) => {
    const { nama_bumdes, slogan, deskripsi_singkat, misi, kontak, email, alamat } = req.body;
    const logoFile = req.files && req.files['logo_file'] ? req.files['logo_file'][0] : null;
    const backgroundFile = req.files && req.files['background_file'] ? req.files['background_file'][0] : null;
    
    // Asumsi ID profil selalu 1
    const profileId = 1; 

    // Ambil data lama untuk menghapus file lama
    const qSelect = "SELECT logo_url, background_url FROM profil_bumdes WHERE id = ?";
    db.query(qSelect, [profileId], (err, result) => {
        if (err) {
             if (logoFile) fs.unlinkSync(logoFile.path);
             if (backgroundFile) fs.unlinkSync(backgroundFile.path);
             return res.status(500).json({ error: "Gagal mencari data lama: " + err.message });
        }
        if (result.length === 0) {
             if (logoFile) fs.unlinkSync(logoFile.path);
             if (backgroundFile) fs.unlinkSync(backgroundFile.path);
             return res.status(404).json({ message: "Profil BUMDes tidak ditemukan." });
        }
        
        const oldData = result[0];
        
        let updateFields = [];
        let updateValues = [];
        
        // Tambahkan field-field teks
        updateFields.push('nama_bumdes = ?', 'slogan = ?', 'deskripsi_singkat = ?', 'misi = ?', 'kontak = ?', 'email = ?', 'alamat = ?');
        updateValues.push(nama_bumdes, slogan, deskripsi_singkat, misi, kontak, email, alamat);

        // Tambahkan field logo jika ada file baru
        if (logoFile) {
            updateFields.push('logo_url = ?');
            updateValues.push(logoFile.filename);
        }

        // Tambahkan field background jika ada file baru
        if (backgroundFile) {
            updateFields.push('background_url = ?');
            updateValues.push(backgroundFile.filename);
        }

        // 2. Eksekusi query UPDATE
        const qUpdate = `UPDATE profil_bumdes SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(profileId); // ID untuk WHERE

        db.query(qUpdate, updateValues, (err, updateResult) => {
            if (err) {
                 if (logoFile) fs.unlinkSync(logoFile.path);
                 if (backgroundFile) fs.unlinkSync(backgroundFile.path);
                 return res.status(500).json({ error: "Gagal update profil: " + err.message });
            }

            // 3. Hapus file lama jika ada file baru
            const deleteOldFile = (filename) => {
                if (filename) {
                    const oldImagePath = path.join(UPLOAD_DIR, filename);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlink(oldImagePath, (unlinkErr) => {
                            if (unlinkErr) console.error("Gagal menghapus file lama:", unlinkErr);
                        });
                    }
                }
            };

            if (logoFile) deleteOldFile(oldData.logo_url);
            if (backgroundFile) deleteOldFile(oldData.background_url);
            
            res.json({ message: "Profil BUMDes berhasil diperbarui." });
        });
    });
});


// --- ENDPOINT PUBLIK (Public API) ---

// Endpoint 1: Mendapatkan Profil BUMDes
app.get("/api/profil", (req, res) => {
  const q = "SELECT * FROM profil_bumdes WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      // Pastikan logo_url dan background_url diubah menjadi URL lengkap
      const profilData = data[0];
      profilData.logo_url = profilData.logo_url ? `${API_URL}/images/${profilData.logo_url}` : null;
      profilData.background_url = profilData.background_url ? `${API_URL}/images/${profilData.background_url}` : null;
      return res.json(profilData);
    } else {
      // Mengembalikan data default jika tabel kosong
      return res.json({});
    }
  });
});

// Endpoint 2: Mendapatkan Daftar Pengurus
app.get("/api/pengurus", (req, res) => {
  const q = "SELECT id, name, position, imageUrl, periode FROM pengurus ORDER BY position_order ASC";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    // Mengubah imageUrl menjadi URL lengkap di sini jika diperlukan,
    // tetapi karena komponen PublicHomePage menggunakan getImageUrl(p.imageUrl) 
    // yang asumsikan p.imageUrl berisi nama file, maka tidak perlu diubah di sini.
    // Jika Anda ingin mengubahnya di backend:
    const formattedData = data.map(p => ({
        ...p,
        imageUrl: p.imageUrl ? `${API_URL}/images/${p.imageUrl}` : null
    }));
    return res.json(formattedData);
  });
});

// Endpoint 3: Mendapatkan Daftar Produk Unggulan
app.get("/api/products", (req, res) => {
  const q = "SELECT id, name, description, price, imageUrl, isTop FROM produk WHERE isPublic = TRUE ORDER BY isTop DESC, id DESC";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    // Asumsikan produk menyimpan URL lengkap atau akan diproses di frontend.
    return res.json(data);
  });
});

// Endpoint 4: Mendapatkan Berita & Aktivitas Terbaru
app.get("/api/news", (req, res) => {
  const q = "SELECT id, judul AS title, LEFT(isi, 200) AS summary, tanggal AS date FROM berita ORDER BY tanggal DESC LIMIT 6";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "Gagal mengambil data berita: " + err.message });
    
    const formattedNews = data.map(berita => ({
        id: berita.id,
        title: berita.title,
        // Tambahkan elipsis jika ringkasan dipotong
        summary: berita.summary.length === 200 && berita.summary.length === berita.isi.length ? berita.summary.substring(0, 197) + '...' : berita.summary,
        date: berita.date 
    }));
    
    return res.json(formattedNews);
  });
});

// --- START SERVER ---


