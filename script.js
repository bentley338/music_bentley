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
    const infoText = document.getElementById('info-text');
    const playlistUl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.getElementById('playlist-sidebar');
    const closePlaylistBtn = document.getElementById('close-playlist-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const backgroundVideo = document.getElementById('background-video');

    // Elemen baru untuk UI yang ditingkatkan
    const sleepTimerDisplay = document.getElementById('sleep-timer-display');
    const openSleepTimerModalBtn = document.getElementById('open-sleep-timer-modal');
    const sleepTimerModal = document.getElementById('sleepTimerModal');
    const closeSleepTimerModalBtn = document.getElementById('close-sleep-timer-modal');
    const timerOptionBtns = document.querySelectorAll('.timer-option-btn');
    const customTimerInput = document.getElementById('custom-timer-input');
    const setCustomTimerBtn = document.getElementById('set-custom-timer-btn');
    const sleepTimerCountdown = document.getElementById('sleep-timer-countdown');
    const modalTimerCountdown = document.getElementById('modal-timer-countdown');

    const openAudioModalBtn = document.getElementById('open-audio-modal-btn');
    const audioControlsModal = document.getElementById('audioControlsModal');
    const closeAudioModalBtn = document.getElementById('close-audio-modal');
    const masterVolumeControl = document.getElementById('master-volume');
    const volumeValueSpan = document.getElementById('volume-value');
    const playbackSpeedControl = document.getElementById('playback-speed-control');
    const playbackSpeedValueSpan = document.getElementById('playback-speed-value');
    const trebleControl = document.getElementById('treble-control');
    const trebleValueSpan = document.getElementById('treble-value');
    const midControl = document.getElementById('mid-control');
    const midValueSpan = document.getElementById('mid-value');
    const bassControl = document.getElementById('bass-control');
    const bassValueSpan = document.getElementById('bass-value');
    const effectLevelControl = document.getElementById('effect-level-control');
    const effectLevelValueSpan = document.getElementById('effect-level-value');

    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const playlistSearchInput = document.getElementById('playlist-search');

    const audioVisualizer = document.getElementById('audio-visualizer');
    const visualizerCtx = audioVisualizer.getContext('2d');

    // --- Web Audio API untuk EQ, Effect Level, dan Visualizer ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source;
    const gainNode = audioContext.createGain();
    const bassFilter = audioContext.createBiquadFilter();
    const midFilter = audioContext.createBiquadFilter();
    const trebleFilter = audioContext.createBiquadFilter();
    const effectLevelGainNode = audioContext.createGain();
    const analyser = audioContext.createAnalyser();

    // Pengaturan Filter EQ
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.setValueAtTime(250, audioContext.currentTime);
    midFilter.type = 'peaking';
    midFilter.frequency.setValueAtTime(1000, audioContext.currentTime);
    midFilter.Q.setValueAtTime(1, audioContext.currentTime);
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.setValueAtTime(2500, audioContext.currentTime);

    // Pengaturan Analyser
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let sleepTimerId = null;
    let sleepTimerEndTime = 0;
    let shuffleMode = false;
    let repeatMode = 'off'; // 'off', 'one', 'all'
    let originalPlaylistOrder = [];
    let autoplayBlocked = false;

    // --- DATA LAGU (LOAD DARI LOCALSTORAGE ATAU DEFAULT) ---
    let playlist = JSON.parse(localStorage.getItem('musicPlaylist')) || [
        {
            title: "Guilty as Sin?",
            artist: "Taylor Swift",
            src: "guilty_as_sin.mp3",
            albumArt: "album_art_guilty_as_sin.jpg",
            info: `<b>🎶 Guilty as Sin? – Taylor Swift</b><br><br>
                Lagu ini mengeksplorasi nuansa moral dan godaan dalam sebuah hubungan. Taylor Swift merenungkan garis tipis antara keinginan yang bersalah dan kesetiaan yang tak tergoyahkan. Dengan lirik yang introspektif dan melodi yang memikat, lagu ini menggambarkan pergulatan batin saat menghadapi pertanyaan tentang loyalitas dan batas-batas emosional, membuat pendengar bertanya: apakah keinginan saja sudah cukup untuk merasa bersalah seperti dosa?`
        },
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3",
            albumArt: "album_art_back_to_friends.jpg",
            info: `<b>🎶 Back to Friends – Sombr</b><br><br>
                Lagu ini menggambarkan kerumitan transisi dari hubungan romantis ke pertemanan. Liriknya, "How can we go back to being friends when we just shared a bed?", menyoroti kebingungan dan kesulitan emosional setelah melewati batas dalam sebuah hubungan. Dibuat dengan melodi yang melankolis namun memikat, lagu ini cocok untuk siapa saja yang pernah merasakan dilema serupa.`
        },
        {
            title: "Bergema Sampai Selamanya",
            artist: "Nadhif Basalamah",
            src: "bergema_sampai_selamanya.mp3",
            albumArt: "album_art_bergema_sampai_selamanya.jpg",
            info: `<b>🎶 Bergema Sampai Selamanya – Nadhif Basalamah</b><br><br>
                Lagu ini adalah ode untuk cinta abadi yang tidak akan pernah pudar oleh waktu. Melalui lirik puitis, Nadhif Basalamah menangkap esensi dari ikatan yang mendalam, di mana setiap napas dan langkah diisi dengan kenangan tak terlupakan. Makna dari lagu ini adalah tentang janji yang terukir abadi di jiwa, sebuah pengingat bahwa cinta sejati akan selalu bergema, melewati batas ruang dan waktu.`
        },
        {
            title: "Ride",
            artist: "SoMo",
            src: "ride.mp3",
            albumArt: "album_art_ride.jpg",
            info: `<b>🎶 Ride – SoMo</b><br><br>
                "Ride" adalah lagu yang merayakan kebebasan dan kegembiraan dalam menikmati hidup tanpa beban. SoMo mengajak pendengar untuk melepaskan kekhawatiran dan menikmati setiap momen perjalanan. Inspirasi di balik lagu ini adalah tentang menjalani hidup dengan santai, seperti mengendarai mobil di bawah langit cerah tanpa tujuan pasti, hanya menikmati kebersamaan dan keindahan yang ada.`
        },
        {
            title: "Rumah Kita",
            artist: "God Bless",
            src: "rumah_kita.mp3",
            albumArt: "album_art_rumah_kita.jpg",
            info: `<b>🎶 Rumah Kita – God Bless</b><br><br>
                Lagu legendaris dari God Bless ini adalah metafora tentang kesederhanaan dan kehangatan sebuah rumah, bukan dari kemewahannya, melainkan dari cinta dan kebersamaan di dalamnya. "Rumah Kita" diciptakan sebagai pengingat bahwa kebahagiaan sejati ditemukan dalam ikatan keluarga dan tempat di mana kita merasa aman dan dicintai, jauh lebih berharga dari istana mana pun.`
        },
        {
            title: "Style",
            artist: "Taylor Swift",
            src: "style.mp3",
            albumArt: "album_art_style.jpg",
            info: `<b>🎶 Style – Taylor Swift</b><br><br>
                "Style" adalah lagu yang menangkap dinamika hubungan yang rumit namun tak terhindarkan, di mana dua individu terus-menerus kembali satu sama lain, seperti "we never go out of style". Lagu ini menceritakan tentang daya tarik yang kuat dan tak lekang oleh waktu antara dua orang yang, meskipun menghadapi pasang surut, selalu menemukan jalan kembali. Dibuat dengan sentuhan pop yang kental dan nuansa 80-an.`
        },
        {
            title: "Message In A Bottle",
            artist: "Taylor Swift",
            src: "message_in_a_bottle.mp3",
            albumArt: "album_art_message_in_a_bottle.jpg",
            info: `<b>🎶 Message In A Bottle – Taylor Swift</b><br><br>
                Terinspirasi dari perasaan kerinduan dan harapan, "Message In A Bottle" adalah lagu yang menggambarkan upaya untuk menjaga kenangan dan cinta tetap hidup, meskipun terpisah jarak. Seperti pesan dalam botol yang dilemparkan ke lautan, lagu ini adalah doa agar suatu hari pesan cinta dan kenangan akan menemukan jalannya kembali kepada orang yang dituju. Melodinya yang menyentuh hati mencerminkan emosi mendalam tentang kehilangan dan harapan.`
        },
        {
            title: "Supernatural",
            artist: "Ariana Grande",
            src: "supernatural.mp3",
            albumArt: "album_art_supernatural.jpg",
            info: `<b>🎶 Supernatural – Ariana Grande</b><br><br>
                "Supernatural" adalah lagu yang merayakan cinta yang terasa di luar dunia ini, ajaib dan tak dapat dijelaskan. Ariana Grande menyanyikan tentang hubungan yang begitu mendalam sehingga terasa seperti takdir, di mana setiap sentuhan dan pandangan menciptakan alam semesta baru. Makna lagu ini adalah tentang menemukan koneksi spiritual yang unik dan ilahi dengan seseorang, yang melampaui logika dan membuat segalanya terasa alami dan sempurna.`
        },
        {
            title: "Favorite Lesson",
            artist: "Yaeow",
            src: "favorite_lesson.mp3",
            albumArt: "album_art_favorite_lesson.jpg",
            info: `<b>🎶 Favorite Lesson – Yaeow</b><br><br>
                Lagu ini adalah penghormatan tulus kepada seseorang yang selalu memberikan pelajaran berharga dalam hidup. Yaeow mengungkapkan rasa syukur atas bimbingan dan dukungan tak henti, yang membantu melewati kesulitan dan tumbuh menjadi pribadi yang lebih baik. Lagu ini dibuat sebagai pengingat akan pentingnya memiliki seseorang yang selalu mendorong, menguji, dan menjadi sumber inspirasi sejati, menjadikan setiap pelajaran sebagai yang terbaik.`
        },
        {
            title: "So High School",
            artist: "Taylor Swift",
            src: "so_high_school.mp3",
            albumArt: "album_art_so_high_school.jpg",
            info: `<b>🎶 So High School – Taylor Swift</b><br><br>
                "So High School" menangkap perasaan gembira dan malu-malu dari romansa remaja pertama yang intens. Taylor Swift menggambarkan momen-momen klasik cinta masa SMA, dari kupu-kupu di perut hingga bisikan rahasia, yang membuat segalanya terasa baru dan istimewa. Lagu ini merayakan kemurnian dan kegembiraan dari jatuh cinta pertama, di mana setiap interaksi terasa seperti adegan dari film romantis, tanpa beban dan penuh impian.`
        },
        {
            title: "Photograph",
            artist: "Ed Sheeran",
            src: "photograph.mp3",
            albumArt: "album_art_photograph.jpg",
            info: `<b>🎶 Photograph – Ed Sheeran</b><br><br>
                "Photograph" adalah balada yang menyentuh tentang kenangan yang abadi dan janji untuk selalu ada, bahkan ketika jarak memisahkan. Ed Sheeran menggunakan metafora foto untuk menggambarkan bagaimana kenangan seseorang tetap hidup dalam hati, memberikan kekuatan dan kenyamanan. Lagu ini adalah pengingat bahwa meskipun "loving can hurt", cinta dan kenangan yang indah adalah satu-satunya hal yang kita bawa saat pergi, janji untuk selalu menunggu dan berada di sana.`
        },
        {
            title: "You'll Be In My Heart",
            artist: "Niki",
            src: "youll_be_in_my_heart.mp3",
            albumArt: "album_art_youll_be_in_my_heart.jpg",
            info: `<b>🎶 You'll Be In My Heart – Niki</b><br><br>
                Lagu ini adalah sebuah lagu pengantar tidur dan janji perlindungan abadi, awalnya dari film Tarzan. Versi Niki membawa kehangatan dan ketenangan yang sama, menekankan ikatan tak terpisahkan antara dua jiwa. Makna lagu ini adalah tentang cinta tanpa syarat yang akan selalu ada, mengatasi keraguan dan perbedaan, memberikan rasa aman dan kenyamanan yang mendalam, karena "you'll be in my heart, from this day on, now and forever more."`
        },
        {
            title: "Tarot",
            artist: ".Feast",
            src: "tarot.mp3",
            albumArt: "album_art_tarot.jpg",
            info: `<b>🎶 Tarot – .Feast</b><br><br>
                "Tarot" oleh .Feast adalah eksplorasi tentang takdir, pilihan, dan rahasia kehidupan yang terungkap melalui kartu tarot. Lagu ini mengajak pendengar untuk membuka mata terhadap petunjuk yang tersembunyi, memahami bahwa takdir bukanlah garis tangan semata, melainkan hasil dari keberanian menghadapi persimpangan dan badai. Dengan melodi yang misterius, lagu ini merenungkan bagaimana setiap simbol dan pilihan membentuk kisah kita yang abadi.`
        },
        {
            title: "O, Tuan",
            artist: ".Feast",
            src: "o_tuan.mp3",
            albumArt: "album_art_o_tuan.jpg",
            info: `<b>🎶 O, Tuan – .Feast</b><br><br>
                "O, Tuan" adalah lagu dengan nuansa kritik sosial dan pencarian kebenaran di tengah hiruk pikuk dunia. .Feast menyuarakan rintihan hati yang resah, mencari makna di balik janji-janji kosong dan kemunafikan kekuasaan. Lagu ini adalah seruan untuk bimbingan, mengingatkan bahwa meskipun harta dan kekuasaan bisa membutakan, keadilan akan selalu hidup dan menjadi tumpuan sampai akhir.`
        },
        {
            title: "Ramai Sepi Bersama",
            artist: "Hindia",
            src: "ramai_sepi_bersama.mp3",
            albumArt: "album_art_ramai_sepi_bersama.jpg",
            info: `<b>🎶 Ramai Sepi Bersama – Hindia</b><br><br>
                Lagu ini menangkap paradoks kesendirian di tengah keramaian kota. Hindia merenungkan bagaimana seseorang bisa merasa terasing dan sunyi meskipun dikelilingi banyak orang. "Ramai Sepi Bersama" adalah sebuah perjalanan introspektif untuk mencari arti dan damai sejati di antara ilusi dan bising kehidupan modern, berharap menemukan cahaya di ujung keluh agar tak lagi merasa rapuh.`
        },
        {
            title: "Everything U Are",
            artist: "Hindia",
            src: "everything_u_are.mp3",
            albumArt: "album_art_everything_u_are.jpg",
            info: `<b>🎶 Everything U Are – Hindia</b><br><br>
                "Everything U Are" adalah lagu cinta yang mendalam, merayakan esensi sejati seseorang yang menjadi segalanya bagi pembicara. Hindia menggambarkan bagaimana kehadiran orang tersebut membawa kedamaian dan menjadi bintang penuntun yang menanamkan harapan. Setiap momen bersama terasa ilahi, dan lagu ini adalah pengakuan bahwa keindahan sejati ada dalam setiap sisi dan detail dari orang yang dicintai, sebuah mahakarya yang tak terlukiskan.`
        }
    ];

    originalPlaylistOrder = [...playlist];

    // --- Web Audio API Setup ---
    function setupAudioContext() {
        if (!source) {
            source = audioContext.createMediaElementSource(audioPlayer);
            // Connect nodes: source -> bass -> mid -> treble -> analyser -> effectLevelGain -> gain (master volume) -> destination
            source.connect(bassFilter);
            bassFilter.connect(midFilter);
            midFilter.connect(trebleFilter);
            trebleFilter.connect(analyser);
            analyser.connect(effectLevelGainNode);
            effectLevelGainNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    }

    // --- Audio Visualizer ---
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        const canvasWidth = audioVisualizer.width;
        const canvasHeight = audioVisualizer.height;
        visualizerCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        const barWidth = (canvasWidth / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            let gradient = visualizerCtx.createLinearGradient(0, canvasHeight, 0, 0);
            gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
            visualizerCtx.fillStyle = gradient;

            visualizerCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    // --- Fungsi Utama Pemutar Musik ---

    function loadSong(songIndex) {
        if (playlist.length === 0) {
            console.warn("Playlist kosong. Tidak ada lagu untuk dimuat.");
            // Cek jika ada lagu default yang diatur
            const defaultSong = JSON.parse(localStorage.getItem('defaultMelodyVerseSong'));
            if (defaultSong && defaultSong.src) {
                audioPlayer.src = defaultSong.src;
                currentAlbumArt.src = defaultSong.albumArt || "album_art_default.jpg";
                currentSongTitle.textContent = defaultSong.title || "Lagu Default";
                currentArtistName.textContent = defaultSong.artist || "Artis Default";
                infoText.innerHTML = defaultSong.info || "<p>Tidak ada lagu di playlist utama. Ini adalah lagu default.</p>";
                audioPlayer.load();
                pauseSong();
                return;
            }

            currentSongTitle.textContent = "Tidak ada lagu";
            currentArtistName.textContent = "Tambahkan lagu di panel admin";
            infoText.innerHTML = "<p>Playlist kosong. Silakan tambahkan lagu baru melalui panel admin. Pastikan file MP3 dan gambar album ada di folder yang sama dengan file HTML utama Anda di GitHub Pages.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlist.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            infoText.innerHTML = "<p>Terjadi kesalahan saat memuat info lagu.</p>";
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
        infoText.innerHTML = song.info;
        infoText.scrollTop = 0;

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
        if (audioContext.state === 'suspended') {
            setupAudioContext();
            audioContext.resume().then(() => {
                attemptPlay();
            }).catch(e => {
                console.error("Failed to resume AudioContext:", e);
                displayAutoplayBlockedMessage();
            });
        } else {
            attemptPlay();
        }
    }

    function attemptPlay() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded or invalid. Attempting to load first song.");
            if (playlist.length > 0) {
                loadSong(0);
            } else {
                // If playlist is still empty, and no default song, just return
                return;
            }
        }

        audioPlayer.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Jeda');
            const albumArtImg = document.querySelector('.album-art-img');
            if (albumArtImg) {
                albumArtImg.style.animationPlayState = 'running';
            }
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
            autoplayBlocked = false;
        }).catch(error => {
            console.error("Error playing audio:", error);
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.setAttribute('aria-label', 'Putar');
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                displayAutoplayBlockedMessage();
            }
        });
    }

    function displayAutoplayBlockedMessage() {
        if (!autoplayBlocked) {
            const message = "Autoplay diblokir. Mohon sentuh tombol putar untuk memulai musik.";
            alert(message);
            autoplayBlocked = true;
        }
    }

    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.setAttribute('aria-label', 'Putar');
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

        const nextSongCalculatedIndex = shuffleMode ? getRandomUniqueIndex() : (currentSongIndex + 1) % playlist.length;

        // If not repeating all and it's the last song (or would loop back to start in non-shuffle mode),
        // and current index is the last, then pause.
        if (repeatMode === 'off' && !shuffleMode && currentSongIndex === playlist.length -1) {
             pauseSong();
             loadSong(0); // Load first song but don't play
             currentSongIndex = 0;
             return;
        }

        // Crossfade effect
        const fadeOutDuration = 0.5; // seconds
        const fadeInDuration = 0.5; // seconds
        const now = audioContext.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + fadeOutDuration);

        setTimeout(() => {
            currentSongIndex = nextSongCalculatedIndex;
            loadSong(currentSongIndex);
            audioPlayer.play();
            gainNode.gain.cancelScheduledValues(audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(masterVolumeControl.value, audioContext.currentTime + fadeInDuration);
        }, fadeOutDuration * 1000);
    }

    function getRandomUniqueIndex() {
        if (playlist.length <= 1) return 0;
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentSongIndex);
        return nextIndex;
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
        
        // Crossfade effect
        const fadeOutDuration = 0.5; // seconds
        const fadeInDuration = 0.5; // seconds
        const now = audioContext.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + fadeOutDuration);

        setTimeout(() => {
            loadSong(currentSongIndex);
            if (isPlaying) {
                audioPlayer.play();
                gainNode.gain.cancelScheduledValues(audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(masterVolumeControl.value, audioContext.currentTime + fadeInDuration);
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
            }
        }, fadeOutDuration * 1000);
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
            gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
            effectLevelGainNode.gain.setValueAtTime(effectLevelControl.value, audioContext.currentTime);
            audioPlayer.playbackRate = parseFloat(playbackSpeedControl.value);
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

    // --- Logika Timer Tidur (Ditingkatkan) ---
    function startSleepTimer(minutes) {
        clearTimeout(sleepTimerId);
        if (minutes === 0) {
            sleepTimerEndTime = 0;
            sleepTimerCountdown.textContent = '';
            modalTimerCountdown.textContent = '';
            timerOptionBtns.forEach(btn => btn.classList.remove('active'));
            customTimerInput.value = '';
            return;
        }

        sleepTimerEndTime = Date.now() + minutes * 60 * 1000;
        updateSleepTimerCountdownDisplay();
        sleepTimerId = setInterval(updateSleepTimerCountdownDisplay, 1000);

        timerOptionBtns.forEach(btn => {
            if (parseInt(btn.dataset.minutes) === minutes) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (minutes > 0 && ![5, 15, 30, 60].includes(minutes)) {
            customTimerInput.value = minutes;
        } else {
            customTimerInput.value = '';
        }
        sleepTimerModal.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    }

    function updateSleepTimerCountdownDisplay() {
        const remainingTime = sleepTimerEndTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(sleepTimerId);
            pauseSong();
            sleepTimerCountdown.textContent = 'Waktu habis!';
            modalTimerCountdown.textContent = 'Waktu habis!';
            timerOptionBtns.forEach(btn => btn.classList.remove('active'));
            customTimerInput.value = '';
            startSleepTimer(0);
        } else {
            const minutes = Math.floor(remainingTime / (60 * 1000));
            const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
            const formattedTime = `Berhenti dalam: ${minutes}:${formattedSeconds}`;
            sleepTimerCountdown.textContent = formattedTime;
            modalTimerCountdown.textContent = formattedTime;
        }
    }

    openSleepTimerModalBtn.addEventListener('click', () => {
        sleepTimerModal.classList.add('visible');
        sidebarOverlay.classList.add('visible');
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

    // --- Logika Kontrol Audio ---
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
        audioPlayer.volume = volume;
    });

    playbackSpeedControl.addEventListener('input', () => {
        const speed = parseFloat(playbackSpeedControl.value);
        audioPlayer.playbackRate = speed;
        playbackSpeedValueSpan.textContent = `${speed.toFixed(2)}x`;
    });

    trebleControl.addEventListener('input', () => {
        const value = parseFloat(trebleControl.value);
        trebleFilter.gain.setValueAtTime(value, audioContext.currentTime);
        trebleValueSpan.textContent = `${value} dB`;
    });

    midControl.addEventListener('input', () => {
        const value = parseFloat(midControl.value);
        midFilter.gain.setValueAtTime(value, audioContext.currentTime);
        midValueSpan.textContent = `${value} dB`;
    });

    bassControl.addEventListener('input', () => {
        const value = parseFloat(bassControl.value);
        bassFilter.gain.setValueAtTime(value, audioContext.currentTime);
        bassValueSpan.textContent = `${value} dB`;
    });

    effectLevelControl.addEventListener('input', () => {
        const value = parseFloat(effectLevelControl.value);
        effectLevelGainNode.gain.setValueAtTime(value, audioContext.currentTime);
        effectLevelValueSpan.textContent = `${Math.round(value * 100)}%`;
    });

    // Inisialisasi nilai Kontrol Audio
    masterVolumeControl.value = audioPlayer.volume;
    volumeValueSpan.textContent = `${Math.round(audioPlayer.volume * 100)}%`;
    playbackSpeedControl.value = audioPlayer.playbackRate;
    playbackSpeedValueSpan.textContent = `${audioPlayer.playbackRate.toFixed(2)}x`;
    trebleValueSpan.textContent = `${trebleControl.value} dB`;
    midValueSpan.textContent = `${midControl.value} dB`;
    bassValueSpan.textContent = `${bassControl.value} dB`;
    effectLevelValueSpan.textContent = `${Math.round(effectLevelControl.value * 100)}%`;


    // --- Toggle Tema ---
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        toggleThemeBtn.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        toggleThemeBtn.setAttribute('aria-label', isLightMode ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang');
    }

    toggleThemeBtn.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        toggleThemeBtn.setAttribute('aria-label', 'Beralih ke Mode Gelap');
    } else {
        document.body.classList.remove('light-mode');
        toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        toggleThemeBtn.setAttribute('aria-label', 'Beralih ke Mode Terang');
    }


    // --- Acak dan Ulangi ---
    shuffleBtn.addEventListener('click', () => {
        shuffleMode = !shuffleMode;
        shuffleBtn.classList.toggle('active', shuffleMode);
        if (shuffleMode) {
            shufflePlaylist();
        } else {
            restoreOriginalPlaylist();
        }
        buildPlaylist(playlistSearchInput.value);
        updatePlaylistActiveState(currentSongIndex);
    });

    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'off') {
            repeatMode = 'all';
            repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
            repeatBtn.classList.add('active');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.innerHTML = '<i class="fas fa-repeat-one"></i>';
        } else {
            repeatMode = 'off';
            repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
            repeatBtn.classList.remove('active');
        }
        repeatBtn.setAttribute('aria-label', `Ulangi: ${repeatMode}`);
    });

    function shufflePlaylist() {
        originalPlaylistOrder = [...playlist];
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        const currentSong = originalPlaylistOrder[currentSongIndex];
        currentSongIndex = playlist.findIndex(song => song.src === currentSong.src);
    }

    function restoreOriginalPlaylist() {
        playlist = [...originalPlaylistOrder];
        const currentSong = originalPlaylistOrder[currentSongIndex];
        currentSongIndex = playlist.findIndex(song => song.src === currentSong.src);
    }


    // --- Fungsi Playlist ---
    function buildPlaylist(searchTerm = '') {
        playlistUl.innerHTML = '';
        const filteredPlaylist = originalPlaylistOrder.filter(song =>
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
            const actualIndexInCurrentPlaylist = playlist.findIndex(s => s.src === song.src);

            li.setAttribute('data-original-index', originalPlaylistOrder.indexOf(song));
            li.setAttribute('data-current-playlist-index', actualIndexInCurrentPlaylist);
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
        buildPlaylist(playlistSearchInput.value);
        playlistSidebar.classList.add('visible');
        sidebarOverlay.classList.add('visible');
        audioControlsModal.classList.remove('visible');
        sleepTimerModal.classList.remove('visible');
    }

    function hidePlaylistSidebar() {
        playlistSidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
    }

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

    // --- Pintasan Keyboard ---
    document.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case ' ':
                event.preventDefault();
                playPauseToggle();
                break;
            case 'ArrowRight':
                playNextSong();
                break;
            case 'ArrowLeft':
                playPrevSong();
                break;
            case 'm':
                if (audioPlayer.volume > 0) {
                    audioPlayer.dataset.previousVolume = audioPlayer.volume;
                    audioPlayer.volume = 0;
                    masterVolumeControl.value = 0;
                } else {
                    audioPlayer.volume = parseFloat(audioPlayer.dataset.previousVolume || 0.7);
                    masterVolumeControl.value = audioPlayer.volume;
                }
                gainNode.gain.setValueAtTime(audioPlayer.volume, audioContext.currentTime);
                volumeValueSpan.textContent = `${Math.round(audioPlayer.volume * 100)}%`;
                break;
            case 'l':
                event.preventDefault();
                togglePlaylistBtn.click();
                break;
            case 'o':
                event.preventDefault();
                openAudioModalBtn.click();
                break;
        }
    });


    // --- Inisialisasi Aplikasi ---
    if (localStorage.getItem('musicPlaylist')) {
        playlist = JSON.parse(localStorage.getItem('musicPlaylist'));
        originalPlaylistOrder = [...playlist];
    }

    // Default song setup if playlist is empty or if no default is set yet
    const currentDefaultSong = JSON.parse(localStorage.getItem('defaultMelodyVerseSong'));
    if (!currentDefaultSong && playlist.length > 0) {
        localStorage.setItem('defaultMelodyVerseSong', JSON.stringify(playlist[0]));
    } else if (!currentDefaultSong && playlist.length === 0) {
         // Fallback if playlist and default is empty
         localStorage.setItem('defaultMelodyVerseSong', JSON.stringify({
            title: "Selamat Datang di MelodyVerse",
            artist: "Admin",
            src: "abstract_wave_bg.mp4", // Or a silent mp3 file if you have one
            albumArt: "album_art_default.jpg",
            info: "<p>Playlist Anda kosong! Tambahkan lagu baru melalui panel admin untuk memulai petualangan musik Anda.</p>"
        }));
    }


    if (playlist.length > 0) {
        loadSong(currentSongIndex);
        buildPlaylist();
    } else {
        console.warn("No songs found in 'playlist' array. Loading default song.");
        // Load the default song explicitly if playlist is empty
        const defaultSongToLoad = JSON.parse(localStorage.getItem('defaultMelodyVerseSong'));
        if (defaultSongToLoad) {
            audioPlayer.src = defaultSongToLoad.src;
            currentAlbumArt.src = defaultSongToLoad.albumArt || "album_art_default.jpg";
            currentSongTitle.textContent = defaultSongToLoad.title || "Lagu Default";
            currentArtistName.textContent = defaultSongToLoad.artist || "Artis Default";
            infoText.innerHTML = defaultSongToLoad.info || "<p>Tidak ada lagu di playlist utama. Ini adalah lagu default.</p>";
            audioPlayer.load();
        } else {
            currentSongTitle.textContent = "Tidak ada lagu";
            currentArtistName.textContent = "Silakan tambahkan lagu di panel admin";
            infoText.innerHTML = "<p>Playlist kosong. Silakan tambahkan lagu baru melalui panel admin. Pastikan file MP3 dan gambar album ada di folder yang sama dengan file HTML utama Anda di GitHub Pages.</p>";
        }
    }


    audioPlayer.addEventListener('play', () => {
        setupAudioContext();
        drawVisualizer();
        gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
    }, { once: true });

    if (backgroundVideo) {
        backgroundVideo.play().catch(error => {
            console.log('Autoplay video dicegah. Interaksi pengguna mungkin diperlukan.', error);
        });
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'musicPlaylist' || event.key === 'defaultMelodyVerseSong') {
            console.log('Perubahan playlist atau lagu default terdeteksi dari localStorage, memuat ulang playlist.');
            const newPlaylist = JSON.parse(localStorage.getItem('musicPlaylist')) || [];
            if (JSON.stringify(playlist) !== JSON.stringify(newPlaylist)) {
                playlist = newPlaylist;
                originalPlaylistOrder = [...playlist];
                if (playlist.length > 0 && currentSongIndex >= playlist.length) {
                    currentSongIndex = 0;
                } else if (playlist.length === 0) {
                    currentSongIndex = 0;
                }
                loadSong(currentSongIndex);
                buildPlaylist();
                if (isPlaying && playlist.length > 0) {
                    playSong();
                } else if (playlist.length === 0) {
                    pauseSong();
                }
            } else if (event.key === 'defaultMelodyVerseSong' && playlist.length === 0) {
                // If only default song changes and playlist is empty, reload default song
                loadSong(currentSongIndex); // This will pick up the new default song
            }
        }
    });
});
