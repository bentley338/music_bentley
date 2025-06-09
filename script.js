document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM (Pastikan ID di HTML cocok dengan ini) ---
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
    const lyricsText = document.querySelector('.lyrics-text'); // Menggunakan querySelector karena ini class, bukan ID
    const playlistUl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.getElementById('playlist-sidebar');

    // --- Variabel State ---
    let currentSongIndex = 0; // Index lagu yang sedang diputar
    let isPlaying = false; // Status pemutaran (true jika sedang play, false jika pause)

    // --- DATA LAGU (PASTIKAN NAMA FILE DAN LOKASI BENAR) ---
    // NAMA FILE di 'src' dan 'albumArt' harus sama PERSIS dengan nama file di folder proyek Anda.
    const songs = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_back_to_friends.jpg", // Pastikan ada file ini di root folder
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
            src: "bergema_sampai_selamanya.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_bergema_sampai_selamanya.jpg", // Pastikan ada file ini di root folder
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
            src: "ride.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_ride.jpg", // Pastikan ada file ini di root folder
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
                Just enjoying the ride, you know<br><br>
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
        },
        {
            title: "Rumah Kita",
            artist: "God Bless",
            src: "rumah_kita.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_rumah_kita.jpg", // Pastikan ada file ini di root folder
            lyrics: `
                <b>🎶 Rumah Kita – God Bless</b><br><br>
                <b>Verse 1</b><br>
                Hanya bilik bambu<br>
                Tempat tinggal kita<br>
                Tanpa hiasan, tanpa lukisan<br>
                Hanya jendela, tanpa tiang<br><br>
                <b>Chorus</b><br>
                Rumah kita, rumah kita<br>
                Lebih baik, lebih baik<br>
                Lebih dari istana<br>
                Rumah kita, rumah kita<br>
                Tempat kita berbagi cerita<br><br>
                <b>Verse 2</b><br>
                Ada tawa, ada tangis<br>
                Ada suka, ada duka<br>
                Semua bersatu di sini<br>
                Dalam hangatnya keluarga<br><br>
                <b>Chorus</b><br>
                Rumah kita, rumah kita<br>
                Lebih baik, lebih baik<br>
                Lebih dari istana<br>
                Rumah kita, rumah kita<br>
                Tempat kita berbagi cerita<br><br>
                <b>Bridge</b><br>
                Takkan ada yang bisa mengganti<br>
                Hangatnya pelukmu, ibu<br>
                Tawa riang adik kakakku<br>
                Di rumah kita, tempat berlindung<br><br>
                <b>Chorus</b><br>
                Rumah kita, rumah kita<br>
                Lebih baik, lebih baik<br>
                Lebih dari istana<br>
                Rumah kita, rumah kita<br>
                Tempat kita berbagi cerita<br><br>
                <b>Outro</b><br>
                Rumah kita...
                Rumah kita...
            `
        },
        {
            title: "Style",
            artist: "Taylor Swift",
            src: "style.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_style.jpg", // Pastikan ada file ini di root folder
            lyrics: `
                <b>🎶 Style – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                Midnight, you come and pick me up, no headlights<br>
                Long drive, could end in burning flames or paradise<br>
                Fade into view, oh, it's been a while since I have even heard from you<br>
                (Heard from you)<br><br>
                <b>Chorus</b><br>
                I say, "I've heard that you've been out and about with some other girl"<br>
                (Oh-oh-oh) I say, "What you've heard is true but I<br>
                Can't stop, won't stop moving, it's like I got this music in my mind"<br>
                (Oh-oh-oh) saying, "It's gonna be alright"<br>
                'Cause we never go out of style<br>
                We never go out of style<br><br>
                <b>Verse 2</b><br>
                You got that long hair, slicked back, white T-shirt<br>
                And I got that good girl faith and a tight little skirt<br>
                And when we go crashing down, we come back every time<br>
                'Cause we never go out of style<br>
                We never go out of style<br><br>
                <b>Chorus</b><br>
                I say, "I've heard that you've been out and about with some other girl"<br>
                (Oh-oh-oh) I say, "What you've heard is true but I<br>
                Can't stop, won't stop moving, it's like I got this music in my mind"<br>
                (Oh-oh-oh) saying, "It's gonna be alright"<br>
                'Cause we never go out of style<br>
                We never go out of style<br><br>
                <b>Bridge</b><br>
                Take me home, just take me home<br>
                Where there's fire, where there's chaos, and there's love<br>
                I got a blank space, baby, and I'll write your name<br>
                But baby, we never go out of style<br><br>
                <b>Chorus</b><br>
                I say, "I've heard that you've been out and about with some other girl"<br>
                (Oh-oh-oh) I say, "What you've heard is true but I<br>
                Can't stop, won't stop moving, it's like I got this music in my mind"<br>
                (Oh-oh-oh) saying, "It's gonna be alright"<br>
                'Cause we never go out of style<br>
                We never go out of style<br><br>
                <b>Outro</b><br>
                Never go out of style<br>
                We never go out of style<br>
                Yeah, we never go out of style
            `
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar
    function loadSong(songIndex) {
        // Pastikan songIndex valid
        if (songIndex < 0 || songIndex >= songs.length) {
            console.error("Error: songIndex di luar batas array songs.", songIndex);
            return; // Hentikan fungsi jika index tidak valid
        }

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
            albumArtImg.style.animation = 'none'; // Hapus animasi sebelumnya
            void albumArtImg.offsetWidth; // Memaksa reflow untuk me-reset animasi
            albumArtImg.style.animation = ''; // Menerapkan kembali animasi dari CSS
        }
        // Update active class di playlist
        updatePlaylistActiveState(songIndex);
    }

    // Memutar lagu
    function playSong() {
        // Pastikan audioPlayer memiliki src sebelum mencoba memutar
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded yet or invalid. Cannot play.");
            return; // Hentikan fungsi jika index tidak valid
        }

        audioPlayer.play().catch(error => {
            // Ini sering terjadi jika browser memblokir autoplay tanpa interaksi user
            // atau jika file audio tidak dapat dimuat/ditemukan.
            console.error("Error playing audio:", error);
            // Tidak perlu alert, pengguna hanya perlu menyentuh tombol play secara manual.
            isPlaying = false; // Set kembali state ke false
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon play
        });

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
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
        } else {
            durationSpan.textContent = '0:00'; // Fallback jika durasi tidak tersedia
        }
    });

    // Pindah posisi lagu dengan progress bar
    progressBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration)) {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
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
                    // Menggunakan setTimeout untuk memastikan transisi selesai sebelum display: none
                    setTimeout(() => {
                        playlistSidebar.style.display = 'none';
                    }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s = 500ms)
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
                // Auto-scroll playlist agar lagu aktif terlihat (opsional, jika playlist scrollable)
                // if (playlistUl.scrollHeight > playlistUl.clientHeight) { // Hanya scroll jika ada scrollbar
                //     const itemTop = item.offsetTop;
                //     const itemHeight = item.offsetHeight;
                //     const containerHeight = playlistUl.clientHeight;
                //     playlistUl.scrollTo({
                //         top: itemTop - (containerHeight / 2) + (itemHeight / 2),
                //         behavior: 'smooth'
                //     });
                // }
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Fungsi untuk menampilkan sidebar playlist
    function showPlaylistSidebar() {
        if (window.innerWidth <= 992) {
            playlistSidebar.style.display = 'block'; // Pastikan display: block dulu untuk transisi
            // Tambahkan timeout kecil sebelum menambah class visible untuk memastikan display diterapkan
            setTimeout(() => {
                playlistSidebar.classList.add('visible');
            }, 10); // Sedikit delay
        } else {
            playlistSidebar.classList.add('visible');
        }
    }

    // Fungsi untuk menyembunyikan sidebar playlist
    function hidePlaylistSidebar() {
        playlistSidebar.classList.remove('visible');
        if (window.innerWidth <= 992) {
            // Menggunakan setTimeout untuk memastikan transisi selesai sebelum display: none
            setTimeout(() => {
                playlistSidebar.style.display = 'none';
            }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s = 500ms)
        }
    }

    // Toggle tampilan playlist sidebar saat tombol "Daftar Lagu" diklik
    togglePlaylistBtn.addEventListener('click', () => {
        if (playlistSidebar.classList.contains('visible')) {
            hidePlaylistSidebar();
        } else {
            showPlaylistSidebar();
        }
    });

    // Menutup playlist jika klik di luar sidebar (hanya berlaku untuk layar besar)
    document.addEventListener('click', (event) => {
        const isClickInsidePlayer = event.target.closest('.music-player');
        const isClickInsidePlaylist = event.target.closest('.playlist-sidebar');
        const isTogglePlaylistBtn = event.target.closest('#toggle-playlist'); // Klik tombol toggle itu sendiri

        // Jika sidebar visible, dan klik di luar player, di luar playlist, dan bukan di tombol toggle
        if (playlistSidebar.classList.contains('visible') && window.innerWidth > 992) {
            if (!isClickInsidePlayer && !isClickInsidePlaylist && !isTogglePlaylistBtn) {
                hidePlaylistSidebar();
            }
        }
    });

    // --- Inisialisasi Aplikasi (JALAN SAAT HALAMAN DIMUAT) ---
    loadSong(currentSongIndex); // Muat lagu pertama saat halaman dimuat
    buildPlaylist(); // Bangun daftar lagu
});
