document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const currentAlbumArt = document.getElementById('current-album-art');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentArtistName = document.getElementById('current-artist-name');
    const lyricsText = document.querySelector('.lyrics-text'); // Untuk menampilkan lirik statis
    const playlistUl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.getElementById('playlist-sidebar');

    // Variabel state
    let currentSongIndex = 0; // Index lagu saat ini
    let isPlaying = false; // Status pemutaran

    // --- DATA LAGU (SEKARANG ADA 3 LAGU) ---
    // NAMA FILE HARUS SAMA PERSIS DENGAN YANG ADA DI ROOT FOLDER ANDA!
    const songs = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3",
            albumArt: "album_art_back_to_friends.jpg",
            lyrics: `
                <b>🎶 Back to Friends – Sombr</b><br><br>
                <b>Verse 1</b><br>
                Touch my body tender<br>
                ’Cause the feeling makes me weak<br>
                Kicking off the covers<br>
                I see the ceiling while you’re looking down at me<br><br>
                <b>Chorus</b><br>
                How can we go back to being friends<br>
                When we just shared a bed?<br>
                How can you look at me and pretend<br>
                I’m someone you’ve never met?<br><br>
                <b>Verse 2</b><br>
                It was last December<br>
                You were layin’ on my chest<br>
                I still remember<br>
                I was scared to take a breath<br>
                Didn’t want you to move your head<br><br>
                <b>Chorus</b><br>
                How can we go back to being friends<br>
                When we just shared a bed?<br>
                How can you look at me and pretend<br>
                I’m someone you’ve never met?<br><br>
                <b>Bridge</b><br>
                The devil in your eyes<br>
                Won’t deny the lies you’ve sold<br>
                I’m holding on too tight<br>
                While you let go<br>
                This is casual<br><br>
                <b>Final Chorus</b><br>
                How can we go back to being friends<br>
                When we just shared a bed?<br>
                How can you look at me and pretend<br>
                I’m someone you’ve never met?<br>
                How can we go back to being friends<br>
                When we just shared a bed?<br>
                How can you look at me and pretend<br>
                I’m someone you’ve never met?<br>
                I’m someone you’ve never met<br>
                When we just shared a bed?
            `
        },
        {
            title: "Bergema Sampai Selamanya",
            artist: "Nadhif Basalamah",
            src: "bergema_sampai_selamanya.mp3",
            albumArt: "album_art_bergema_sampai_selamanya.jpg",
            lyrics: `
                <b>🎶 Bergema Sampai Selamanya – Nadhif Basalamah</b><br><br>
                <b>Verse 1</b><br>
                Dengarkan hati bicara<br>
                Di setiap desah napasmu<br>
                Ada cerita yang takkan pudar<br>
                Di setiap langkah kakimu<br><br>
                <b>Chorus</b><br>
                Bergema sampai selamanya<br>
                Cinta kita takkan sirna<br>
                Di setiap nada yang tercipta<br>
                Hanyalah namamu yang ada<br><br>
                <b>Verse 2</b><br>
                Waktu terus berjalan<br>
                Namun rasa ini takkan lekang<br>
                Seperti bintang yang takkan padam<br>
                Bersinarlah di setiap malam<br><br>
                <b>Chorus</b><br>
                Bergema sampai selamanya<br>
                Cinta kita takkan sirna<br>
                Di setiap nada yang tercipta<br>
                Hanyalah namamu yang ada<br><br>
                <b>Bridge</b><br>
                Tiada akhir bagi kisah kita<br>
                Terukir abadi di jiwa<br>
                Kan selalu ada, kan selalu nyata<br>
                Janji yang takkan pernah pudar<br><br>
                <b>Outro</b><br>
                Bergema... sampai selamanya...<br>
                Oh-oh-oh...
            `
        },
        {
            title: "Ride",
            artist: "SoMo",
            src: "ride.mp3",
            albumArt: "album_art_ride.jpg",
            lyrics: `
                <b>🎶 Ride – SoMo</b><br><br>
                <b>Verse 1</b><br>
                I'm riding high, I'm riding low<br>
                I'm going where the wind don't blow<br>
                Just cruising, feeling good tonight<br>
                Everything is working out just right<br><br>
                <b>Chorus</b><br>
                So baby, let's just ride<br>
                Leave the worries far behind<br>
                Every moment, every single stride<br>
                Yeah, we're living in the moment, you and I<br><br>
                <b>Verse 2</b><br>
                Sunrise creeping, morning light<br>
                Another day, another sight<br>
                No rush, no hurry, take it slow<br>
                Just enjoying the ride, you know<<br>br>
                <b>Chorus</b><br>
                So baby, let's just ride<br>
                Leave the worries far behind<br>
                Every moment, every single stride<br>
                Yeah, we're living in the moment, you and I<br><br>
                <b>Bridge</b><br>
                Don't look back, no regrets<br>
                Just open roads and sunsets<br>
                This feeling's more than I can say<br>
                Let's keep on riding, come what may<br><br>
                <b>Chorus</b><br>
                So baby, let's just ride<br>
                Leave the worries far behind<br>
                Every moment, every single stride<br>
                Yeah, we're living in the moment, you and I<br><br>
                <b>Outro</b><br>
                Just ride, ride, ride<br>
                With you by my side<br>
                Yeah, we ride...
            `
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
        lyricsText.innerHTML = song.lyrics; // Mengupdate lirik untuk lagu yang dimuat

        // Reset progress bar dan waktu
        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        // Setel ulang animasi album art saat lagu baru dimuat
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animation = 'none';
            void albumArtImg.offsetWidth;
            albumArtImg.style.animation = '';
        }
        // Update active class di playlist
        updatePlaylistActiveState(songIndex);
    }

    // Memutar lagu
    function playSong() {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Ikon Pause
        playPauseBtn.setAttribute('aria-label', 'Pause');
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'running';
        }
    }

    // Menjeda lagu
    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Ikon Play
        playPauseBtn.setAttribute('aria-label', 'Play');
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'paused';
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

    // Lagu Sebelumnya
    prevBtn.addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; // Kembali ke lagu terakhir
        }
        loadSong(currentSongIndex);
        playSong();
    });

    // Lagu Berikutnya
    nextBtn.addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0; // Kembali ke lagu pertama
        }
        loadSong(currentSongIndex);
        playSong();
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
    });

    // Pindah posisi lagu dengan progress bar
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Otomatis putar lagu berikutnya saat lagu selesai
    audioPlayer.addEventListener('ended', () => {
        nextBtn.click(); // Panggil fungsi klik tombol next
    });

    // --- Fungsi Playlist ---

    // Membangun daftar lagu di sidebar
    function buildPlaylist() {
        playlistUl.innerHTML = ''; // Kosongkan playlist yang mungkin ada
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                // Sembunyikan playlist di mobile setelah memilih lagu
                if (window.innerWidth <= 992) {
                    playlistSidebar.classList.remove('visible');
                    // Untuk mobile, kita perlu mengatur display: none lagi setelah transisi selesai
                    playlistSidebar.addEventListener('transitionend', function handler() {
                        playlistSidebar.style.display = 'none';
                        playlistSidebar.removeEventListener('transitionend', handler);
                    });
                }
            });
            playlistUl.appendChild(li);
        });
        updatePlaylistActiveState(currentSongIndex); // Set active state untuk lagu pertama
    }

    // Update class 'active' di item playlist
    function updatePlaylistActiveState(activeIndex) {
        const playlistItems = playlistUl.querySelectorAll('li');
        playlistItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Toggle tampilan playlist sidebar
    togglePlaylistBtn.addEventListener('click', () => {
        // Logika untuk menampilkan/menyembunyikan sidebar di mobile/desktop
        if (playlistSidebar.classList.contains('visible')) {
            playlistSidebar.classList.remove('visible');
            // Untuk mobile, kita perlu mengatur display: none lagi setelah transisi selesai
            if (window.innerWidth <= 992) {
                playlistSidebar.addEventListener('transitionend', function handler() {
                    playlistSidebar.style.display = 'none';
                    playlistSidebar.removeEventListener('transitionend', handler);
                });
            }
        } else {
            if (window.innerWidth <= 992) { // Hanya untuk mobile, tampilkan sebagai block
                playlistSidebar.style.display = 'block';
            }
            playlistSidebar.classList.add('visible');
        }
    });

    // Menutup playlist jika klik di luar sidebar (untuk desktop)
    document.addEventListener('click', (event) => {
        const isClickInsidePlayer = event.target.closest('.music-player');
        const isClickInsidePlaylist = event.target.closest('.playlist-sidebar');
        const isTogglePlaylistBtn = event.target.closest('#toggle-playlist');

        if (!isClickInsidePlayer && !isClickInsidePlaylist && !isTogglePlaylistBtn && playlistSidebar.classList.contains('visible') && window.innerWidth > 992) {
            playlistSidebar.classList.remove('visible');
            // Tidak perlu style.display = 'none' untuk desktop karena posisinya fixed
        }
    });

    // --- Inisialisasi Aplikasi ---
    loadSong(currentSongIndex); // Muat lagu pertama saat halaman dimuat
    buildPlaylist(); // Bangun daftar lagu
});
