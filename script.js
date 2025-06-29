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

    // --- Elemen DOM untuk Timer ---
    const toggleTimerBtn = document.getElementById('toggle-timer-btn');
    const timerModal = document.getElementById('timer-modal');
    const closeTimerBtn = document.getElementById('close-timer-btn');
    const timerMinutesInput = document.getElementById('timer-minutes');
    const timerPresetButtons = document.querySelectorAll('.timer-preset');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const cancelTimerBtn = document.getElementById('cancel-timer-btn');
    const timerCountdownDisplay = document.getElementById('timer-countdown');

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let timerInterval = null;
    let timeRemaining = 0;

    let lyricLines = [];
    let currentLyricLineIndex = -1;
    let lyricsScrollInterval = null;
    let estimatedLineDuration = 0;
    let introOffset = 0;

    // --- DATA LAGU ---
    const playlist = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3",
            albumArt: "album_art_back_to_friends.jpg",
            introOffset: 12,
            lyrics: `
                Touch my body tender
                'Cause the feeling makes me weak
                Kicking off the covers
                I see the ceiling while you're looking down at me
                ...
                I'm someone you've never met
                When we just shared a bed?
            `
        },
        // Tambahkan lagu lainnya di sini...
    ];

    // --- Fungsi Utama Pemutar Musik ---
    function loadSong(songIndex) {
        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist.");
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

        introOffset = song.introOffset || 0;

        // --- Proses Lirik ---
        lyricsText.innerHTML = '';
        lyricLines = [];

        const cleanedLyrics = song.lyrics
            .replace(/<\/?b>/g, '')
            .replace(/🎶\s*[\w\s\.-]+\s*–\s*[\w\s\.-]+/g, '')
            .replace(/(Verse|Chorus|Bridge|Outro|Intro)\s*\d*\s*|\((Verse|Chorus|Bridge|Outro|Intro)\s*\d*\)/gi, '')
            .trim();

        const lines = cleanedLyrics.split('\n')
                                   .map(line => line.trim())
                                   .filter(line => line.length > 0);

        lines.forEach(line => {
            const p = document.createElement('p');
            p.classList.add('lyric-line');
            p.textContent = line;
            lyricsText.appendChild(p);
            lyricLines.push(p);
        });

        estimatedLineDuration = 0;

        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        updatePlaylistActiveState(songIndex);

        // === MEDIA SESSION API ===
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

            navigator.mediaSession.setActionHandler('play', playSong);
            navigator.mediaSession.setActionHandler('pause', pauseSong);
            navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
            navigator.mediaSession.setActionHandler('previoustrack', playPrevSong);
        }
    }

    function playSong() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded or invalid. Cannot play.");
            return;
        }

        audioPlayer.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pause');
            startLyricsAutoScroll();
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        stopLyricsAutoScroll();
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // --- Event Listeners ---
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
        if (!isNaN(audioPlayer.duration) && lyricLines.length > 0 && estimatedLineDuration > 0) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);

            if (audioPlayer.currentTime >= introOffset) {
                const timeAfterIntro = audioPlayer.currentTime - introOffset;
                const newIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));

                if (newIndex !== currentLyricLineIndex) {
                    currentLyricLineIndex = newIndex;
                    updateLyricsScroll();
                }
            } else {
                if (currentLyricLineIndex !== -1) {
                    currentLyricLineIndex = -1;
                    lyricLines.forEach(line => line.classList.remove('active-lyric'));
                }
            }
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
            if (lyricLines.length > 0) {
                const outroCompensation = 3;
                const effectiveDuration = Math.max(0, audioPlayer.duration - introOffset - outroCompensation);
                estimatedLineDuration = effectiveDuration / lyricLines.length;
            } else {
                estimatedLineDuration = 0;
            }

            if (isPlaying && lyricLines.length > 0 && lyricsScrollInterval === null && estimatedLineDuration > 0) {
                startLyricsAutoScroll();
            }
        } else {
            durationSpan.textContent = '0:00';
            estimatedLineDuration = 0;
        }
    });

    progressBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration)) {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
            if (seekTime >= introOffset) {
                const timeAfterIntro = seekTime - introOffset;
                currentLyricLineIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));
            } else {
                currentLyricLineIndex = -1;
            }
            updateLyricsScroll(true);
            if (isPlaying && lyricsScrollInterval === null && estimatedLineDuration > 0) {
                startLyricsAutoScroll();
            }
        }
    });

    audioPlayer.addEventListener('ended', playNextSong);

    // --- Fungsi Playlist ---
    function buildPlaylist() {
        playlistUl.innerHTML = '';
        playlist.forEach((song, index) => {
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

        if (activeIndex >= 0 && activeIndex < playlistItems.length) {
            const activeItem = playlistItems[activeIndex];
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

    closePlaylistBtn.addEventListener('click', hidePlaylistSidebar);
    sidebarOverlay.addEventListener('click', hidePlaylistSidebar);

    // --- FUNGSI DAN LOGIKA TIMER ---
    function showTimerModal() {
        timerModal.classList.add('visible');
    }

    function hideTimerModal() {
        timerModal.classList.remove('visible');
    }

    function startTimer(durationInMinutes) {
        stopTimer();

        timeRemaining = durationInMinutes * 60;
        updateTimerDisplay();
        timerCountdownDisplay.style.color = 'var(--accent-red)';
        timerCountdownDisplay.textContent = 'Timer aktif: ' + formatTime(timeRemaining);
        startTimerBtn.classList.add('disabled');
        startTimerBtn.disabled = true;
        cancelTimerBtn.classList.remove('disabled');
        cancelTimerBtn.disabled = false;

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                stopTimer();
                pauseSong();
                timerCountdownDisplay.textContent = 'Timer Selesai!';
                timerCountdownDisplay.style.color = 'var(--primary-text)';
                alert("Waktu habis! Musik telah dihentikan.");
                hideTimerModal();
            } else if (timeRemaining <= 60 && timerCountdownDisplay.style.color !== 'red') {
                timerCountdownDisplay.style.color = 'red';
            }
        }, 1000);
        hideTimerModal();
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timeRemaining = 0;
        timerCountdownDisplay.textContent = 'Timer tidak aktif';
        timerCountdownDisplay.style.color = 'var(--secondary-text)';
        startTimerBtn.classList.remove('disabled');
        startTimerBtn.disabled = false;
        cancelTimerBtn.classList.add('disabled');
        cancelTimerBtn.disabled = true;
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerCountdownDisplay.textContent = `Timer aktif: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // --- Event Listeners untuk Timer ---
    toggleTimerBtn.addEventListener('click', showTimerModal);
    closeTimerBtn.addEventListener('click', hideTimerModal);

    startTimerBtn.addEventListener('click', () => {
        const minutes = parseInt(timerMinutesInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert("Harap masukkan durasi timer yang valid (angka positif).");
            return;
        }
        startTimer(minutes);
    });

    cancelTimerBtn.addEventListener('click', stopTimer);

    timerPresetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const minutes = parseInt(button.dataset.minutes);
            timerMinutesInput.value = minutes;
            startTimer(minutes);
        });
    });

    // Inisialisasi awal tampilan timer
    stopTimer();

    // --- FUNGSI DAN LOGIKA AUTO-SCROLL LIRIK ---
    function startLyricsAutoScroll() {
        stopLyricsAutoScroll();

        if (lyricLines.length === 0 || estimatedLineDuration <= 0) {
            console.warn("Lirik tidak tersedia atau durasi baris tidak dapat diestimasi. Auto-scroll lirik dinonaktifkan.");
            return;
        }

        let initialIndex = -1;
        if (audioPlayer.currentTime >= introOffset) {
            const timeAfterIntro = audioPlayer.currentTime - introOffset;
            initialIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));
        }
        currentLyricLineIndex = initialIndex;

        updateLyricsScroll(true);

        lyricsScrollInterval = setInterval(() => {
            if (audioPlayer.currentTime < introOffset) {
                if (currentLyricLineIndex !== -1) {
                    currentLyricLineIndex = -1;
                    lyricLines.forEach(line => line.classList.remove('active-lyric'));
                }
                return;
            }

            const timeAfterIntro = audioPlayer.currentTime - introOffset;
            const newIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));

            if (newIndex !== currentLyricLineIndex) {
                currentLyricLineIndex = newIndex;
                updateLyricsScroll();
            }

            if (audioPlayer.currentTime >= audioPlayer.duration - 0.5) {
                stopLyricsAutoScroll();
            }
        }, 200);
    }

    function stopLyricsAutoScroll() {
        if (lyricsScrollInterval) {
            clearInterval(lyricsScrollInterval);
            lyricsScrollInterval = null;
        }
        lyricLines.forEach(line => line.classList.remove('active-lyric'));
        currentLyricLineIndex = -1;
    }

    function updateLyricsScroll(forceScroll = false) {
        lyricLines.forEach((line, index) => {
            if (index === currentLyricLineIndex) {
                line.classList.add('active-lyric');
                const lyricsSection = document.querySelector('.lyrics-section');
                if (!lyricsSection) return;

                const lineRect = line.getBoundingClientRect();
                const containerRect = lyricsSection.getBoundingClientRect();

                if (forceScroll || lineRect.top < containerRect.top || lineRect.bottom > containerRect.bottom) {
                    line.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else {
                line.classList.remove('active-lyric');
            }
        });
    }

    // --- Inisialisasi Aplikasi ---
    if (playlist.length > 0) {
        loadSong(currentSongIndex);
        buildPlaylist();
    } else {
        console.error("Tidak ada lagu ditemukan di array 'playlist'.");
        currentSongTitle.textContent = "Tidak ada lagu";
        currentArtistName.textContent = "Silakan tambahkan lagu di script.js";
        lyricsText.innerHTML = "<p>Silakan tambahkan file MP3 dan gambar album di folder yang sama, lalu update array 'playlist' di script.js.</p>";
    }
});
