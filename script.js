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

    // Elemen UI yang ditingkatkan (tidak ada elemen admin lagi)
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

    // Elemen Playlist Favorit dan Antrean
    const playlistTabButtons = document.querySelectorAll('.playlist-tab-btn');
    const allSongsList = document.getElementById('playlist'); // Ini adalah ul default dengan ID 'playlist'
    const favoriteList = document.getElementById('favorite-list');
    const queueList = document.getElementById('queue-list');
    const queueCountSpan = document.getElementById('queue-count');
    const emptyQueueMessage = document.getElementById('empty-queue-message');

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
    let currentSongIndex = 0; // Akan direset ke 0 setiap kali halaman dimuat
    let isPlaying = false;
    let sleepTimerId = null;
    let sleepTimerEndTime = 0;
    let shuffleMode = false;
    let repeatMode = 'off'; // 'off', 'one', 'all'
    let originalPlaylistOrder = []; // Akan sama dengan playlist karena tidak ada admin panel
    let autoplayBlocked = false;

    let lastNotification = null; // Untuk Notifikasi Browser

    // Data Favorit dan Antrean
    let favoriteSongs = JSON.parse(localStorage.getItem('favoriteSongs')) || []; // Menyimpan src lagu favorit
    let queue = []; // Antrean putar, hanya dalam memori untuk sesi saat ini

    // Mode Visualizer
    let currentVisualizerMode = 'bars'; // Default visualizer mode

    // --- DATA LAGU (SEKARANG HANYA HARDCODED DI SINI) ---
    // Aplikasi ini akan selalu menggunakan daftar lagu ini.
    // Untuk mengubahnya, Anda harus mengedit file script.js ini secara langsung.
    let playlist = [
        { // Lagu baru ditambahkan di sini
            title: "Lesung Pipi",
            artist: "Raim Laode",
            src: "lesung_pipi.mp3",
            albumArt: "album_art_lesung_pipi.jpg",
            info: `<b>🎶 Lesung Pipi – Raim Laode</b><br><br>
                Lagu ini adalah ode manis untuk fitur wajah yang menawan, lesung pipi. Dengan gaya Raim Laode yang khas, lagu ini kemungkinan besar dibawakan dengan sentuhan humor dan kehangatan, menceritakan tentang daya tarik sederhana namun luar biasa dari seseorang yang memiliki lesung pipi. Liriknya mungkin dipenuhi dengan pujian dan pengamatan yang lucu, membuat pendengar tersenyum dan mengangguk setuju.`
        },
        {
            title: "Guilty as Sin?",
            artist: "Taylor Swift",
            src: "guilty_as_sin.mp3",
            albumArt: "album_art_guilty_as_sin.jpg",
            info: `<b>🎶 Guilty as Sin? – Taylor Swift</b><br><br>
                Lagu ini mengeksplorasi nuansa moral dan godaan dalam sebuah hubungan. Taylor Swift merenungkan garis tipis antara keinginan yang bersalah dan kesetiaan yang tak tergoyahkan. Dengan lirik yang introspektif dan melodi yang memikat, lagu ini menggambarkan pergulatan batin saat menghadapi pertanyaan tentang loyalitas dan batas-batas emosional, membuat pendengar bertanya: apakah keinginan saja sudah cukup untuk merasa bersalah seperti dosa?`
        },
        { 
            title: "About You",
            artist: "The 1975",
            src: "about_you.mp3",
            albumArt: "album_art_about_you.jpg",
            info: `<b>🎶 About You – The 1975</b><br><br>
                Lagu ini adalah balada melankolis yang menangkap perasaan kerinduan dan nostalgia akan hubungan masa lalu yang belum sepenuhnya usai. Dengan lirik yang menghantui dan vokal yang mengharukan, lagu ini berbicara tentang ingatan yang terus kembali kepada seseorang, bahkan ketika hidup terus berjalan. "About You" adalah gambaran universal tentang cinta yang tak terlupakan dan bayang-bayang yang ditinggalkannya.`
        },
        { 
            title: "Iris",
            artist: "Go goo Dols",
            src: "iris.mp3",
            albumArt: "album_art_iris.jpg",
            info: `<b>🎶 Iris – Go goo Dols</b><br><br>
                Versi "Iris" dari Go goo Dols mungkin memberikan sentuhan unik pada lagu klasik ini, mempertahankan esensi emosional aslinya sambil menambahkan gaya mereka sendiri. Lagu ini sering dikaitkan dengan perasaan kerentanan, harapan, dan keinginan untuk dilihat sepenuhnya oleh orang yang dicintai, dengan lirik yang kuat dan melodi yang membangun emosi. Ini adalah lagu yang berbicara tentang kedalaman cinta dan kerinduan untuk koneksi yang tulus.`
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

    // Karena tidak ada admin panel untuk mengubah playlist, originalPlaylistOrder akan selalu sama dengan playlist
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

        const canvasWidth = audioVisualizer.width;
        const canvasHeight = audioVisualizer.height;
        visualizerCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (currentVisualizerMode === 'none') {
            return;
        }

        analyser.getByteFrequencyData(dataArray);

        if (currentVisualizerMode === 'bars') {
            const barWidth = (canvasWidth / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                let gradient = visualizerCtx.createLinearGradient(0, canvasHeight, 0, 0);
                gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)'); // Accent purple
                gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.6)'); // Accent red
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)'); // Lighter top
                visualizerCtx.fillStyle = gradient;

                visualizerCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        } else if (currentVisualizerMode === 'circles') {
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            const maxRadius = Math.min(canvasWidth, canvasHeight) / 3; // Max radius for circles

            visualizerCtx.lineWidth = 2; // Thickness of the circles
            visualizerCtx.strokeStyle = 'rgba(255, 69, 0, 0.8)'; // Orange color for circles

            for (let i = 0; i < bufferLength; i++) {
                const radius = (dataArray[i] / 255) * maxRadius; // Scale radius based on frequency data
                visualizerCtx.beginPath();
                visualizerCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                visualizerCtx.stroke();
            }
        }
    }

    // --- Fungsi Utama Pemutar Musik ---

    function loadSong(songIndex) {
        if (playlist.length === 0) {
            // Jika playlist kosong, tampilkan pesan tanpa mencoba memuat lagu
            currentSongTitle.textContent = "Tidak ada lagu";
            currentArtistName.textContent = "Daftar putar kosong.";
            infoText.innerHTML = "<p>Daftar putar kosong. Mohon tambahkan lagu ke file `script.js` Anda dan perbarui GitHub Pages.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlist.length);
            // Kembali ke lagu pertama jika index tidak valid
            currentSongIndex = 0;
            const song = playlist[currentSongIndex]; // Coba load lagu pertama
            audioPlayer.src = song.src;
            currentAlbumArt.src = song.albumArt;
            currentSongTitle.textContent = song.title;
            currentArtistName.textContent = song.artist;
            infoText.innerHTML = song.info;
            audioPlayer.load();
            updatePlaylistActiveState(currentSongIndex);
            pauseSong(); // Jangan otomatis putar
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

        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animation = 'none';
            void albumArtImg.offsetWidth;
            albumArtImg.style.animation = '';
        }
        updatePlaylistActiveState(songIndex);

        progressBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';

        // --- Browser Notifications ---
        if (Notification.permission === 'granted' && currentSongTitle.textContent !== "Tidak ada lagu") {
            if (lastNotification) {
                lastNotification.close();
            }
            try {
                lastNotification = new Notification(`MelodyVerse: ${currentSongTitle.textContent}`, {
                    body: currentArtistName.textContent,
                    icon: currentAlbumArt.src,
                    tag: 'melodyverse-now-playing',
                    renotify: true
                });
            } catch (e) {
                console.error("Error displaying notification:", e);
            }
        }

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
        if (playlist.length === 0) { // Menangani kasus playlist kosong
            console.warn("Cannot play: Playlist is empty.");
            return;
        }

        if (audioContext.state === 'suspended') {
            setupAudioContext();
            audioContext.resume().then(() => {
                requestNotificationPermissionAndPlay(); // Panggil fungsi bantu baru
            }).catch(e => {
                console.error("Failed to resume AudioContext:", e);
                displayAutoplayBlockedMessage();
            });
        } else {
            requestNotificationPermissionAndPlay(); // Panggil fungsi bantu baru
        }
    }

    // Fungsi bantu untuk meminta izin notifikasi sebelum memutar
    function requestNotificationPermissionAndPlay() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    attemptPlayWithCrossfade();
                } else {
                    console.warn('Notification permission denied. Notifications will not be shown.');
                    attemptPlayWithCrossfade(); // Tetap coba memutar audio meskipun izin ditolak
                }
            });
        } else {
            attemptPlayWithCrossfade();
        }
    }
    
    // Fungsi baru untuk crossfade saat play
    function attemptPlayWithCrossfade() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded or invalid. Attempting to load first song.");
            if (playlist.length > 0) {
                loadSong(0);
            } else {
                return;
            }
        }

        // Fade in logic
        const fadeInDuration = 0.5; // seconds
        const now = audioContext.currentTime;
        
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0.001, now); // Start from near silent
        gainNode.gain.linearRampToValueAtTime(masterVolumeControl.value, now + fadeInDuration); // Ramp up to desired volume

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
        // Fade out logic for pause
        const fadeOutDuration = 0.5; // seconds
        const now = audioContext.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now); // Start from current volume
        gainNode.gain.linearRampToValueAtTime(0.001, now + fadeOutDuration); // Ramp down to near silent

        setTimeout(() => {
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
            // Restore volume immediately after pause, so next play starts from expected level
            gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
        }, fadeOutDuration * 1000); // Wait for fade out to complete before truly pausing
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    function playNextSong() {
        if (playlist.length === 0 && queue.length === 0) { // Check both playlist and queue
            pauseSong();
            return;
        }

        let nextSongCalculatedIndex;
        let isFromQueue = false;

        if (queue.length > 0) { // Prioritize queue
            const nextSongInQueue = queue.shift(); // Get first song from queue
            queueCountSpan.textContent = ` (${queue.length})`;
            renderQueueList(); // Update queue list display
            // Find index of this song in the main playlist to update currentSongIndex
            nextSongCalculatedIndex = playlist.findIndex(song => song.src === nextSongInQueue.src);
            if (nextSongCalculatedIndex === -1) { // If song from queue somehow not in main playlist
                 // Fallback to regular next song logic or skip to next queue item
                console.warn("Queue song not found in main playlist, attempting next.");
                playNextSong(); // Try to play next song (could be next in queue or regular playlist)
                return;
            }
            isFromQueue = true;
        } else { // If queue is empty, proceed with regular/shuffle playlist logic
            if (repeatMode === 'one') {
                loadSong(currentSongIndex);
                playSong();
                return;
            }

            nextSongCalculatedIndex = shuffleMode ? getRandomUniqueIndex() : (currentSongIndex + 1) % playlist.length;

            if (repeatMode === 'off' && !shuffleMode && currentSongIndex === playlist.length -1) {
                pauseSong();
                loadSong(0); // Load first song but don't play
                currentSongIndex = 0;
                return;
            }
        }

        // Crossfade effect
        const fadeOutDuration = 0.5;
        const fadeInDuration = 0.5;
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

        // If currently playing from queue, and pressing previous, we should go back to the regular playlist
        // Or re-add to queue and go back one if there's a concept of 'previous in queue'
        // For simplicity, for prev, let's just go back in the main playlist.
        if (queue.length > 0 && currentSongIndex === playlist.findIndex(s => s.src === queue[0].src)) {
            // If current song was from queue, and queue is not empty, pop it back to queue
            // but for previous, we discard queue and go to regular previous
            queue = []; // Clear queue on manual previous navigation (simplification)
            queueCountSpan.textContent = ` (${queue.length})`;
            renderQueueList();
        }

        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        
        const fadeOutDuration = 0.5;
        const fadeInDuration = 0.5;
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

    // --- Logika Timer Tidur ---
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
            // --- Sleep Timer Fade Out ---
            const fadeOutDuration = 3; // seconds for fade out
            const now = audioContext.currentTime;

            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(0.001, now + fadeOutDuration);

            setTimeout(() => {
                pauseSong();
                sleepTimerCountdown.textContent = 'Waktu habis!';
                modalTimerCountdown.textContent = 'Waktu habis!';
                timerOptionBtns.forEach(btn => btn.classList.remove('active'));
                customTimerInput.value = '';
                // Restore volume after pause, so next play is normal
                gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
                startSleepTimer(0); // Reset timer state
            }, fadeOutDuration * 1000);

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

    // Visualizer Mode Control
    visualizerModeSelect.addEventListener('change', (event) => {
        currentVisualizerMode = event.target.value;
        localStorage.setItem('visualizerMode', currentVisualizerMode); // Save user's preference
        visualizerCtx.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height); // Clear canvas on mode change
        if (currentVisualizerMode !== 'none' && isPlaying) {
            drawVisualizer(); // Restart drawing if not none and playing
        }
    });
    // Set initial visualizer mode from localStorage or default
    currentVisualizerMode = localStorage.getItem('visualizerMode') || 'bars';
    visualizerModeSelect.value = currentVisualizerMode;


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
            restoreOriginalPlaylist(); // Restore to the initial hardcoded order
        }
        buildPlaylist(playlistSearchInput.value, document.querySelector('.playlist-tab-btn.active').dataset.tab); // Rebuild with current search term and tab
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
        const currentPlayingSongSource = audioPlayer.src.split('/').pop();
        
        // Create a temporary shuffled version of the full hardcoded playlist
        const shuffledList = [...playlist];
        for (let i = shuffledList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
        }
        
        // Replace the main playlist with the shuffled version
        playlist = shuffledList;
        
        // Update currentSongIndex to reflect the new position of the playing song
        if (currentPlayingSongSource) {
            const newIndex = playlist.findIndex(song => song.src === currentPlayingSongSource);
            if (newIndex !== -1) {
                currentSongIndex = newIndex;
            } else {
                currentSongIndex = 0; 
            }
        } else {
            currentSongIndex = 0;
        }
        // originalPlaylistOrder is not really used for "restore" in this static context after a shuffle,
        // as restoreOriginalPlaylist re-initializes from hardcoded list.
        // It's mostly kept as a philosophical concept or if we wanted a more complex undo.
    }

    function restoreOriginalPlaylist() {
        // Mengembalikan ke playlist awal yang hardcoded
        playlist = [
            {
                title: "Lesung Pipi",
                artist: "Raim Laode",
                src: "lesung_pipi.mp3",
                albumArt: "album_art_lesung_pipi.jpg",
                info: `<b>🎶 Lesung Pipi – Raim Laode</b><br><br>
                    Lagu ini adalah ode manis untuk fitur wajah yang menawan, lesung pipi. Dengan gaya Raim Laode yang khas, lagu ini kemungkinan besar dibawakan dengan sentuhan humor dan kehangatan, menceritakan tentang daya tarik sederhana namun luar biasa dari seseorang yang memiliki lesung pipi. Liriknya mungkin dipenuhi dengan pujian dan pengamatan yang lucu, membuat pendengar tersenyum dan mengangguk setuju.`
            },
            {
                title: "Guilty as Sin?",
                artist: "Taylor Swift",
                src: "guilty_as_sin.mp3",
                albumArt: "album_art_guilty_as_sin.jpg",
                info: `<b>🎶 Guilty as Sin? – Taylor Swift</b><br><br>
                    Lagu ini mengeksplorasi nuansa moral dan godaan dalam sebuah hubungan. Taylor Swift merenungkan garis tipis antara keinginan yang bersalah dan kesetiaan yang tak tergoyahkan. Dengan lirik yang introspektif dan melodi yang memikat, lagu ini menggambarkan pergulatan batin saat menghadapi pertanyaan tentang loyalitas dan batas-batas emosional, membuat pendengar bertanya: apakah keinginan saja sudah cukup untuk merasa bersalah seperti dosa?`
            },
            { 
                title: "About You",
                artist: "The 1975",
                src: "about_you.mp3",
                albumArt: "album_art_about_you.jpg",
                info: `<b>🎶 About You – The 1975</b><br><br>
                    Lagu ini adalah balada melankolis yang menangkap perasaan kerinduan dan nostalgia akan hubungan masa lalu yang belum sepenuhnya usai. Dengan lirik yang menghantui dan vokal yang mengharukan, lagu ini berbicara tentang ingatan yang terus kembali kepada seseorang, bahkan ketika hidup terus berjalan. "About You" adalah gambaran universal tentang cinta yang tak terlupakan dan bayang-bayang yang ditinggalkannya.`
            },
            { 
                title: "Iris",
                artist: "Go goo Dols",
                src: "iris.mp3",
                albumArt: "album_art_iris.jpg",
                info: `<b>🎶 Iris – Go goo Dols</b><br><br>
                    Versi "Iris" dari Go goo Dols mungkin memberikan sentuhan unik pada lagu klasik ini, mempertahankan esensi emosional aslinya sambil menambahkan gaya mereka sendiri. Lagu ini sering dikaitkan dengan perasaan kerentanan, harapan, dan keinginan untuk dilihat sepenuhnya oleh orang yang dicintai, dengan lirik yang kuat dan melodi yang membangun emosi. Ini adalah lagu yang berbicara tentang kedalaman cinta dan kerinduan untuk koneksi yang tulus.`
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
        // currentSongIndex akan direset ke 0 jika halaman direfresh, karena tidak ada persistence
        currentSongIndex = 0; 
    }


    // --- Fungsi Playlist ---
    function buildPlaylist(searchTerm = '', displayMode = 'all') { // Added displayMode
        // Sembunyikan semua daftar dulu
        allSongsList.style.display = 'none';
        favoriteList.style.display = 'none';
        queueList.style.display = 'none';
        allSongsList.innerHTML = ''; // Kosongkan dulu
        favoriteList.innerHTML = '';
        queueList.innerHTML = '';

        let songsToDisplay = [];
        if (displayMode === 'all') {
            songsToDisplay = playlist;
        } else if (displayMode === 'favorites') {
            // Filter playlist utama berdasarkan lagu favorit yang src-nya ada di favoriteSongs
            songsToDisplay = playlist.filter(song => favoriteSongs.includes(song.src));
        } else if (displayMode === 'queue') {
            songsToDisplay = queue;
        }

        const filteredSongs = songsToDisplay.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const targetList = (displayMode === 'all') ? allSongsList : (displayMode === 'favorites' ? favoriteList : queueList);
        targetList.style.display = 'block'; // Ensure the active list is visible

        if (filteredSongs.length === 0) {
            const noResultsLi = document.createElement('li');
            noResultsLi.textContent = displayMode === 'favorites' ? "Tidak ada lagu favorit." : (displayMode === 'queue' ? "Antrean kosong." : "Tidak ada lagu ditemukan.");
            noResultsLi.style.justifyContent = 'center';
            noResultsLi.style.backgroundColor = 'transparent';
            noResultsLi.style.transform = 'none';
            noResultsLi.style.borderLeft = 'none';
            noResultsLi.style.color = 'var(--secondary-text)';
            targetList.appendChild(noResultsLi);
            if (displayMode === 'queue') emptyQueueMessage.style.display = 'flex'; // Ensure specific empty queue message is visible
            return;
        } else {
            emptyQueueMessage.style.display = 'none';
        }


        filteredSongs.forEach((song, index) => {
            const li = document.createElement('li');
            // actualIndexInCurrentPlaylist akan merujuk ke index di playlist yang saat ini diacak
            const actualIndexInCurrentPlaylist = playlist.indexOf(song);

            li.setAttribute('data-current-playlist-index', actualIndexInCurrentPlaylist);
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <i class="fas fa-heart favorite-icon ${favoriteSongs.includes(song.src) ? 'active' : ''}" data-song-src="${song.src}"></i>
                <button class="add-to-queue-btn" data-song-src="${song.src}" aria-label="Tambah ke Antrean">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            li.addEventListener('click', (event) => {
                // Handle favorite/queue clicks without playing the song
                if (event.target.closest('.favorite-icon') || event.target.closest('.add-to-queue-btn')) {
                    return;
                }
                currentSongIndex = parseInt(li.getAttribute('data-current-playlist-index'));
                loadSong(currentSongIndex);
                playSong();
                hidePlaylistSidebar();
            });
            
            // Event Listener untuk tombol favorit
            li.querySelector('.favorite-icon').addEventListener('click', (event) => {
                event.stopPropagation(); // Mencegah klik menyebar ke li dan memutar lagu
                toggleFavorite(song.src);
            });

            // Event Listener untuk tombol Add to Queue
            li.querySelector('.add-to-queue-btn').addEventListener('click', (event) => {
                event.stopPropagation(); // Mencegah klik menyebar ke li dan memutar lagu
                addToQueue(song);
            });


            targetList.appendChild(li);
        });
        updatePlaylistActiveState(currentSongIndex);
    }

    function updatePlaylistActiveState(activeIndexInCurrentPlaylist) {
        // Sembunyikan semua daftar dulu
        allSongsList.style.display = 'none';
        favoriteList.style.display = 'none';
        queueList.style.display = 'none';

        // Tentukan daftar yang aktif berdasarkan tombol tab
        const activeTab = document.querySelector('.playlist-tab-btn.active').dataset.tab;
        const currentActiveList = (activeTab === 'all-songs') ? allSongsList : (activeTab === 'favorites' ? favoriteList : queueList);
        currentActiveList.style.display = 'block';

        // Hapus kelas 'active' dari semua item di semua daftar
        document.querySelectorAll('.playlist-items li').forEach(item => item.classList.remove('active'));

        const currentPlayingSong = playlist[activeIndexInCurrentPlaylist];
        if (currentPlayingSong) {
            // Temukan lagu yang aktif di *semua* daftar (karena bisa ada duplikasi)
            const activeItems = document.querySelectorAll(`.playlist-items li[data-current-playlist-index="${activeIndexInCurrentPlaylist}"]`);
            activeItems.forEach(item => {
                // Pastikan lagu yang aktif memang yang sedang diputar (match by src as well)
                if (item.querySelector('.playlist-song-info h3').textContent === currentPlayingSong.title &&
                    item.querySelector('.playlist-song-info p').textContent === currentPlayingSong.artist) {
                    item.classList.add('active');
                }
            });

            // Gulirkan daftar aktif ke lagu yang sedang diputar
            const activeItemInCurrentView = currentActiveList.querySelector(`.playlist-items li[data-current-playlist-index="${activeIndexInCurrentPlaylist}"]`);
            if (activeItemInCurrentView) {
                const containerHeight = currentActiveList.clientHeight;
                const itemHeight = activeItemInCurrentView.offsetHeight;
                const itemTop = activeItemInCurrentView.offsetTop;

                const scrollTo = itemTop - (containerHeight / 2) + (itemHeight / 2);

                if (currentActiveList.scrollHeight > currentActiveList.clientHeight) {
                    currentActiveList.scrollTo({
                        top: scrollTo,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }


    function showPlaylistSidebar() {
        // Build the currently active tab's list
        const activeTab = document.querySelector('.playlist-tab-btn.active').dataset.tab;
        buildPlaylist(playlistSearchInput.value, activeTab);

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
        const activeTab = document.querySelector('.playlist-tab-btn.active').dataset.tab;
        buildPlaylist(event.target.value, activeTab);
    });

    // --- Logika Playlist Tabs ---
    playlistTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus 'active' dari semua tombol
            playlistTabButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan 'active' ke tombol yang diklik
            button.classList.add('active');

            const selectedTab = button.dataset.tab;
            buildPlaylist(playlistSearchInput.value, selectedTab);
            updatePlaylistActiveState(currentSongIndex); // Perbarui status aktif setelah tab berubah
        });
    });

    // --- Logika Favorit ---
    function saveFavorites() {
        try {
            localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
        } catch (e) {
            console.error("Error saving favorites to localStorage:", e);
        }
    }

    function toggleFavorite(songSrc) {
        const index = favoriteSongs.indexOf(songSrc);
        if (index === -1) {
            favoriteSongs.push(songSrc);
        } else {
            favoriteSongs.splice(index, 1);
        }
        saveFavorites();
        // Update icons in all relevant lists (all-songs and favorites tab if visible)
        document.querySelectorAll(`.favorite-icon[data-song-src="${songSrc}"]`).forEach(icon => {
            icon.classList.toggle('active', favoriteSongs.includes(songSrc));
        });
        // If 'Favorites' tab is active, re-render it to show/hide the song
        if (document.querySelector('.playlist-tab-btn.active').dataset.tab === 'favorites') {
            buildPlaylist(playlistSearchInput.value, 'favorites');
        }
    }

    // --- Logika Antrean ---
    function addToQueue(song) {
        // Cek apakah lagu sudah ada di antrean
        if (!queue.some(qSong => qSong.src === song.src)) {
            queue.push(song);
            queueCountSpan.textContent = ` (${queue.length})`;
            alert(`"${song.title}" ditambahkan ke antrean.`);
            // Jika tab antrean aktif, perbarui tampilannya
            if (document.querySelector('.playlist-tab-btn.active').dataset.tab === 'queue') {
                renderQueueList(playlistSearchInput.value);
            }
        } else {
            alert(`"${song.title}" sudah ada di antrean.`);
        }
    }

    function renderQueueList(searchTerm = '') {
        queueList.innerHTML = ''; // Clear existing items
        emptyQueueMessage.style.display = 'none'; // Hide empty message by default

        if (queue.length === 0) {
            emptyQueueMessage.style.display = 'flex'; // Show empty message if queue is truly empty
            queueList.appendChild(emptyQueueMessage);
            queueCountSpan.textContent = ` (0)`;
            return;
        }

        const filteredQueue = queue.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredQueue.length === 0 && searchTerm) { 
            const noResultsLi = document.createElement('li');
            noResultsLi.textContent = "Tidak ada lagu antrean ditemukan.";
            noResultsLi.style.justifyContent = 'center';
            noResultsLi.style.backgroundColor = 'transparent';
            noResultsLi.style.transform = 'none';
            noResultsLi.style.borderLeft = 'none';
            noResultsLi.style.color = 'var(--secondary-text)';
            queueList.appendChild(noResultsLi);
            return;
        }
        
        filteredQueue.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-queue-index', index); // Index dalam antrean
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <i class="fas fa-heart favorite-icon ${favoriteSongs.includes(song.src) ? 'active' : ''}" data-song-src="${song.src}"></i>
                <button class="add-to-queue-btn" style="display:none;"></button>
            `;
            li.addEventListener('click', (event) => {
                if (event.target.closest('.favorite-icon')) { 
                    event.stopPropagation();
                    toggleFavorite(song.src);
                    // Re-render queue after favorite toggle, in case it changes filtering/appearance
                    buildPlaylist(playlistSearchInput.value, 'queue');
                    return;
                }
                // Play song directly from queue, and remove it from queue
                const originalSongIndex = playlist.findIndex(pSong => pSong.src === song.src);
                if (originalSongIndex !== -1) {
                    currentSongIndex = originalSongIndex;
                    loadSong(currentSongIndex);
                    playSong();
                    queue.splice(index, 1); // Remove from queue after playing
                    queueCountSpan.textContent = ` (${queue.length})`;
                    renderQueueList(); // Re-render queue
                    hidePlaylistSidebar();
                } else {
                    alert('Lagu ini tidak ditemukan di playlist utama.');
                }
            });

            queueList.appendChild(li);
        });
        queueCountSpan.textContent = ` (${queue.length})`; // Update count after rendering
    }


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
    // Karena tidak ada admin panel, playlist selalu diambil dari daftar hardcoded.
    // Jika playlist kosong, tampilkan pesan error yang sesuai.
    if (playlist.length > 0) {
        loadSong(currentSongIndex);
        buildPlaylist(playlistSearchInput.value, 'all'); // Membangun playlist awal
    } else {
        console.warn("Playlist kosong di defaultInitialPlaylist. Tidak ada lagu untuk dimuat.");
        currentSongTitle.textContent = "Tidak ada lagu";
        currentArtistName.textContent = "Daftar putar kosong.";
        infoText.innerHTML = "<p>Daftar putar kosong. Mohon tambahkan lagu ke file `script.js` Anda dan perbarui GitHub Pages.</p>";
        audioPlayer.src = "";
        currentAlbumArt.src = "album_art_default.jpg";
        pauseSong();
    }


    audioPlayer.addEventListener('play', () => {
        setupAudioContext();
        // Start drawing visualizer only when playing and if mode is not 'none'
        if (currentVisualizerMode !== 'none') {
            drawVisualizer();
        }
        gainNode.gain.setValueAtTime(masterVolumeControl.value, audioContext.currentTime);
    }, { once: true });

    if (backgroundVideo) {
        backgroundVideo.play().catch(error => {
            console.log('Autoplay video dicegah. Interaksi pengguna mungkin diperlukan.', error);
        });
    }
});
