// generate_hash.js
import bcrypt from 'bcrypt';
// Gunakan password yang sama dan SALT_ROUNDS=10
const plainPassword = 'admin123'; 
const saltRounds = 10; 

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Gagal menghasilkan hash:", err);
        return;
    }
    console.log("Username: testadmin");
    console.log("Password Hash BCrypt BARU (SALIN SEMUA INI):");
    console.log(hash); 
});