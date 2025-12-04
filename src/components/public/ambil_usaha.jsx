import { useEffect, useState } from "react";

export default function ProfilBumdes() {
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    fetch("http://localhost/backend/ambil_profil.php")
      .then((res) => res.json())
      .then((data) => setProfil(data))
      .catch((err) => console.error(err));
  }, []);

  if (!profil) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profil.nama_desa}</h1>
      <p>{profil.deskripsi}</p>
      <p><b>Kontak:</b> {profil.kontak}</p>
      <p><b>Email:</b> {profil.email}</p>
    </div>
  );
}
