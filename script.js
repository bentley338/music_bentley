// Import Firebase SDKs yang sangat minimal untuk autentikasi
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Konfigurasi Firebase Anda (SUDAH SAYA TEMPELKAN DI SINI) ---
    // Ini adalah konfigurasi yang Anda berikan:
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

    let auth; // Variabel untuk instance Auth Firebase

    try {
        // Inisialisasi Firebase
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("Firebase App dan Auth berhasil diinisialisasi.");

        // Listener untuk perubahan status autentikasi
        // Ini akan berjalan setiap kali status login berubah (termasuk saat sign in anonim)
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Jika pengguna sudah terautentikasi (anonim atau lainnya)
                console.log("------------------------------------------");
                console.log("SELAMAT! UID ANDA BERHASIL DIDAPATKAN:");
                console.log("UID Admin Anda (SALIN KODE INI PERSIS!):", user.uid);
                console.log("------------------------------------------");

            } else {
                // Jika pengguna belum terautentikasi, coba sign in anonim
                console.log("Mencoba sign in anonim...");
                try {
                    await signInAnonymously(auth);
                    console.log("Sign in anonim berhasil.");
                } catch (error) {
                    console.error("Gagal sign in anonim:", error);
                    console.log("Pastikan Authentication 'Anonymous' sudah diaktifkan di Firebase Console > Build > Authentication.");
                }
            }
        });

    } catch (error) {
        console.error("Gagal menginisialisasi Firebase secara keseluruhan:", error);
        console.log("Pastikan objek firebaseConfig Anda di script.js benar dan tidak ada typo atau karakter yang salah.");
    }
});
