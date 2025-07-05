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
    const lyricsText = document.getElementById('lyrics-text');
    const playlistUl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.getElementById('playlist-sidebar');
    const closePlaylistBtn = document.getElementById('close-playlist-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const backgroundVideo = document.getElementById('background-video');

    // New elements for enhanced UI
    const sleepTimerDisplay = document.getElementById('sleep-timer-display');
    const openSleepTimerModalBtn = document.getElementById('open-sleep-timer-modal');
    const sleepTimerModal = document.getElementById('sleepTimerModal');
    const closeSleepTimerModalBtn = document.getElementById('close-sleep-timer-modal');
    const timerOptionBtns = document.querySelectorAll('.timer-option-btn');
    const customTimerInput = document.getElementById('custom-timer-input');
    const setCustomTimerBtn = document.getElementById('set-custom-timer-btn');
    const sleepTimerCountdown = document.getElementById('sleep-timer-countdown'); // Main display
    const modalTimerCountdown = document.getElementById('modal-timer-countdown'); // Modal display

    const openAudioModalBtn = document.getElementById('open-audio-modal-btn');
    const audioControlsModal = document.getElementById('audioControlsModal');
    const closeAudioModalBtn = document.getElementById('close-audio-modal');
    const masterVolumeControl = document.getElementById('master-volume');
    const volumeValueSpan = document.getElementById('volume-value');
    const trebleControl = document.getElementById('treble-control');
    const trebleValueSpan = document.getElementById('treble-value');
    const bassControl = document.getElementById('bass-control');
    const bassValueSpan = document.getElementById('bass-value');

    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const playlistSearchInput = document.getElementById('playlist-search');

    // --- Web Audio API for EQ ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source; // Will be created once audio is playing
    const gainNode = audioContext.createGain(); // Master Volume
    const bassFilter = audioContext.createBiquadFilter();
    const trebleFilter = audioContext.createBiquadFilter();

    // Setup EQ filters
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.setValueAtTime(250, audioContext.currentTime); // Freq for bass
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.setValueAtTime(2500, audioContext.currentTime); // Freq for treble

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let sleepTimerId = null;
    let sleepTimerEndTime = 0;
    let shuffleMode = false;
    let repeatMode = 'off'; // 'off', 'one', 'all'
    let originalPlaylistOrder = []; // To store original order for shuffle

    // --- DATA LAGU (LOAD DARI LOCALSTORAGE) ---
    let playlist = JSON.parse(localStorage.getItem('musicPlaylist')) || [
        // Default songs if localStorage is empty
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3",
            albumArt: "album_art_back_to_friends.jpg",
            lyrics: `<b>🎶 Back to Friends – Sombr</b><br><br>
                <b>Verse 1</b><br>
                Touch my body tender<br>
                ’Cause the feeling makes me weak<br>
                Kicking off the covers<br>
                I see the ceiling while you’re looking down at me<br><br>
                <b>Chorus</b><br>
                How can we go back to being friends<br>
                When we just shared a bed?<br>
                How can you look at me and pretend<br>
                I’m someone you’ve never met?`
        },
        {
            title: "Bergema Sampai Selamanya",
            artist: "Nadhif Basalamah",
            src: "bergema_sampai_selamanya.mp3",
            albumArt: "album_art_bergema_sampai_selamanya.jpg",
            lyrics: `<b>🎶 Bergema Sampai Selamanya – Nadhif Basalamah</b><br><br>
                <b>Verse 1</b><br>
                Dengarkan hati bicara<br>
                Di setiap desah napasmu<br>
                Ada cerita yang takkan pudar<br>
                Di setiap langkah kakimu<br><br>
                <b>Chorus</b><                Bergema sampai selamanya<br>
                Cinta kita takkan sirna<br>
                Di setiap nada yang tercipta<br>
                Hanyalah namamu yang ada`
        },
        {
            title: "Ride",
            artist: "SoMo",
            src: "ride.mp3",
            albumArt: "album_art_ride.jpg",
            lyrics: `<b>🎶 Ride – SoMo</b><br><br>
                <b>Verse 1</b><br>
                I'm riding high, I'm riding low<br>
                I'm going where the wind don't blow<br>
                Just cruising, feeling good tonight<br>
                Everything is working out just right`
        },
        {
            title: "Rumah Kita",
            artist: "God Bless",
            src: "rumah_kita.mp3",
            albumArt: "album_art_rumah_kita.jpg",
            lyrics: `<b>🎶 Rumah Kita – God Bless</b><br><br>
                <b>Verse 1</b><br>
                Hanya bilik bambu<br>
                Tempat tinggal kita<br>
                Tanpa hiasan, tanpa lukisan<br>
                Hanya jendela, tanpa tiang`
        },
        {
            title: "Style",
            artist: "Taylor Swift",
            src: "style.mp3",
            albumArt: "album_art_style.jpg",
            lyrics: `<b>🎶 Style – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                Midnight, you come and pick me up, no headlights<br>
                Long drive, could end in burning flames or paradise<br>
                Fade into view, oh, it's been a while since I have even heard from you`
        },
        {
            title: "Message In A Bottle",
            artist: "Taylor Swift",
            src: "message_in_a_bottle.mp3",
            albumArt: "album_art_message_in_a_bottle.jpg",
            lyrics: `<b>🎶 Message In A Bottle – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                I was ridin' in a getaway car<br>
                I was crying in a getaway car<br>
                I was dying in a getaway car<br>
                Said goodbye to the girl you used to be`
        },
        {
            title: "Supernatural",
            artist: "Ariana Grande",
            src: "supernatural.mp3",
            albumArt: "album_art_supernatural.jpg",
            lyrics: `<b>🎶 Supernatural – Ariana Grande</b><br><br>
                <b>Verse 1</b><br>
                You're my supernatural, my magic<br>
                Every touch, a dream, a sweet habit<br>
                In your eyes, a universe I find<br>
                Leaving all my worries far behind`
        },
        {
            title: "Favorite Lesson",
            artist: "Yaeow",
            src: "favorite_lesson.mp3",
            albumArt: "album_art_favorite_lesson.jpg",
            lyrics: `<b>🎶 Favorite Lesson – Yaeow</b><br><br>
                <b>Verse 1</b><br>
                Always telling me that I should find the time for me<br>
                Working tirelessly until I lose my energy<br>
                You’re the only one who really knows the things I need`
        },
        {
            title: "So High School",
            artist: "Taylor Swift",
            src: "so_high_school.mp3",
            albumArt: "album_art_so_high_school.jpg",
            lyrics: `<b>🎶 So High School – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                I feel like I'm back in high school again<br>
                Butterflies every time you walk in<br>
                Like a freshman, crushin' hard, don't pretend`
        },
        {
            title: "Photograph",
            artist: "Ed Sheeran",
            src: "photograph.mp3",
            albumArt: "album_art_photograph.jpg",
            lyrics: `<b>🎶 Photograph – Ed Sheeran</b><br><br>
                <b>Verse 1</b><br>
                Loving can hurt, loving can hurt sometimes<br>
                But it's the only thing that I know<br>
                When it's good, when it's good, it's so good, it's so good`
        },
        {
            title: "You'll Be In My Heart",
            artist: "Niki",
            src: "youll_be_in_my_heart.mp3",
            albumArt: "album_art_youll_be_in_my_heart.jpg",
            lyrics: `<b>🎶 You'll Be In My Heart – Niki</b><br><br>
                <b>Verse 1</b><br>
                Come stop your crying<br>
                It'll be alright<br>
                Just take my hand<br>
                Hold it tight`
        },
        {
            title: "Tarot",
            artist: ".Feast",
            src: "tarot.mp3",
            albumArt: "album_art_tarot.jpg",
            lyrics: `<b>🎶 Tarot – .Feast</b><br><br>
                <b>Verse 1</b><br>
                Di antara kartu-kartu tua<br>
                Terbentang kisah yang tak terduga<br>
                Masa lalu, kini, dan nanti<br>
                Terungkap dalam setiap sisi`
        },
        {
            title: "O, Tuan",
            artist: ".Feast",
            src: "o_tuan.mp3",
            albumArt: "album_art_o_tuan.jpg",
            lyrics: `<b>🎶 O, Tuan – .Feast</b><br><br>
                <b>Verse 1</b><br>
                O, Tuan, dengarkanlah<br>
                Rintihan hati yang resah<br>
                Di tengah bisingnya dunia<br>
                Mencari makna, mencari arah`
        },
        {
            title: "Ramai Sepi Bersama",
            artist: "Hindia",
            src: "ramai_sepi_bersama.mp3",
            albumArt: "album_art_ramai_sepi_bersama.jpg",
            lyrics: `<b>🎶 Ramai Sepi Bersama – Hindia</b><br><br>
                <b>Verse 1</b><br>
                Di tengah ramai, aku sendiri<br>
                Mencari arti, di antara bising<br>
                Dunia berputar, tak henti-henti<br>
                Namun hatiku, masih terasing`
        },
        {
            title: "Everything U Are",
            artist: "Hindia",
            src: "everything_u_are.mp3",
            albumArt: "album_art_everything_u_are.jpg",
            lyrics: `<b>🎶 Everything U Are – Hindia</b><br><br>
                <b>Verse 1</b><br>
                In your eyes, I see a universe untold<br>
                A story waiting, brave and bold<br>
                Every whisper, every gentle sigh<br>
                Reflects the truth beneath the sky`
        }
    ];

    // Initialize originalPlaylistOrder
    originalPlaylistOrder = [...playlist];

    // --- Web Audio API Setup (called only once) ---
    function setupAudioContext() {
        if (!source) { // Create source only once
            source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(bassFilter);
            bassFilter.connect(trebleFilter);
            trebleFilter.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    }

    // --- Fungsi Utama Pemutar Musik ---

    function loadSong(songIndex) {
        if (playlist.length === 0) {
            console.warn("Playlist kosong. Tidak ada lagu untuk dimuat.");
            currentSongTitle.textContent = "Tidak ada lagu";
            currentArtistName.textContent = "Tambahkan lagu di panel admin";
            lyricsText.innerHTML = "<p>Playlist kosong. Silakan tambahkan lagu baru melalui panel admin.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlist.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            lyricsText.innerHTML = "<p>Terjadi kesalahan saat memuat lirik.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        const song = playlist[songIndex];
        audioPlayer.src = song.src;
        audioPlayer.load();
        currentAlbumArt.src = song.albumArt;
        currentSongTitle.textContent = song.title;
        currentArtistName.textContent = song.artist;
        lyricsText.innerHTML = song.lyrics;

        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animation = 'none';
            void albumArtImg.offsetWidth; // Trigger reflow
            albumArtImg.style.animation = ''; // Reapply animation
        }
        updatePlaylistActiveState(songIndex);

        // === IMPLEMENTASI MEDIA SESSION API ===
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: 'Custom Playlist',
                artwork: [
                    { src: song.albumArt, sizes: '96x96', type: 'image/jpeg' },
                    { src: song.albumArt, sizes: '128x128', type: 'image/jpeg' },
                    { src: song.albumArt, sizes: '192x192', type: 'image/jpeg' },
                    { src: song.albumArt, sizes: '256x256', type: 'image/jpeg' },
                    { src: song.albumArt, sizes: '384x384', type: 'image/jpeg' },
                    { src: song.albumArt, sizes: '512x512', type: 'image/jpeg' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => { playSong(); });
            navigator.mediaSession.setActionHandler('pause', () => { pauseSong(); });
            navigator.mediaSession.setActionHandler('nexttrack', () => { playNextSong(); });
            navigator.mediaSession.setActionHandler('previoustrack', () => { playPrevSong(); });
            navigator.mediaSession.setActionHandler('seekbackward', (event) => {
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - (event.seekOffset || 10));
            });
            navigator.mediaSession.setActionHandler('seekforward', (event) => {
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + (event.seekOffset || 10));
            });
            navigator.mediaSession.setActionHandler('seekto', (event) => {
                if (event.fastSeek && 'fastSeek' in audioPlayer) {
                    audioPlayer.fastSeek(event.seekTime);
                } else {
                    audioPlayer.currentTime = event.seekTime;
                }
            });
        }
    }

    function playSong() {
        // Ensure audio context is running when play is initiated by user gesture
        if (audioContext.state === 'suspended') {
            setupAudioContext(); // Ensure source is created and connected
            audioContext.resume();
        }

        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded or invalid. Attempting to load first song.");
            if (playlist.length > 0) {
                loadSong(0); // Try to load first song if current is invalid
            } else {
                return;
            }
        }

        audioPlayer.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pause');
            const albumArtImg = document.querySelector('.album-art-img');
            if (albumArtImg) {
                albumArtImg.style.animationPlayState = 'running';
            }
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                console.log("Autoplay diblokir atau pemutaran dibatalkan. Sentuh tombol play untuk memulai.");
            }
        });
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.setAttribute('aria-label', 'Play');
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'paused';
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    function playNextSong() {
        if (playlist.length === 0) {
            pauseSong();
            return;
        }

        if (repeatMode === 'one') {
            loadSong(currentSongIndex);
            playSong();
            return;
        }

        if (shuffleMode) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (nextIndex === currentSongIndex && playlist.length > 1);
            currentSongIndex = nextIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        
        if (currentSongIndex === 0 && repeatMode === 'off' && !shuffleMode) {
            pauseSong();
            loadSong(currentSongIndex);
            return;
        } else {
            loadSong(currentSongIndex);
            playSong();
        }
    }

    function playPrevSong() {
        if (playlist.length === 0) {
            pauseSong();
            return;
        }

        if (repeatMode === 'one') {
            loadSong(currentSongIndex);
            playSong();
            return;
        }

        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // --- Event Listeners (Untuk Interaksi Pengguna) ---
    playPauseBtn.addEventListener('click', playPauseToggle);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);

    function playPauseToggle() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
            // Ensure master volume is applied when metadata loads
            gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
        } else {
            durationSpan.textContent = '0:00';
        }
    });

    progressBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration)) {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        playNextSong();
    });

    // --- Sleep Timer Logic (Enhanced) ---
    function startSleepTimer(minutes) {
        clearTimeout(sleepTimerId);
        if (minutes === 0) {
            sleepTimerEndTime = 0;
            sleepTimerCountdown.textContent = '';
            modalTimerCountdown.textContent = '';
            // Remove active state from all timer options
            timerOptionBtns.forEach(btn => btn.classList.remove('active'));
            customTimerInput.value = ''; // Clear custom input
            return;
        }

        sleepTimerEndTime = Date.now() + minutes * 60 * 1000;
        updateSleepTimerCountdownDisplay();
        sleepTimerId = setInterval(updateSleepTimerCountdownDisplay, 1000);

        // Set active state for the selected option
        timerOptionBtns.forEach(btn => {
            if (parseInt(btn.dataset.minutes) === minutes) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (minutes > 0 && ![5, 15, 30, 60].includes(minutes)) { // For custom timer
            customTimerInput.value = minutes;
        } else {
            customTimerInput.value = '';
        }
        sleepTimerModal.classList.remove('visible'); // Close modal after setting
        sidebarOverlay.classList.remove('visible');
    }

    function updateSleepTimerCountdownDisplay() {
        const remainingTime = sleepTimerEndTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(sleepTimerId);
            pauseSong();
            sleepTimerCountdown.textContent = 'Waktu habis!';
            modalTimerCountdown.textContent = 'Waktu habis!';
            // Reset modal options
            timerOptionBtns.forEach(btn => btn.classList.remove('active'));
            customTimerInput.value = '';
            startSleepTimer(0); // Reset timer state
        } else {
            const minutes = Math.floor(remainingTime / (60 * 1000));
            const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
            const formattedTime = `Berhenti dalam: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            sleepTimerCountdown.textContent = formattedTime;
            modalTimerCountdown.textContent = formattedTime;
        }
    }

    openSleepTimerModalBtn.addEventListener('click', () => {
        sleepTimerModal.classList.add('visible');
        sidebarOverlay.classList.add('visible');
        // Ensure countdown in modal is updated when opened
        if (sleepTimerEndTime > Date.now()) {
            updateSleepTimerCountdownDisplay();
        } else {
            modalTimerCountdown.textContent = 'Tidak ada timer disetel.';
        }
    });

    closeSleepTimerModalBtn.addEventListener('click', () => {
        sleepTimerModal.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    });

    timerOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            startSleepTimer(minutes);
        });
    });

    setCustomTimerBtn.addEventListener('click', () => {
        const minutes = parseInt(customTimerInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            startSleepTimer(minutes);
        } else {
            alert('Masukkan durasi menit yang valid untuk timer kustom.');
        }
    });

    // --- Audio Controls Logic ---
    openAudioModalBtn.addEventListener('click', () => {
        audioControlsModal.classList.add('visible');
        sidebarOverlay.classList.add('visible');
    });

    closeAudioModalBtn.addEventListener('click', () => {
        audioControlsModal.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    });

    masterVolumeControl.addEventListener('input', () => {
        const volume = parseFloat(masterVolumeControl.value);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        volumeValueSpan.textContent = `${Math.round(volume * 100)}%`;
        audioPlayer.volume = volume; // Keep native volume in sync
    });

    trebleControl.addEventListener('input', () => {
        const value = parseFloat(trebleControl.value);
        trebleFilter.gain.setValueAtTime(value, audioContext.currentTime);
        trebleValueSpan.textContent = `${value} dB`;
    });

    bassControl.addEventListener('input', () => {
        const value = parseFloat(bassControl.value);
        bassFilter.gain.setValueAtTime(value, audioContext.currentTime);
        bassValueSpan.textContent = `${value} dB`;
    });

    // Initialize Audio Control values
    masterVolumeControl.value = audioPlayer.volume;
    volumeValueSpan.textContent = `${Math.round(audioPlayer.volume * 100)}%`;
    trebleValueSpan.textContent = `${trebleControl.value} dB`;
    bassValueSpan.textContent = `${bassControl.value} dB`;


    // --- Theme Toggling ---
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        toggleThemeBtn.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        toggleThemeBtn.setAttribute('aria-label', isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    toggleThemeBtn.addEventListener('click', toggleTheme);

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        toggleThemeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
        document.body.classList.remove('light-mode');
        toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        toggleThemeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }


    // --- Shuffle and Repeat ---
    shuffleBtn.addEventListener('click', () => {
        shuffleMode = !shuffleMode;
        shuffleBtn.classList.toggle('active', shuffleMode);
        if (shuffleMode) {
            shufflePlaylist();
        } else {
            restoreOriginalPlaylist();
        }
        buildPlaylist(playlistSearchInput.value); // Rebuild playlist to reflect order
        updatePlaylistActiveState(currentSongIndex);
    });

    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'off') {
            repeatMode = 'all';
            repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>'; // Repeat all icon
            repeatBtn.classList.add('active');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.innerHTML = '<i class="fas fa-repeat-one"></i>'; // Repeat one icon
        } else {
            repeatMode = 'off';
            repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>'; // Off icon
            repeatBtn.classList.remove('active');
        }
        repeatBtn.setAttribute('aria-label', `Repeat: ${repeatMode}`);
    });

    function shufflePlaylist() {
        originalPlaylistOrder = [...playlist];
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        // Find the new index of the currently playing song in the shuffled list
        const currentSong = originalPlaylistOrder[currentSongIndex];
        currentSongIndex = playlist.findIndex(song => song.src === currentSong.src);
    }

    function restoreOriginalPlaylist() {
        playlist = [...originalPlaylistOrder];
        // Find the new index of the currently playing song in the restored list
        const currentSong = originalPlaylistOrder[currentSongIndex];
        currentSongIndex = playlist.findIndex(song => song.src === currentSong.src);
    }


    // --- Fungsi Playlist ---
    function buildPlaylist(searchTerm = '') {
        playlistUl.innerHTML = '';
        const filteredPlaylist = originalPlaylistOrder.filter(song => // Filter from original order
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredPlaylist.length === 0) {
            const noResultsLi = document.createElement('li');
            noResultsLi.textContent = "Tidak ada lagu ditemukan.";
            noResultsLi.style.justifyContent = 'center';
            noResultsLi.style.cursor = 'default';
            noResultsLi.style.backgroundColor = 'transparent';
            noResultsLi.style.transform = 'none';
            noResultsLi.style.borderLeft = 'none';
            noResultsLi.style.color = 'var(--secondary-text)';
            playlistUl.appendChild(noResultsLi);
            return;
        }

        filteredPlaylist.forEach((song, index) => {
            const li = document.createElement('li');
            const actualIndexInCurrentPlaylist = playlist.findIndex(s => s.src === song.src); // Find its index in the *current* active playlist (shuffled or not)

            li.setAttribute('data-original-index', originalPlaylistOrder.indexOf(song)); // Store original index for reference
            li.setAttribute('data-current-playlist-index', actualIndexInCurrentPlaylist); // Store its index in currently active (shuffled/original) playlist
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => {
                currentSongIndex = parseInt(li.getAttribute('data-current-playlist-index'));
                loadSong(currentSongIndex);
                playSong();
                hidePlaylistSidebar();
            });
            playlistUl.appendChild(li);
        });
        updatePlaylistActiveState(currentSongIndex);
    }

    function updatePlaylistActiveState(activeIndexInCurrentPlaylist) {
        const playlistItems = playlistUl.querySelectorAll('li');
        if (!playlistItems.length) return;

        playlistItems.forEach(item => item.classList.remove('active'));

        const currentPlayingSong = playlist[activeIndexInCurrentPlaylist];
        if (currentPlayingSong) {
            const activeItem = Array.from(playlistItems).find(item =>
                item.querySelector('h3').textContent === currentPlayingSong.title &&
                item.querySelector('p').textContent === currentPlayingSong.artist
            );

            if (activeItem) {
                activeItem.classList.add('active');

                const containerHeight = playlistUl.clientHeight;
                const itemHeight = activeItem.offsetHeight;
                const itemTop = activeItem.offsetTop;

                const scrollTo = itemTop - (containerHeight / 2) + (itemHeight / 2);

                if (playlistUl.scrollHeight > playlistUl.clientHeight) {
                    playlistUl.scrollTo({
                        top: scrollTo,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }


    function showPlaylistSidebar() {
        playlistSidebar.classList.add('visible');
        sidebarOverlay.classList.add('visible');
        audioControlsModal.classList.remove('visible'); // Hide audio modal if playlist is open
        sleepTimerModal.classList.remove('visible'); // Hide timer modal if playlist is open
    }

    function hidePlaylistSidebar() {
        playlistSidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    }

    // Overlay to close any open modals/sidebars
    sidebarOverlay.addEventListener('click', () => {
        hidePlaylistSidebar();
        audioControlsModal.classList.remove('visible');
        sleepTimerModal.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    });

    togglePlaylistBtn.addEventListener('click', () => {
        if (playlistSidebar.classList.contains('visible')) {
            hidePlaylistSidebar();
        } else {
            showPlaylistSidebar();
        }
    });

    closePlaylistBtn.addEventListener('click', () => {
        hidePlaylistSidebar();
    });

    playlistSearchInput.addEventListener('input', (event) => {
        buildPlaylist(event.target.value);
    });

    // --- Inisialisasi Aplikasi ---
    // Load playlist data from localStorage if available, otherwise use default
    if (localStorage.getItem('musicPlaylist')) {
        playlist = JSON.parse(localStorage.getItem('musicPlaylist'));
        originalPlaylistOrder = [...playlist]; // Ensure original order is also updated
    }

    if (playlist.length > 0) {
        loadSong(currentSongIndex);
        buildPlaylist();
    } else {
        console.error("Tidak ada lagu ditemukan di array 'playlist'.");
        currentSongTitle.textContent = "Tidak ada lagu";
        currentArtistName.textContent = "Silakan tambahkan lagu di panel admin";
        lyricsText.innerHTML = "<p>Silakan tambahkan lagu baru melalui panel admin. Pastikan file MP3 dan gambar album ada di folder yang sama.</p>";
    }

    // Initialize Web Audio API after user gesture (first play)
    audioPlayer.addEventListener('play', setupAudioContext, { once: true });
});
