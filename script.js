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

    // --- DATA LAGU (INI ADALAH BAGIAN KRUSIAL YANG HARUS COCOK DENGAN FILE FISIK ANDA) ---
    // Sangat penting: Pastikan NAMA FILE di properti 'src' (untuk MP3) dan 'albumArt' (untuk JPG/PNG)
    // sama PERSIS (termasuk huruf besar/kecil dan ekstensinya) dengan nama file di folder proyek Anda.
    // Semua file MP3, JPG/PNG, dan MP4 video background harus berada di folder yang sama dengan index.html, style.css, dan script.js.
    const songs = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3", // Pastikan file ini di root folder
            albumArt: "album_art_back_to_friends.jpg", // Pastikan file ini di root folder
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
            src: "rumah_kita.mp3",
            albumArt: "album_art_rumah_kita.jpg",
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
            src: "style.mp3",
            albumArt: "album_art_style.jpg",
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
        },
        {
            title: "Message In A Bottle",
            artist: "Taylor Swift",
            src: "message_in_a_bottle.mp3",
            albumArt: "album_art_message_in_a_bottle.jpg",
            lyrics: `
                <b>🎶 Message In A Bottle – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                I was ridin' in a getaway car<br>
                I was crying in a getaway car<br>
                I was dying in a getaway car<br>
                Said goodbye to the girl you used to be<br><br>
                <b>Chorus</b><br>
                Message in a bottle is all I can give<br>
                To remind you of what we had, what we've lived<br>
                Across the ocean, my love will still flow<br>
                Hoping that someday you'll know<br><br>
                <b>Verse 2</b><br>
                Sunrise on the water, a new day starts<br>
                Still missing you, still breaking my heart<br>
                Every wave whispers your name to me<br>
                A silent prayer across the sea<br><br>
                <b>Chorus</b><br>
                Message in a bottle is all I can give<br>
                To remind you of what we had, what we've lived<br>
                Across the ocean, my love will still flow<br>
                Hoping that someday you'll know<br><br>
                <b>Bridge</b><br>
                And the years go by, still I send my plea<br>
                Hoping this message finds you, eventually<br>
                A single teardrop, lost in the blue<br>
                A simple promise, my love, to you<br><br>
                <b>Chorus</b><br>
                Message in a bottle is all I can give<br>
                To remind you of what we had, what we've lived<br>
                Across the ocean, my love will still flow<br>
                Hoping that someday you'll know<br><br>
                <b>Outro</b><br>
                Message in a bottle...<br>
                My love, my love...
            `
        },
        {
            title: "Supernatural",
            artist: "Ariana Grande",
            src: "supernatural.mp3", // Pastikan ada file ini di root folder
            albumArt: "album_art_supernatural.jpg", // Pastikan ada file ini di root folder
            lyrics: `
                <b>🎶 Supernatural – Ariana Grande</b><br><br>
                <b>Verse 1</b><br>
                You're my supernatural, my magic<br>
                Every touch, a dream, a sweet habit<br>
                In your eyes, a universe I find<br>
                Leaving all my worries far behind<br><br>
                <b>Chorus</b><br>
                Oh, this love is supernatural<br>
                Something beautiful, something so true<br>
                Like a melody, forever new<br>
                Supernatural, just me and you<br><br>
                <b>Verse 2</b><br>
                Whispers in the dark, a gentle breeze<br>
                Floating through the stars, with such ease<br>
                Every moment with you feels divine<br>
                Lost in this love, forever mine<br><br>
                <b>Chorus</b><br>
                Oh, this love is supernatural<br>
                Something beautiful, something so true<br>
                Like a melody, forever new<br>
                Supernatural, just me and you<br><br>
                <b>Bridge</b><br>
                No explanation, no words can define<br>
                This connection, truly one of a kind<br>
                Beyond the logic, beyond the known<br>
                In this love, we're never alone<br><br>
                <b>Chorus</b><br>
                Oh, this love is supernatural<br>
                Something beautiful, something so true<br>
                Like a melody, forever new<br>
                Supernatural, just me and you<br><br>
                <b>Outro</b><br>
                Supernatural...<br>
                Oh, so natural with you...
            `
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar
    function loadSong(songIndex) {
        // Pastikan songIndex valid sebelum mencoba mengakses array songs
        if (songIndex < 0 || songIndex >= songs.length) {
            console.error("Error: songIndex di luar batas array songs. Index:", songIndex, "Ukuran array:", songs.length);
            return; // Hentikan fungsi jika index tidak valid
        }

        const song = songs[songIndex];
        audioPlayer.src = song.src; // Mengatur sumber audio
        currentAlbumArt.src = song.albumArt; // Mengatur gambar album art
        currentSongTitle.textContent = song.title; // Mengatur judul lagu
        currentArtistName.textContent = song.artist; // Mengatur nama artis
        lyricsText.innerHTML = song.lyrics; // Mengupdate lirik untuk lagu yang dimuat (statis)

        // Reset progress bar dan waktu ke 0:00
        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        // Setel ulang animasi album art saat lagu baru dimuat
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animation = 'none'; // Hapus animasi sebelumnya (agar animasi mulai dari awal lagi)
            void albumArtImg.offsetWidth; // Memaksa browser untuk me-reflow, penting untuk me-reset animasi CSS
            albumArtImg.style.animation = ''; // Menerapkan kembali animasi dari CSS default
        }
        // Update class 'active' di playlist untuk menyorot lagu yang sedang diputar
        updatePlaylistActiveState(songIndex);
    }

    // Memutar lagu
    function playSong() {
        // Cek apakah sumber audio sudah dimuat atau valid.
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded yet or invalid. Cannot play.");
            return;
        }

        // Coba putar audio. .play() mengembalikan Promise, jadi tangani jika ada error.
        audioPlayer.play().catch(error => {
            // Error ini sering terjadi jika browser memblokir autoplay tanpa interaksi pengguna pertama.
            console.error("Error playing audio (autoplay blocked?):", error);
            isPlaying = false; // Jika play gagal, set state kembali ke false
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon tetap play
        });

        isPlaying = true; // Set state ke 'sedang bermain'
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Ganti ikon ke pause
        playPauseBtn.setAttribute('aria-label', 'Pause'); // Update aria-label untuk aksesibilitas
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'running'; // Lanjutkan animasi putar album art
        }
    }

    // Menjeda lagu
    function pauseSong() {
        audioPlayer.pause(); // Jeda audio
        isPlaying = false; // Set state ke 'tidak bermain'
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Ganti ikon ke play
        playPauseBtn.setAttribute('aria-label', 'Play'); // Update aria-label
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'paused'; // Jeda animasi putar album art
        }
    }

    // Fungsi untuk memformat waktu dari detik menjadi 'MM:SS'
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    // --- Event Listeners ---

    // Event listener untuk tombol Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Event listener untuk tombol Lagu Sebelumnya
    prevBtn.addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1; // Jika sudah lagu pertama, kembali ke lagu terakhir
        }
        loadSong(currentSongIndex); // Muat lagu baru
        playSong(); // Putar lagu baru
    });

    // Event listener untuk tombol Lagu Berikutnya
    nextBtn.addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0; // Jika sudah lagu terakhir, kembali ke lagu pertama
        }
        loadSong(currentSongIndex); // Muat lagu baru
        playSong(); // Putar lagu baru
    });

    // Event listener saat waktu lagu berjalan (untuk update progress bar dan waktu)
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    // Event listener saat metadata audio (seperti durasi) dimuat
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
        } else {
            durationSpan.textContent = '0:00'; // Fallback jika durasi tidak tersedia
        }
    });

    // Event listener saat progress bar diubah pengguna (seek lagu)
    progressBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration)) {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
    });

    // Event listener saat lagu selesai diputar
    audioPlayer.addEventListener('ended', () => {
        nextBtn.click(); // Secara otomatis putar lagu berikutnya
    });

    // --- Fungsi Playlist ---

    // Membangun daftar lagu di sidebar playlist
    function buildPlaylist() {
        playlistUl.innerHTML = ''; // Kosongkan playlist lama sebelum membangun yang baru
        songs.forEach((song, index) => { // Iterasi setiap lagu di array 'songs'
            const li = document.createElement('li'); // Buat elemen <li> baru untuk setiap lagu
            li.setAttribute('data-index', index); // Simpan index lagu sebagai data attribute
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => { // Event listener saat item lagu di playlist diklik
                currentSongIndex = index; // Atur index lagu saat ini ke lagu yang diklik
                loadSong(currentSongIndex); // Muat lagu tersebut
                playSong(); // Putar lagu tersebut
                // Sembunyikan playlist di perangkat mobile setelah lagu dipilih
                if (window.innerWidth <= 992) { // 992px adalah breakpoint responsive
                    playlistSidebar.classList.remove('visible'); // Hilangkan class visible untuk animasi fade out
                    // Menggunakan setTimeout untuk memastikan transisi selesai sebelum display: none
                    setTimeout(() => {
                        playlistSidebar.style.display = 'none'; // Sembunyikan elemen sepenuhnya dari layout
                    }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s = 500ms)
                }
            });
            playlistUl.appendChild(li); // Tambahkan item lagu ke daftar playlist
        });
        updatePlaylistActiveState(currentSongIndex); // Atur status 'active' untuk lagu pertama
    }

    // Update class 'active' pada item playlist untuk menyorot lagu yang sedang diputar
    function updatePlaylistActiveState(activeIndex) {
        const playlistItems = playlistUl.querySelectorAll('li'); // Dapatkan semua item lagu di playlist
        playlistItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active'); // Tambahkan class 'active' jika ini adalah lagu yang sedang aktif
            } else {
                item.classList.remove('active'); // Hapus class 'active' dari lagu lain
            }
        });
    }

    // Fungsi untuk menampilkan sidebar playlist
    function showPlaylistSidebar() {
        if (window.innerWidth <= 992) { // Jika di mobile
            playlistSidebar.style.display = 'block'; // Pastikan display diatur ke block agar transisi bisa berjalan
            // Tambahkan timeout kecil sebelum menambah class visible untuk memastikan display diterapkan
            setTimeout(() => {
                playlistSidebar.classList.add('visible'); // Tambahkan class 'visible' untuk animasi fade in
            }, 10); // Sedikit delay (10ms)
        } else { // Jika di desktop
            playlistSidebar.classList.add('visible'); // Langsung tambahkan class 'visible'
        }
    }

    // Fungsi untuk menyembunyikan sidebar playlist
    function hidePlaylistSidebar() {
        playlistSidebar.classList.remove('visible'); // Hilangkan class 'visible' untuk animasi fade out
        if (window.innerWidth <= 992) { // Jika di mobile
            // Menggunakan setTimeout untuk memastikan transisi selesai sebelum display: none
            setTimeout(() => {
                playlistSidebar.style.display = 'none'; // Sembunyikan elemen sepenuhnya dari layout
            }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s = 500ms)
        }
    }

    // Event listener untuk tombol "Daftar Lagu" (Toggle Playlist)
    togglePlaylistBtn.addEventListener('click', () => {
        if (playlistSidebar.classList.contains('visible')) {
            hidePlaylistSidebar(); // Jika sedang terlihat, sembunyikan
        } else {
            showPlaylistSidebar(); // Jika tidak terlihat, tampilkan
        }
    });

    // Event listener untuk menutup playlist jika klik di luar sidebar (hanya berlaku untuk layar besar)
    document.addEventListener('click', (event) => {
        const isClickInsidePlayer = event.target.closest('.music-player');
        const isClickInsidePlaylist = event.target.closest('.playlist-sidebar');
        const isTogglePlaylistBtn = event.target.closest('#toggle-playlist');

        // Jika sidebar sedang visible, dan bukan di mobile, dan klik tidak terjadi di dalam player,
        // tidak di dalam playlist, dan tidak di tombol toggle itu sendiri, maka sembunyikan sidebar.
        if (playlistSidebar.classList.contains('visible') && window.innerWidth > 992) {
            if (!isClickInsidePlayer && !isClickInsidePlaylist && !isTogglePlaylistBtn) {
                hidePlaylistSidebar(); // Sembunyikan sidebar
            }
        }
    });

    // --- Inisialisasi Aplikasi (Fungsi yang Berjalan Saat Halaman Dimuat) ---
    // Pastikan ada lagu di array 'songs' sebelum mencoba memuatnya
    if (songs.length > 0) {
        loadSong(currentSongIndex); // Muat lagu pertama saat halaman dimuat
        buildPlaylist(); // Bangun daftar lagu
    } else {
        // Jika tidak ada lagu, tampilkan pesan di UI
        console.error("Tidak ada lagu ditemukan di array 'songs'.");
        currentSongTitle.textContent = "Tidak ada lagu";
        currentArtistName.textContent = "Silakan tambahkan lagu di script.js";
        lyricsText.innerHTML = "<p>Silakan tambahkan file MP3 dan gambar album di folder yang sama, lalu update array 'songs' di script.js.</p>";
    }
});
