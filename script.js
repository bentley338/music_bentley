// Import Firebase SDKs yang dibutuhkan untuk login Email/Password
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI FIREBASE ANDA (SAYA TEMPELKAN PERSIS DARI YANG ANDA BERIKAN) ---
    const firebaseConfig = {
        apiKey: "AIzaSyBlG2wzbUshZAUxLaP8-WGpYSkdm1FhMh4",
        authDomain: "melodyverse-app.firebaseapp.com",
        projectId: "melodyverse-app",
        storageBucket: "melodyverse-app.firebasestorage.app",
        messagingSenderId: "150568860733",
        appId: "1:150568860733:web:3a0fcce02aa16e57663e54",
        measurementId: "G-JB2RKBQP33"
    };
    // --- AKHIR KONFIGURASI FIREBASE ---

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const uidDisplay = document.getElementById('uidDisplay');
    const errorDisplay = document.getElementById('errorDisplay');

    let auth; // Variabel untuk instance Auth Firebase

    try {
        // Inisialisasi Firebase App
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app); // Dapatkan instance Authentication
        console.log("Firebase App dan Auth berhasil diinisialisasi.");

        // Listener untuk perubahan status autentikasi
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Jika pengguna sudah terautentikasi
                const uid = user.uid;
                uidDisplay.textContent = `UID Anda: ${uid}`;
                console.log("------------------------------------------");
                console.log("SELAMAT! UID ANDA BERHASIL DIDAPATKAN:");
                console.log("UID Admin Anda (SALIN KODE INI PERSIS!):", uid);
                console.log("------------------------------------------");
                errorDisplay.textContent = ""; // Hapus pesan error jika berhasil

            } else {
                // Pengguna belum terautentikasi atau logout
                uidDisplay.textContent = "UID Anda akan muncul di sini (dan di konsol).";
                console.log("Pengguna belum login.");
            }
        });

        // Event listener untuk tombol Login
        loginBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            errorDisplay.textContent = ""; // Bersihkan pesan error sebelumnya

            if (!email || !password) {
                errorDisplay.textContent = "Email dan password tidak boleh kosong.";
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                // Login berhasil, onAuthStateChanged akan menangani tampilan UID
                console.log("Login berhasil!");
            } catch (error) {
                console.error("Gagal login:", error);
                let errorMessage = "Gagal login. Periksa email/password Anda.";
                if (error.code === 'auth/user-not-found') {
                    errorMessage = "Pengguna tidak ditemukan. Pastikan email terdaftar.";
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = "Password salah. Coba lagi.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Format email tidak valid.";
                }
                errorDisplay.textContent = errorMessage;
                console.log("Kode Error:", error.code);
                console.log("Pesan Error:", error.message);
            }
        });

    } catch (error) {
        console.error("Gagal menginisialisasi Firebase secara keseluruhan:", error);
        errorDisplay.textContent = "Kesalahan fatal saat inisialisasi Firebase. Cek konsol.";
        console.log("Pastikan objek firebaseConfig Anda di script.js benar dan tidak ada typo.");
    }
});
