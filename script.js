document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const currentAlbumArt = document.getElementById('current-album-art');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentArtistName = document.getElementById('current-artist-name');

    // Variabel state
    let isPlaying = false; // Status pemutaran

    // --- DATA LAGU (HANYA SATU LAGU: BACK TO FRIENDS - SOMBR) ---
    // Pastikan nama file di sini sama persis dengan yang ada di folder Anda.
    const songs = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "music/back_to_friends.mp3",          // Pastikan nama file MP3 ini di folder 'music'
            albumArt: "images/album_art_back_to_friends.jpg" // Pastikan nama file JPG/PNG ini di folder 'images'
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar
    function loadSong(songIndex) {
        const song = songs[songIndex];
        audioPlayer.src = song.src;
        currentAlbumArt.src = song.albumArt;
        currentSongTitle.textContent = song.title;
        currentArtistName.textContent = song.artist;

        // Reset progress bar dan waktu
        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        // Setel ulang animasi album art saat lagu baru dimuat
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animation = 'none';
            void albumArtImg.offsetWidth; // Memicu reflow browser
            albumArtImg.style.animation = ''; // Mengatur ulang animasi yang ada di CSS
        }
    }

    // Memutar lagu
    function playSong() {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Ikon Pause
        playPauseBtn.setAttribute('aria-label', 'Pause');
        // Aktifkan animasi putar untuk album art jika ada
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'running'; // Lanjutkan animasi jika ada
        }
    }

    // Menjeda lagu
    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Ikon Play
        playPauseBtn.setAttribute('aria-label', 'Play');
        // Jeda animasi putar untuk album art
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'paused'; // Jeda animasi
        }
    }

    // Memformat waktu (menit:detik)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    // --- Event Listeners ---

    // Toggle Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Update progress bar dan waktu saat lagu berjalan
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    // Set durasi total lagu saat metadata dimuat
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
        // Jika auto-play diharapkan setelah dimuat, panggil playSong() di sini
        // Misalnya: playSong(); // Hapus komentar ini jika ingin autoplay
    });

    // Pindah posisi lagu dengan progress bar
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Otomatis putar ulang lagu saat selesai (karena hanya 1 lagu)
    audioPlayer.addEventListener('ended', () => {
        audioPlayer.currentTime = 0; // Reset ke awal
        playSong(); // Putar ulang
    });

    // --- Inisialisasi Aplikasi ---
    // Muat lagu pertama (dan satu-satunya) saat halaman dimuat
    loadSong(currentSongIndex);
});