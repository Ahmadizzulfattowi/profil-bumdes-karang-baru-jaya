import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Hapus import initializeApp yang duplikat

// Your web app's Firebase configuration
export const firebaseConfig = { // Pastikan ini di-export
  apiKey: "AIzaSyAFcoNyrAcExnJyTRnd_8WFB6sZ87rKK8s",
  authDomain: "bumdes-karang-baru.firebaseapp.com",
  projectId: "bumdes-karang-baru",
  storageBucket: "bumdes-karang-baru.firebasestorage.app",
  messagingSenderId: "68216800365",
  appId: "1:68216800365:web:7c0b95785a03ba4bfa2b64",
  measurementId: "G-S4FJR53WHN"
};

// Initialize Firebase (Pola Singleton untuk mencegah inisialisasi ganda)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Logic Anonymous Login dan SetPersistence
(async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const user = await signInAnonymously(auth);
    console.log("✅ Login anonim berhasil:", user.user.uid);
  } catch (err) {
    console.error("❌ Gagal login anonim:", err);
  }
})();

// Ekspor semua objek yang sudah diinisialisasi
export { app, db, auth };

// Opsional: Jika Anda ingin menggunakan authReadyPromise di App.jsx
// export const authReadyPromise = new Promise((resolve) => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     unsubscribe();
//     resolve(user !== null);
//   });
// });