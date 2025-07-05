// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

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

    // Timer elements (modal)
    const setTimerBtn = document.getElementById('set-timer-btn');
    const timerModal = document.getElementById('timer-modal');
    const closeModalBtn = document.getElementById('close-timer-modal');
    const timerOptionBtns = document.querySelectorAll('.timer-option-btn');
    const customTimerInput = document.getElementById('custom-timer-minutes');
    const setCustomTimerBtn = document.getElementById('set-custom-timer-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // Timer elements (display di player utama)
    const playerTimerDisplay = document.getElementById('player-timer-display');
    const playerTimerCountdown = document.getElementById('player-timer-countdown');
    const playerCancelTimerBtn = document.getElementById('player-cancel-timer-btn');

    // Timer elements (display di dalam modal)
    const modalActiveTimerDisplay = document.getElementById('modal-active-timer-display');
    const modalTimerCountdown = document.getElementById('modal-timer-countdown');
    const modalCancelTimerBtn = document.getElementById('modal-cancel-timer-btn');

    // Audio Settings Elements
    const audioSettingsBtn = document.getElementById('audio-settings-btn');
    const audioSettingsModal = document.getElementById('audio-settings-modal');
    const closeAudioSettingsModalBtn = document.getElementById('close-audio-settings-modal');

    const masterVolumeSlider = document.getElementById('master-volume-slider');
    const masterVolumeValue = document.getElementById('master-volume-value');

    // Equalizer Elements
    const eqPresetBtns = document.querySelectorAll('.eq-preset-btn');
    const bassLevelSlider = document.getElementById('bass-level-slider');
    const bassLevelValue = document.getElementById('bass-level-value');
    const midLevelSlider = document.getElementById('mid-level-slider');
    const midLevelValue = document.getElementById('mid-level-value');
    const trebleLevelSlider = document.getElementById('treble-level-slider');
    const trebleLevelValue = document.getElementById('treble-level-value');

    const effectLevelSlider = document.getElementById('effect-level-slider');
    const effectLevelValue = document.getElementById('effect-level-value');

    // Shuffle and Repeat Elements
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    // Playlist Search Element
    const playlistSearchInput = document.getElementById('playlist-search-input');

    // Theme Toggle Element
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Audio Visualizer Elements
    const audioVisualizerCanvas = document.getElementById('audio-visualizer-canvas');
    const visualizerCtx = audioVisualizerCanvas.getContext('2d');
    let audioContext = null;
    let analyser = null;
    let source = null;
    let masterGainNode = null;
    let bassFilter = null;
    let midFilter = null;
    let trebleFilter = null;
    let effectGainNode = null;

    // Admin Panel Elements (NEW)
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const adminPanelModal = document.getElementById('admin-panel-modal');
    const closeAdminPanelModalBtn = document.getElementById('close-admin-panel-modal');
    const addSongForm = document.getElementById('add-song-form');
    const addTitleInput = document.getElementById('add-title');
    const addArtistInput = document.getElementById('add-artist');
    const addSrcInput = document.getElementById('add-src');
    const addAlbumArtInput = document.getElementById('add-album-art');
    const addLyricsInput = document.getElementById('add-lyrics');
    const adminSongListUl = document.getElementById('admin-song-list');

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let sleepTimerTimeoutId = null;
    let sleepTimerIntervalId = null;
    let timeRemaining = 0;
    let isShuffling = false;
    let repeatMode = 'off';
    let currentPlaylistData = []; // Ini akan menyimpan data playlist dari Firestore
    let originalPlaylistOrder = []; // Digunakan untuk shuffle (salinan dari currentPlaylistData)
    let shuffledPlaylist = []; // Digunakan untuk shuffle

    // --- Firebase Variables (NEW) ---
    const firebaseConfig = JSON.parse(`{
        // PASTE FIREBASE CONFIG AND API KEY HERE
        // Contoh:
        // "apiKey": "YOUR_API_KEY",
        // "authDomain": "YOUR_AUTH_DOMAIN",
        // "projectId": "YOUR_PROJECT_ID",
        // "storageBucket": "YOUR_STORAGE_BUCKET",
        // "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
        // "appId": "YOUR_APP_ID"
    }`); // GANTI DENGAN FIREBASE CONFIG ANDA!

    // Global variables provided by Canvas environment (DO NOT CHANGE)
    const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.projectId; // Fallback to projectId if __app_id is not defined
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    let db;
    let auth;
    let currentUserUid = null;
    // GANTI INI dengan UID ADMIN Anda yang sebenarnya dari Firebase Console
    // Anda bisa mendapatkan UID Anda dengan login pertama kali, lalu cek console browser
    const ADMIN_UID = "YOUR_ADMIN_UID_HERE"; // <--- GANTI INI DENGAN UID ADMIN ANDA!

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar (album art, judul, artis, lirik)
    function loadSong(songIndex) {
        const playlistToUse = isShuffling ? shuffledPlaylist : currentPlaylistData;

        if (songIndex < 0 || songIndex >= playlistToUse.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlistToUse.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            lyricsText.innerHTML = "<p>Terjadi kesalahan saat memuat lirik.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        const song = playlistToUse[songIndex];
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
            void albumArtImg.offsetWidth;
            albumArtImg.style.animation = '';
        }
        updatePlaylistActiveState(songIndex);

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

            navigator.mediaSession.setActionHandler('play', () => {
                playSong();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                pauseSong();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                playNextSong();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                playPrevSong();
            });
        }
    }

    // Memutar lagu
    function playSong() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded or invalid. Cannot play.");
            return;
        }

        // Inisialisasi Web Audio API saat play pertama kali
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                source = audioContext.createMediaElementSource(audioPlayer);

                // Buat node-node efek
                analyser = audioContext.createAnalyser();
                masterGainNode = audioContext.createGain();
                bassFilter = audioContext.createBiquadFilter();
                midFilter = audioContext.createBiquadFilter();
                trebleFilter = audioContext.createBiquadFilter();
                effectGainNode = audioContext.createGain();

                // Konfigurasi Filter Nodes
                bassFilter.type = 'lowshelf';
                bassFilter.frequency.value = 250;
                bassFilter.gain.value = parseFloat(bassLevelSlider.value);

                midFilter.type = 'peaking';
                midFilter.frequency.value = 1000;
                midFilter.Q.value = 1;
                midFilter.gain.value = parseFloat(midLevelSlider.value);

                trebleFilter.type = 'highshelf';
                trebleFilter.frequency.value = 4000;
                trebleFilter.gain.value = parseFloat(trebleLevelSlider.value);

                // Hubungkan node-node dalam graph:
                // source -> analyser -> bassFilter -> midFilter -> trebleFilter -> effectGainNode -> masterGainNode -> destination
                source.connect(analyser);
                analyser.connect(bassFilter);
                bassFilter.connect(midFilter);
                midFilter.connect(trebleFilter);
                trebleFilter.connect(effectGainNode);
                effectGainNode.connect(masterGainNode);
                masterGainNode.connect(audioContext.destination);

                analyser.fftSize = 256;
                console.log("Web Audio API initialized successfully with effects chain.");
                drawVisualizer(); // Mulai menggambar visualizer
            } catch (e) {
                console.error("Gagal menginisialisasi Web Audio API:", e);
                audioVisualizerCanvas.style.display = 'none'; // Sembunyikan visualizer jika error
                // Fallback: Jika API gagal, audioPlayer akan memutar langsung ke speaker
                // tanpa efek atau visualizer.
            }
        }

        // Pastikan AudioContext di-resume jika dalam keadaan suspended (misalnya setelah interaksi pengguna pertama)
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully');
            }).catch(e => console.error('Error resuming AudioContext:', e));
        }

        // Coba putar audio dan tangani Promise
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
            // Pastikan visualizer menggambar jika audio diputar
            if (analyser && audioVisualizerCanvas.style.display !== 'none') {
                requestAnimationFrame(drawVisualizer);
            }
        }).catch(error => {
            console.error("Gagal memutar audio:", error);
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
            // Notifikasi pengguna jika pemutaran otomatis diblokir
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                console.log("Autoplay diblokir atau pemutaran dibatalkan. Sentuh tombol play untuk memulai.");
            }
        });
    }

    // Menjeda lagu
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

    // Fungsi untuk memformat waktu dari detik menjadi 'MM:SS'
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    // Mainkan lagu berikutnya
    function playNextSong() {
        const playlistToUse = isShuffling ? shuffledPlaylist : currentPlaylistData;

        if (repeatMode === 'one') {
            loadSong(currentSongIndex);
        } else if (repeatMode === 'all' || isShuffling) {
            currentSongIndex = (currentSongIndex + 1) % playlistToUse.length;
            loadSong(currentSongIndex);
        } else { // Repeat off
            if (currentSongIndex < playlistToUse.length - 1) {
                currentSongIndex++;
                loadSong(currentSongIndex);
            } else {
                pauseSong();
                currentSongIndex = 0;
                loadSong(currentSongIndex);
                return;
            }
        }
        if (isPlaying) {
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Mainkan lagu sebelumnya
    function playPrevSong() {
        const playlistToUse = isShuffling ? shuffledPlaylist : currentPlaylistData;

        if (repeatMode === 'one') {
            loadSong(currentSongIndex);
        } else {
            currentSongIndex = (currentSongIndex - 1 + playlistToUse.length) % playlistToUse.length;
            loadSong(currentSongIndex);
        }

        if (isPlaying) {
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // --- Event Listeners (Untuk Interaksi Pengguna) ---

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);

    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
            updateLyricsScroll();
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
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

    // --- Fungsi Playlist (Sekarang dari Firestore) ---

    function buildPlaylist(filterText = '') {
        playlistUl.innerHTML = '';
        const playlistToUse = isShuffling ? shuffledPlaylist : currentPlaylistData;
        const filteredPlaylist = playlistToUse.filter(song =>
            song.title.toLowerCase().includes(filterText.toLowerCase()) ||
            song.artist.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredPlaylist.length === 0 && filterText !== '') {
            const noResultsLi = document.createElement('li');
            noResultsLi.classList.add('no-results');
            noResultsLi.innerHTML = `<div class="playlist-song-info"><h3>Tidak ada hasil ditemukan.</h3></div>`;
            playlistUl.appendChild(noResultsLi);
            return;
        }

        filteredPlaylist.forEach((song, index) => {
            const li = document.createElement('li');
            // Gunakan index dari playlistToUse (currentPlaylistData atau shuffledPlaylist)
            // untuk loadSong agar tidak bingung saat shuffle/filter
            const actualIndexInCurrentData = currentPlaylistData.findIndex(s => s.id === song.id); // Temukan index di data asli
            li.setAttribute('data-original-index', actualIndexInCurrentData); // Simpan indeks asli Firestore
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => {
                // Saat diklik, gunakan indeks asli untuk memuat lagu dari currentPlaylistData
                currentSongIndex = parseInt(li.getAttribute('data-original-index'));
                loadSong(currentSongIndex);
                playSong();
                hidePlaylistSidebar();
            });
            playlistUl.appendChild(li);
        });
        updatePlaylistActiveState(currentSongIndex);
    }

    function updatePlaylistActiveState(activeIndex) {
        const playlistItems = playlistUl.querySelectorAll('li');
        if (!playlistItems.length) return;

        playlistItems.forEach(item => item.classList.remove('active'));

        // Temukan item yang aktif berdasarkan data-original-index
        const activeItem = playlistUl.querySelector(`li[data-original-index="${activeIndex}"]`);
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

    function showPlaylistSidebar() {
        playlistSidebar.classList.add('visible');
        sidebarOverlay.classList.add('visible');
    }

    function hidePlaylistSidebar() {
        playlistSidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    }

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

    sidebarOverlay.addEventListener('click', () => {
        hidePlaylistSidebar();
    });

    // --- Sleep Timer Functions ---

    function showTimerModal() {
        updateAllTimerDisplays();
        timerModal.classList.add('visible');
        modalOverlay.classList.add('visible');
    }

    function hideTimerModal() {
        timerModal.classList.remove('visible');
        modalOverlay.classList.remove('visible');
        timerOptionBtns.forEach(btn => btn.classList.remove('selected'));
        customTimerInput.value = '';
    }

    function startSleepTimer(minutes) {
        clearTimeout(sleepTimerTimeoutId);
        clearInterval(sleepTimerIntervalId);

        timeRemaining = minutes * 60;

        if (timeRemaining <= 0) {
            alert("Durasi timer harus lebih dari 0 menit.");
            resetSleepTimer();
            return;
        }

        sleepTimerTimeoutId = setTimeout(() => {
            pauseSong();
            alert("Sleep timer selesai! Musik dijeda.");
            resetSleepTimer();
            hideTimerModal();
        }, timeRemaining * 1000);

        sleepTimerIntervalId = setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(sleepTimerIntervalId);
            }
            updateAllTimerDisplays();
        }, 1000);

        updateAllTimerDisplays();
        hideTimerModal();
    }

    function updateAllTimerDisplays() {
        const displayTime = formatTime(timeRemaining);

        if (timeRemaining > 0) {
            playerTimerDisplay.style.display = 'flex';
            playerTimerCountdown.textContent = displayTime;

            modalActiveTimerDisplay.style.display = 'flex';
            modalTimerCountdown.textContent = displayTime;
            modalCancelTimerBtn.style.display = 'inline-block';
        } else {
            playerTimerDisplay.style.display = 'none';
            modalActiveTimerDisplay.style.display = 'none';
            modalCancelTimerBtn.style.display = 'none';
        }
    }

    function resetSleepTimer() {
        clearTimeout(sleepTimerTimeoutId);
        clearInterval(sleepTimerIntervalId);
        sleepTimerTimeoutId = null;
        sleepTimerIntervalId = null;
        timeRemaining = 0;
        updateAllTimerDisplays();
    }

    // Timer Event Listeners
    setTimerBtn.addEventListener('click', showTimerModal);
    closeModalBtn.addEventListener('click', hideTimerModal);
    // Pastikan modalOverlay menutup kedua modal jika diklik
    modalOverlay.addEventListener('click', () => {
        hideTimerModal();
        hideAudioSettingsModal();
        hideAdminPanelModal();
    });


    timerOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timerOptionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const minutes = parseInt(btn.dataset.minutes);
            startSleepTimer(minutes);
        });
    });

    setCustomTimerBtn.addEventListener('click', () => {
        const minutes = parseInt(customTimerInput.value);
        if (minutes > 0) {
            timerOptionBtns.forEach(b => b.classList.remove('selected'));
            startSleepTimer(minutes);
        } else {
            alert("Mohon masukkan durasi timer yang valid (lebih dari 0 menit).");
        }
    });

    playerCancelTimerBtn.addEventListener('click', () => {
        resetSleepTimer();
        alert("Sleep timer dibatalkan.");
    });

    modalCancelTimerBtn.addEventListener('click', () => {
        resetSleepTimer();
        alert("Sleep timer dibatalkan.");
        hideTimerModal();
    });

    // --- Audio Settings Modal Functions ---
    function showAudioSettingsModal() {
        audioSettingsModal.classList.add('visible');
        modalOverlay.classList.add('visible');
        // Pastikan slider volume modal diperbarui dengan nilai masterGainNode saat dibuka
        if (masterGainNode) {
            masterVolumeSlider.value = masterGainNode.gain.value * 100;
            masterVolumeValue.textContent = `${Math.round(masterGainNode.gain.value * 100)}%`;
        }
        if (bassFilter) {
            bassLevelSlider.value = bassFilter.gain.value;
            bassLevelValue.textContent = `${bassFilter.gain.value.toFixed(1)} dB`;
        }
        if (midFilter) {
            midLevelSlider.value = midFilter.gain.value;
            midLevelValue.textContent = `${midFilter.gain.value.toFixed(1)} dB`;
        }
        if (trebleFilter) {
            trebleLevelSlider.value = trebleFilter.gain.value;
            trebleLevelValue.textContent = `${trebleFilter.gain.value.toFixed(1)} dB`;
        }
        if (effectGainNode) {
            effectLevelSlider.value = effectGainNode.gain.value * 100;
            effectLevelValue.textContent = `${Math.round(effectGainNode.gain.value * 100)}%`;
        }
        // Pastikan tidak ada preset yang terpilih saat modal dibuka
        eqPresetBtns.forEach(btn => btn.classList.remove('selected'));
    }

    function hideAudioSettingsModal() {
        audioSettingsModal.classList.remove('visible');
        modalOverlay.classList.remove('visible');
    }

    audioSettingsBtn.addEventListener('click', showAudioSettingsModal);
    closeAudioSettingsModalBtn.addEventListener('click', hideAudioSettingsModal);

    // --- Audio Control Sliders Event Listeners ---
    masterVolumeSlider.addEventListener('input', () => {
        if (masterGainNode) {
            masterGainNode.gain.value = masterVolumeSlider.value / 100;
            masterVolumeValue.textContent = `${masterVolumeSlider.value}%`;
        }
    });

    bassLevelSlider.addEventListener('input', () => {
        if (bassFilter) {
            bassFilter.gain.value = parseFloat(bassLevelSlider.value);
            bassLevelValue.textContent = `${bassLevelSlider.value} dB`;
        }
    });

    midLevelSlider.addEventListener('input', () => {
        if (midFilter) {
            midFilter.gain.value = parseFloat(midLevelSlider.value);
            midLevelValue.textContent = `${midLevelSlider.value} dB`;
        }
    });

    trebleLevelSlider.addEventListener('input', () => {
        if (trebleFilter) {
            trebleFilter.gain.value = parseFloat(trebleLevelSlider.value);
            trebleLevelValue.textContent = `${trebleLevelSlider.value} dB`;
        }
    });

    effectLevelSlider.addEventListener('input', () => {
        if (effectGainNode) {
            effectGainNode.gain.value = effectLevelSlider.value / 100;
            effectLevelValue.textContent = `${effectLevelSlider.value}%`;
        }
    });

    // --- EQ Presets Logic ---
    const eqPresets = {
        'flat': { bass: 0, mid: 0, treble: 0 },
        'pop': { bass: 6, mid: -3, treble: 8 },
        'rock': { bass: 7, mid: -4, treble: 7 },
        'jazz': { bass: 5, mid: 2, treble: 4 }
    };

    eqPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.dataset.preset;
            const preset = eqPresets[presetName];

            if (preset && bassFilter && midFilter && trebleFilter) {
                bassFilter.gain.value = preset.bass;
                midFilter.gain.value = preset.mid;
                trebleFilter.gain.value = preset.treble;

                // Update slider UI
                bassLevelSlider.value = preset.bass;
                midLevelSlider.value = preset.mid;
                trebleLevelSlider.value = preset.treble;

                // Update value displays
                bassLevelValue.textContent = `${preset.bass} dB`;
                midLevelValue.textContent = `${preset.mid} dB`;
                trebleLevelValue.textContent = `${preset.treble} dB`;

                // Update active state for preset buttons
                eqPresetBtns.forEach(pBtn => pBtn.classList.remove('selected'));
                btn.classList.add('selected');
            }
        });
    });


    // --- Shuffle and Repeat Functions ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
        }
        return array;
    }

    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        if (isShuffling) {
            shuffleBtn.classList.add('active');
            // Buat salinan playlist asli dan acak
            originalPlaylistOrder = [...currentPlaylistData]; // Simpan urutan asli dari Firestore
            shuffledPlaylist = shuffleArray([...currentPlaylistData]); // Acak salinan
            // Perbarui currentSongIndex ke posisi lagu saat ini di playlist yang diacak
            const currentSong = currentPlaylistData[currentSongIndex]; // Lagu yang sedang diputar (dari playlist asli)
            currentSongIndex = shuffledPlaylist.findIndex(song => song.id === currentSong.id); // Cari berdasarkan ID Firestore
        } else {
            shuffleBtn.classList.remove('active');
            // Kembali ke urutan playlist asli
            const currentSong = shuffledPlaylist[currentSongIndex]; // Lagu yang sedang diputar (dari playlist acak)
            currentSongIndex = originalPlaylistOrder.findIndex(song => song.id === currentSong.id); // Cari berdasarkan ID Firestore
        }
        buildPlaylist(playlistSearchInput.value); // Rebuild playlist tampilan
        updatePlaylistActiveState(currentSongIndex); // Perbarui highlight
    });

    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'off') {
            repeatMode = 'all';
            repeatBtn.classList.add('active');
            repeatBtn.innerHTML = '<i class="fas fa-repeat-all"></i>'; // FontAwesome 6
            repeatBtn.setAttribute('aria-label', 'Ulangi Semua Lagu');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.innerHTML = '<i class="fas fa-repeat-1"></i>'; // FontAwesome 6
            repeatBtn.setAttribute('aria-label', 'Ulangi Satu Lagu');
        } else { // repeatMode === 'one'
            repeatMode = 'off';
            repeatBtn.classList.remove('active');
            repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>'; // FontAwesome 6
            repeatBtn.setAttribute('aria-label', 'Ulangi Lagu');
        }
    });

    // --- Playlist Search Function ---
    playlistSearchInput.addEventListener('input', (event) => {
        buildPlaylist(event.target.value);
    });

    // --- Interactive Lyrics (Auto-scroll) ---
    function updateLyricsScroll() {
        const lyricsLines = lyricsText.querySelectorAll('p, b');
        if (lyricsLines.length === 0 || isNaN(audioPlayer.duration) || audioPlayer.duration === 0) {
            return;
        }

        lyricsText.querySelectorAll('.active-lyric').forEach(line => line.classList.remove('active-lyric'));

        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration);
        const estimatedLineIndex = Math.floor(progressPercentage * lyricsLines.length);

        if (estimatedLineIndex < lyricsLines.length) {
            const activeLine = lyricsLines[estimatedLineIndex];
            activeLine.classList.add('active-lyric');

            const lyricsSectionHeight = lyricsText.clientHeight;
            const lineHeight = activeLine.offsetHeight;
            const lineOffsetTop = activeLine.offsetTop;

            const scrollTo = lineOffsetTop - (lyricsSectionHeight / 2) + (lineHeight / 2);

            lyricsText.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        }
    }

    // --- Audio Visualizer ---
    function drawVisualizer() {
        if (!analyser || !isPlaying) {
            return;
        }

        requestAnimationFrame(drawVisualizer);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        visualizerCtx.clearRect(0, 0, audioVisualizerCanvas.width, audioVisualizerCanvas.height);

        const barWidth = (audioVisualizerCanvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] * 2;

            const gradient = visualizerCtx.createLinearGradient(0, audioVisualizerCanvas.height, 0, audioVisualizerCanvas.height - barHeight);
            gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--visualizer-fade-color'));
            gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--visualizer-bar-color'));

            visualizerCtx.fillStyle = gradient;
            visualizerCtx.fillRect(x, audioVisualizerCanvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    // Atur ukuran canvas agar responsif
    function resizeCanvas() {
        audioVisualizerCanvas.width = window.innerWidth;
        audioVisualizerCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Theme Toggle Function ---
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);

        if (theme === 'light-theme') {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
            themeToggleBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
            themeToggleBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentThemeClass = document.body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
        if (currentThemeClass === 'dark-theme') {
            applyTheme('light-theme');
        } else {
            applyTheme('dark-theme');
        }
    });

    // --- Admin Panel Functions (NEW) ---
    function showAdminPanelModal() {
        adminPanelModal.classList.add('visible');
        modalOverlay.classList.add('visible');
        loadAdminSongList(); // Muat daftar lagu saat modal admin dibuka
    }

    function hideAdminPanelModal() {
        adminPanelModal.classList.remove('visible');
        modalOverlay.classList.remove('visible');
        addSongForm.reset(); // Reset form saat modal ditutup
    }

    adminPanelBtn.addEventListener('click', showAdminPanelModal);
    closeAdminPanelModalBtn.addEventListener('click', hideAdminPanelModal);

    addSongForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = addTitleInput.value;
        const artist = addArtistInput.value;
        const src = addSrcInput.value;
        const albumArt = addAlbumArtInput.value;
        const lyrics = addLyricsInput.value;

        try {
            await addDoc(collection(db, `artifacts/${appId}/public/songs`), {
                title,
                artist,
                src,
                albumArt,
                lyrics,
                createdAt: new Date() // Tambahkan timestamp
            });
            alert("Lagu berhasil ditambahkan!");
            addSongForm.reset();
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Gagal menambahkan lagu. Pastikan Anda admin dan koneksi internet stabil.");
        }
    });

    async function loadAdminSongList() {
        adminSongListUl.innerHTML = '<p>Memuat lagu...</p>';
        try {
            const q = collection(db, `artifacts/${appId}/public/songs`);
            const unsubscribe = onSnapshot(q, (snapshot) => {
                adminSongListUl.innerHTML = ''; // Bersihkan sebelum membangun ulang
                if (snapshot.empty) {
                    adminSongListUl.innerHTML = '<p>Belum ada lagu di daftar putar.</p>';
                    return;
                }
                snapshot.forEach((doc) => {
                    const song = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="admin-song-info">
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                        <div class="admin-song-actions">
                            <button class="edit-btn" data-id="${doc.id}" data-title="${song.title}" data-artist="${song.artist}" data-src="${song.src}" data-album-art="${song.albumArt}" data-lyrics="${song.lyrics || ''}">Edit</button>
                            <button class="delete-btn" data-id="${doc.id}">Hapus</button>
                        </div>
                    `;
                    adminSongListUl.appendChild(li);
                });
            });
            // Penting: Mengembalikan unsubscribe function agar bisa di-cleanup saat tidak dibutuhkan
            // Namun, untuk admin panel yang selalu aktif, ini mungkin tidak perlu di-cleanup
            // secara eksplisit kecuali jika modal ditutup secara permanen.
        } catch (e) {
            console.error("Error loading admin song list: ", e);
            adminSongListUl.innerHTML = '<p>Gagal memuat daftar lagu admin.</p>';
        }
    }

    adminSongListUl.addEventListener('click', async (e) => {
        const target = e.target;
        const songId = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            if (confirm("Apakah Anda yakin ingin menghapus lagu ini?")) {
                try {
                    await deleteDoc(doc(db, `artifacts/${appId}/public/songs`, songId));
                    alert("Lagu berhasil dihapus!");
                } catch (e) {
                    console.error("Error deleting document: ", e);
                    alert("Gagal menghapus lagu. Pastikan Anda admin dan koneksi internet stabil.");
                }
            }
        } else if (target.classList.contains('edit-btn')) {
            // Isi form dengan data lagu yang akan diedit
            addTitleInput.value = target.dataset.title;
            addArtistInput.value = target.dataset.artist;
            addSrcInput.value = target.dataset.src;
            addAlbumArtInput.value = target.dataset.albumArt;
            addLyricsInput.value = target.dataset.lyrics;

            // Ubah tombol submit menjadi tombol update
            const submitBtn = addSongForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Update Lagu";
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-secondary'); // Bisa buat style khusus untuk update

            // Simpan ID lagu yang sedang diedit
            submitBtn.dataset.editId = songId;

            // Scroll ke atas form
            adminPanelModal.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    addSongForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.submitter; // Dapatkan tombol yang disubmit
        const editId = submitBtn.dataset.editId; // Ambil ID jika sedang mode edit

        const songData = {
            title: addTitleInput.value,
            artist: addArtistInput.value,
            src: addSrcInput.value,
            albumArt: addAlbumArtInput.value,
            lyrics: addLyricsInput.value,
        };

        try {
            if (editId) {
                // Mode Update
                await updateDoc(doc(db, `artifacts/${appId}/public/songs`, editId), songData);
                alert("Lagu berhasil diperbarui!");
                submitBtn.dataset.editId = ''; // Hapus ID edit
                submitBtn.textContent = "Tambah Lagu"; // Kembalikan teks tombol
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
            } else {
                // Mode Tambah Baru
                await addDoc(collection(db, `artifacts/${appId}/public/songs`), {
                    ...songData,
                    createdAt: new Date()
                });
                alert("Lagu berhasil ditambahkan!");
            }
            addSongForm.reset();
        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Gagal menyimpan lagu. Pastikan Anda admin dan koneksi internet stabil.");
        }
    });


    // --- Inisialisasi Aplikasi (Fungsi yang Berjalan Saat Halaman Dimuat) ---
    // Inisialisasi Firebase
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // Autentikasi anonim untuk semua pengguna
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUserUid = user.uid;
                console.log("UID Pengguna: ", currentUserUid);

                // Tampilkan tombol admin jika UID cocok dengan ADMIN_UID
                if (currentUserUid === ADMIN_UID) {
                    adminPanelBtn.style.display = 'flex'; // Tampilkan tombol admin
                    console.log("Anda adalah Admin.");
                } else {
                    adminPanelBtn.style.display = 'none';
                    console.log("Anda adalah pengguna biasa.");
                }

                // Muat playlist dari Firestore setelah autentikasi
                const playlistCollectionRef = collection(db, `artifacts/${appId}/public/songs`);
                onSnapshot(playlistCollectionRef, (snapshot) => {
                    const fetchedPlaylist = [];
                    snapshot.forEach((doc) => {
                        fetchedPlaylist.push({ id: doc.id, ...doc.data() });
                    });
                    // Urutkan playlist berdasarkan createdAt (atau properti lain jika ada)
                    fetchedPlaylist.sort((a, b) => (a.createdAt?.toDate() || 0) - (b.createdAt?.toDate() || 0));
                    currentPlaylistData = fetchedPlaylist;
                    originalPlaylistOrder = [...currentPlaylistData]; // Update original for shuffle

                    if (currentPlaylistData.length > 0) {
                        // Jika lagu yang sedang diputar tidak ada lagi di playlist, reset ke 0
                        const currentSongExists = currentPlaylistData.some(song => song.id === (currentPlaylistData[currentSongIndex] && currentPlaylistData[currentSongIndex].id));
                        if (!currentSongExists && currentPlaylistData.length > 0) {
                             currentSongIndex = 0; // Reset ke lagu pertama jika lagu saat ini dihapus
                             loadSong(currentSongIndex);
                             pauseSong(); // Jeda setelah reset
                        } else if (currentPlaylistData.length > 0) {
                            // Muat ulang lagu saat ini untuk memastikan data terbaru
                            loadSong(currentSongIndex);
                        } else {
                            // Jika playlist kosong
                            currentSongTitle.textContent = "Tidak ada lagu";
                            currentArtistName.textContent = "Tambahkan lagu sebagai admin";
                            lyricsText.innerHTML = "<p>Daftar putar kosong.</p>";
                            pauseSong();
                        }
                        buildPlaylist(playlistSearchInput.value); // Rebuild UI playlist
                    } else {
                        // Jika playlist kosong dari awal atau setelah dihapus semua
                        currentSongTitle.textContent = "Tidak ada lagu";
                        currentArtistName.textContent = "Tambahkan lagu sebagai admin";
                        lyricsText.innerHTML = "<p>Daftar putar kosong.</p>";
                        pauseSong();
                        buildPlaylist(); // Kosongkan tampilan playlist
                    }
                });

            } else {
                // Pengguna belum terautentikasi, coba sign in anonim
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Error signing in:", error);
                    alert("Gagal terhubung ke layanan autentikasi. Beberapa fitur mungkin tidak berfungsi.");
                }
            }
        });

        // Inisialisasi slider volume modal dengan nilai default
        masterVolumeSlider.value = 100;
        masterVolumeValue.textContent = '100%';
        bassLevelSlider.value = 0;
        bassLevelValue.textContent = '0 dB';
        midLevelSlider.value = 0;
        midLevelValue.textContent = '0 dB';
        trebleLevelSlider.value = 0;
        trebleLevelValue.textContent = '0 dB';
        effectLevelSlider.value = 0;
        effectLevelValue.textContent = '0%';

        // Muat preferensi tema
        const savedTheme = localStorage.getItem('theme') || 'dark-theme';
        applyTheme(savedTheme);

        updateAllTimerDisplays(); // Inisialisasi tampilan timer

    } catch (error) {
        console.error("Gagal menginisialisasi Firebase:", error);
        alert("Terjadi kesalahan saat menginisialisasi Firebase. Pastikan konfigurasi Anda benar.");
        // Fallback jika Firebase gagal total
        currentSongTitle.textContent = "Error Aplikasi";
        currentArtistName.textContent = "Cek konsol browser untuk detail.";
        lyricsText.innerHTML = "<p>Aplikasi gagal dimuat karena masalah konfigurasi. Silakan periksa konsol browser.</p>";
    }
});
