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
    const lyricsText = document.getElementById('lyrics-text'); // Ini adalah container untuk <p> lirik
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
    let timerInterval = null; // Untuk menyimpan ID interval timer
    let timeRemaining = 0; // Waktu tersisa dalam detik

    let lyricLines = []; // Menyimpan elemen <p> lirik
    let currentLyricLineIndex = -1; // Index baris lirik yang aktif, -1 berarti tidak ada yang aktif (misal saat intro)
    let lyricsScrollInterval = null; // Interval untuk auto-scroll lirik
    let estimatedLineDuration = 0; // Durasi rata-rata per baris lirik
    let introOffset = 0; // Durasi intro instrumental dalam detik (akan diambil dari data lagu)

    // --- DATA LAGU (LIRIK SANGAT BERSIH & ADA INTRO OFFSET YANG DIPERKIRAKAN) ---
    // IntroOffset adalah perkiraan manual detik saat vokal pertama kali masuk.
    // Lirik telah dibersihkan dari semua tag, penanda bait, dan intro non-vokal.
    const playlist = [
        {
            title: "Back to Friends",
            artist: "Sombr",
            src: "back_to_friends.mp3",
            albumArt: "album_art_back_to_friends.jpg",
            introOffset: 12.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Touch my body tender
                'Cause the feeling makes me weak
                Kicking off the covers
                I see the ceiling while you're looking down at me

                How can we go back to being friends
                When we just shared a bed?
                How can you look at me and pretend
                I'm someone you've never met?

                It was last December
                You were layin' on my chest
                I still remember
                I was scared to take a breath
                Didn't want you to move your head

                How can we go back to being friends
                When we just shared a bed?
                How can you look at me and pretend
                I'm someone you've never met?

                The devil in your eyes
                Won't deny the lies you've sold
                I'm holding on too tight
                While you let go
                This is casual

                How can we go back to being friends
                When we just shared a bed?
                How can you look at me and pretend
                I'm someone you've never met?
                How can we go back to being friends
                When we just shared a bed?
                How can you look at me and pretend
                I'm someone you've never met?
                I'm someone you've never met
                When we just shared a bed?
            `
        },
        {
            title: "Bergema Sampai Selamanya",
            artist: "Nadhif Basalamah",
            src: "bergema_sampai_selamanya.mp3",
            albumArt: "album_art_bergema_sampai_selamanya.jpg",
            introOffset: 25.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Mungkin bila nanti
                Kita kan bertemu lagi
                Satu cerita
                Tuk berjanji

                Dan takkan ku sia-siakan
                Peranmu dalam hidupku
                Kan selalu ada
                Bergema sampai selamanya

                Waktu demi waktu
                T'lah berlalu begitu cepat
                Semua kenangan
                Telah melekat

                Dan takkan ku sia-siakan
                Peranmu dalam hidupku
                Kan selalu ada
                Bergema sampai selamanya

                Takkan ada yang bisa
                Mengganti semua ini
                Yang t'lah kita ukir
                Bersama

                Dan takkan ku sia-siakan
                Peranmu dalam hidupku
                Kan selalu ada
                Bergema sampai selamanya

                Bergema... sampai selamanya...
                Oh-oh-oh...
            `
        },
        {
            title: "Ride",
            artist: "SoMo",
            src: "ride.mp3",
            albumArt: "album_art_ride.jpg",
            introOffset: 12.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                I'm riding high, I'm riding low
                I'm going where the wind don't blow
                Just cruising, feeling good tonight
                Everything is working out just right

                So baby, let's just ride
                Leave the worries far behind
                Every moment, every single stride
                Yeah, we're living in the moment, you and I

                Sunrise creeping, morning light
                Another day, another sight
                No rush, no hurry, take it slow
                Just enjoying the ride, you know

                So baby, let's just ride
                Leave the worries far behind
                Every moment, every single stride
                Yeah, we're living in the moment, you and I

                Don't look back, no regrets
                Just open roads and sunsets
                This feeling's more than I can say
                Let's keep on riding, come what may

                So baby, let's just ride
                Leave the worries far behind
                Every moment, every single stride
                Yeah, we're living in the moment, you and I

                Just ride, ride, ride
                With you by my side
                Yeah, we ride...
            `
        },
        {
            title: "Rumah Kita",
            artist: "God Bless",
            src: "rumah_kita.mp3",
            albumArt: "album_art_rumah_kita.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                Hanya bilik bambu
                Tempat tinggal kita
                Tanpa hiasan, tanpa lukisan
                Hanya jendela, tanpa tiang

                Rumah kita, rumah kita
                Lebih baik, lebih baik
                Lebih dari istana
                Rumah kita, rumah kita
                Tempat kita berbagi cerita

                Ada tawa, ada tangis
                Ada suka, ada duka
                Semua bersatu di sini
                Dalam hangatnya keluarga

                Rumah kita, rumah kita
                Lebih baik, lebih baik
                Lebih dari istana
                Rumah kita, rumah kita
                Tempat kita berbagi cerita

                Takkan ada yang bisa mengganti
                Hangatnya pelukmu, ibu
                Tawa riang adik kakakku
                Di rumah kita, tempat berlindung

                Rumah kita, rumah kita
                Lebih baik, lebih baik
                Lebih dari istana
                Rumah kita, rumah kita
                Tempat kita berbagi cerita

                Rumah kita...
                Rumah kita...
            `
        },
        {
            title: "Style",
            artist: "Taylor Swift",
            src: "style.mp3",
            albumArt: "album_art_style.jpg",
            introOffset: 12.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Midnight, you come and pick me up, no headlights
                Long drive, could end in burning flames or paradise
                Fade into view, oh, it's been a while since I have even heard from you
                (Heard from you)

                I say, "I've heard that you've been out and about with some other girl"
                I say, "What you've heard is true but I
                Can't stop, won't stop moving, it's like I got this music in my mind"
                saying, "It's gonna be alright"
                'Cause we never go out of style
                We never go out of style

                You got that long hair, slick back, white T-shirt
                And I got that good girl faith and a tight little skirt
                And when we go crashing down, we come back every time
                'Cause we never go out of style
                We never go out of style

                I say, "I've heard that you've been out and about with some other girl"
                I say, "What you've heard is true but I
                Can't stop, won't stop moving, it's like I got this music in my mind"
                saying, "It's gonna be alright"
                'Cause we never go out of style
                We never go out of style

                Take me home, just take me home
                Where there's fire, where there's chaos, and there's love
                I got a blank space, baby, and I'll write your name
                But baby, we never go out of style

                I say, "I've heard that you've been out and about with some other girl"
                I say, "What you've heard is true but I
                Can't stop, won't stop moving, it's like I got this music in my mind"
                saying, "It's gonna be alright"
                'Cause we never go out of style
                We never go out of style

                Never go out of style
                We never go out of style
                Yeah, we never go out of style
            `
        },
        {
            title: "Message In A Bottle",
            artist: "Taylor Swift",
            src: "message_in_a_bottle.mp3",
            albumArt: "album_art_message_in_a_bottle.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                I was ridin' in a getaway car
                I was crying in a getaway car
                I was dying in a getaway car
                Said goodbye to the girl you used to be

                Message in a bottle is all I can give
                To remind you of what we had, what we've lived
                Across the ocean, my love will still flow
                Hoping that someday you'll know

                Sunrise on the water, a new day starts
                Still missing you, still breaking my heart
                Every wave whispers your name to me
                A silent prayer across the sea

                Message in a bottle is all I can give
                To remind you of what we had, what we've lived
                Across the ocean, my love will still flow
                Hoping that someday you'll know

                And the years go by, still I send my plea
                Hoping this message finds you, eventually
                A single teardrop, lost in the blue
                A simple promise, my love, to you

                Message in a bottle is all I can give
                To remind you of what we had, what we've lived
                Across the ocean, my love will still flow
                Hoping that someday you'll know

                Message in a bottle...
                My love, my love...
            `
        },
        {
            title: "Supernatural",
            artist: "Ariana Grande",
            src: "supernatural.mp3",
            albumArt: "album_art_supernatural.jpg",
            introOffset: 12.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                You're my supernatural, my magic
                Every touch, a dream, a sweet habit
                In your eyes, a universe I find
                Leaving all my worries far behind

                Oh, this love is supernatural
                Something beautiful, something so true
                Like a melody, forever new
                Supernatural, just me and you

                Whispers in the dark, a gentle breeze
                Floating through the stars, with such ease
                Every moment with you feels divine
                Lost in this love, forever mine

                Oh, this love is supernatural
                Something beautiful, something so true
                Like a melody, forever new
                Supernatural, just me and you

                No explanation, no words can define
                This connection, truly one of a kind
                Beyond the logic, beyond the known
                In this love, we're never alone

                Oh, this love is supernatural
                Something beautiful, something so true
                Like a melody, forever new
                Supernatural, just me and you

                Supernatural...
                Oh, so natural with you...
            `
        },
        {
            title: "Favorite Lesson",
            artist: "Yaeow",
            src: "favorite_lesson.mp3",
            albumArt: "album_art_favorite_lesson.jpg",
            introOffset: 15.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Always telling me that I should find the time for me
                Working tirelessly until I lose my energy
                You’re the only one who really knows the things I need
                And darling, I’m the same with you

                ‘Cause every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test
                Every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test

                Building something from the ground up, you always help me see
                That even when it’s tough, it’s worth the struggle, endlessly
                You’re the guiding light that always keeps me on my feet
                And darling, I’m the same with you

                ‘Cause every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test
                Every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test

                Through highs and lows, you’re always there
                A bond like ours is truly rare
                No matter what, we’ll always share
                This journey, with no fear

                ‘Cause every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test
                Every lesson you ever taught me
                Has always been the best
                I’m so grateful that you’re always with me
                Always put me to the test

                Favorite lesson... favorite lesson...
                You’re the best... you’re the best...
            `
        },
        {
            title: "So High School",
            artist: "Taylor Swift",
            src: "so_high_school.mp3",
            albumArt: "album_art_so_high_school.jpg",
            introOffset: 9.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                I feel like I'm back in high school again
                Butterflies every time you walk in
                Like a freshman, crushin' hard, don't pretend
                This feeling's got me spinnin' 'round the bend

                Oh, you got me feeling so high school
                Got me skipping through the halls with you
                Every moment's golden, shiny, and new
                Yeah, this love is so high school

                Passing notes and whispering in class
                Hoping this feeling will forever last
                Every glance, a secret, a sweet little blast
                This story's moving way too fast

                Oh, you got me feeling so high school
                Got me skipping through the halls with you
                Every moment's golden, shiny, and new
                Yeah, this love is so high school

                No homework, no drama, just you and me
                Living out a teenage dream, wild and free
                Like the first dance, under the gym lights
                Holding onto these magical nights

                Oh, you got me feeling so high school
                Got me skipping through the halls with you
                Every moment's golden, shiny, and new
                Yeah, this love is so high school

                So high school...
                Yeah, with you, it's so high school...
            `
        },
        {
            title: "Photograph",
            artist: "Ed Sheeran",
            src: "photograph.mp3",
            albumArt: "album_art_photograph.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                Loving can hurt, loving can hurt sometimes
                But it's the only thing that I know
                When it's good, when it's good, it's so good, it's so good
                'Til it goes bad, 'til it goes bad, 'Til it goes bad
                But still, I know, that I know, that I know
                Good things come to those who wait, no, never give up on you

                And if you hurt me, that's okay, baby, only words bleed
                Inside these pages you just hold me
                And I won't ever let you go
                Wait for me to come home

                Loving can heal, loving can mend your soul
                And it's the only thing that I know
                I swear it will get easier,
                Remember that with every piece of you
                And it's the only thing we take with us when we die

                And if you hurt me, that's okay, baby, only words bleed
                Inside these pages you just hold me
                And I won't ever let you go
                Wait for me to come home

                You could fit me inside the necklace you got when you were sixteen
                Next to your heartbeat where I should be
                Keep it deep within your soul
                And if you want to, take a look at me now
                Oh, oh, oh, yeah, I'll be there, I'll be there
                Always when you need me, every moment I'll be waiting
                Forever with you, every single day

                And if you hurt me, that's okay, baby, only words bleed
                Inside these pages you just hold me
                And I won't ever let you go
                Wait for me to come home

                You can fit me inside the necklace you got when you were sixteen
                Next to your heartbeat where I should be
                Keep it deep within your soul
                And if you want to, take a look at me now
            `
        },
        {
            title: "You'll Be In My Heart",
            artist: "Niki",
            src: "youll_be_in_my_heart.mp3",
            albumArt: "album_art_youll_be_in_my_heart.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                Come stop your crying
                It'll be alright
                Just take my hand
                Hold it tight
                I will protect you
                From all around you
                I will be here
                Don't you cry

                For one so small
                You seem so strong
                My arms will hold you
                Keep you safe and warm
                This bond between us
                Can't be broken
                I will be here, don't you cry
                'Cause you'll be in my heart
                Yes, you'll be in my heart
                From this day on
                Now and forever more

                Why can't they understand the way we feel?
                They just don't trust what they can't explain
                I know we're different but deep inside us
                We're not that different at all

                For one so small
                You seem so strong
                My arms will hold you
                Keep you safe and warm
                This bond between us
                Can't be broken
                I will be here, don't you cry
                'Cause you'll be in my heart
                Yes, you'll be in my heart
                From this day on
                Now and forever more

                You'll be in my heart
                No matter what they say
                You'll be in my heart
                Always
                I'll be there, always there
                For one so small, you seem so strong
                My arms will hold you, keep you safe and warm
                This bond between us can't be broken
                I will be here, don't you cry

                'Cause you'll be in my heart
                Yes, you'll be in my heart
                From this day on
                Now and forever more
                Oh, you'll be in my heart
                You'll be in my heart
                Now and forever more
            `
        },
        {
            title: "Tarot",
            artist: ".Feast",
            src: "tarot.mp3",
            albumArt: "album_art_tarot.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                Di antara kartu-kartu tua
                Terbentang kisah yang tak terduga
                Masa lalu, kini, dan nanti
                Terungkap dalam setiap sisi

                Tarot, oh Tarot
                Buka mataku, tunjukkan jalan
                Tarot, oh Tarot
                Bisikkan rahasia kehidupan

                Pedang dan cawan, koin dan tongkat
                Setiap simbol punya makna kuat
                Cahaya dan bayangan menari
                Di panggung takdir yang abadi

                Tarot, oh Tarot
                Buka mataku, tunjukkan jalan
                Tarot, oh Tarot
                Bisikkan rahasia kehidupan

                Takdir bukan hanya garis tangan
                Tapi pilihan di persimpangan
                Berani melangkah, hadapi badai
                Dengan petunjuk yang kau berikan

                Tarot, oh Tarot
                Buka mataku, tunjukkan jalan
                Tarot, oh Tarot
                Bisikkan rahasia kehidupan

                Tarot... Tarot...
                Kisahku terukir di sana...
            `
        },
        {
            title: "O, Tuan",
            artist: ".Feast",
            src: "o_tuan.mp3",
            albumArt: "album_art_o_tuan.jpg",
            introOffset: 0.00, // Vokal masuk (detik)
            lyrics: `
                O, Tuan, dengarkanlah
                Rintihan hati yang resah
                Di tengah bisingnya dunia
                Mencari makna, mencari arah

                O, Tuan, bimbinglah langkahku
                Terangi jalanku yang sendu
                Dalam gelap, dalam ragu
                Hanya pada-Mu aku bertumpu

                Janji-janji yang terucap
                Seringkali hanya fatamorgana
                Kebenaran yang disembunyikan
                Di balik topeng kemunafikan

                O, Tuan, bimbinglah langkahku
                Terangi jalanku yang sendu
                Dalam gelap, dalam ragu
                Hanya pada-Mu aku bertumpu

                Kekuasaan membutakan mata
                Harta melalaikan jiwa
                Tapi keadilan takkan mati
                Sampai akhir nanti

                O, Tuan, bimbinglah langkahku
                Terangi jalanku yang sendu
                Dalam gelap, dalam ragu
                Hanya pada-Mu aku bertumpu

                O, Tuan... O, Tuan...
                Dengarkanlah...
            `
        },
        {
            title: "Ramai Sepi Bersama",
            artist: "Hindia",
            src: "ramai_sepi_bersama.mp3",
            albumArt: "album_art_ramai_sepi_bersama.jpg",
            introOffset: 12.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Di tengah ramai, aku sendiri
                Mencari arti, di antara bising
                Dunia berputar, tak henti-henti
                Namun hatiku, masih terasing

                Ramai sepi bersama, dalam riuh kota
                Kita mencari makna, di antara fatamorgana
                Ramai sepi bersama, dalam hening jiwa
                Berharap menemukan, damai yang nyata

                Wajah-wajah asing, silih berganti
                Senyum dan tawa, hanya ilusi
                Ingin ku bicara, namun tak berani
                Terjebak dalam, sunyi yang abadi

                Ramai sepi bersama, dalam riuh kota
                Kita mencari makna, di antara fatamorgana
                Ramai sepi bersama, dalam hening jiwa
                Berharap menemukan, damai yang nyata

                Mungkin ini jalan, yang harus kutempuh
                Menyelami diri, di antara keruh
                Mencari cahaya, di ujung keluh
                Agar tak lagi, merasa rapuh

                Ramai sepi bersama, dalam riuh kota
                Kita mencari makna, di antara fatamorgana
                Ramai sepi bersama, dalam hening jiwa
                Berharap menemukan, damai yang nyata

                Ramai sepi... bersama...
                Hindia...
            `
        },
        {
            title: "Everything U Are",
            artist: "Hindia",
            src: "everything_u_are.mp3",
            albumArt: "album_art_everything_u_are.jpg",
            introOffset: 15.00, // Estimasi waktu vokal masuk (detik)
            lyrics: `
                Wajahmu kuingat selalu
                Lupakan hal-hal yang menggangguku
                Kar'na hari ini mata kita beradu
                Kita saling bantu

                Melepas perasaan
                Tinggi ke angkasa
                Menantang dunia
                Merayakan muda
                'Tuk satu jam saja

                Kita hampir mati
                Dan kauselamatkan aku
                Dan ku menyelamatkanmu
                Dan sekarang aku tahu

                Cerita kita tak jauh berbeda
                Got beat down by the world
                Sometimes I wanna fold
                Namun, suratmu 'kan kuceritakan
                Ke anak-anakku nanti

                Bahwa aku pernah dicintai
                With everything you are
                Fully as I am
                With everything you are

                Wajahmu yang beragam rupa
                Pastikan ku tak sendirian
                Jalani derita
                Kaubawakan kisahmu, aku mendengarkan

                Oh, kita bergantian
                Bertukar nestapa
                Menawar trauma
                Datang seadanya
                Terasku terbuka

                Kita hampir mati
                Dan kauselamatkan aku
                Dan ku menyelamatkanmu
                Dan sekarang aku tahu
                Cerita kita tak jauh berbeda
                Got beat down by the world
                Sometimes I wanna fold
                Namun, suratmu 'kan kuceritakan
                Ke anak-anakku nanti

                Bahwa aku pernah dicintai
                With everything you are
                Fully as I am
                With everything you are
            `
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar (album art, judul, artis, lirik)
    function loadSong(songIndex) {
        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlist.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            lyricsText.innerHTML = "<p>Terjadi kesalahan saat memuat lirik.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong(); // Pastikan stop auto-scroll saat ganti lagu
            return;
        }

        const song = playlist[songIndex];
        audioPlayer.src = song.src;
        audioPlayer.load(); // Panggil .load() secara eksplisit setiap kali src berubah
        currentAlbumArt.src = song.albumArt;
        currentSongTitle.textContent = song.title;
        currentArtistName.textContent = song.artist;
        
        // --- Proses Lirik untuk Auto-scroll dan Penyorotan ---
        lyricsText.innerHTML = ''; // Bersihkan konten lirik sebelumnya
        lyricLines = []; // Reset array lirik yang sudah di-parse
        
        // Ambil introOffset dari data lagu
        introOffset = song.introOffset || 0; 

        // Pembersihan lirik dan pembuatan elemen p.lyric-line
        const cleanedLyrics = song.lyrics
            .replace(/<\/?b>/g, '') // Hapus tag <b>
            .replace(/🎶\s*[\w\s\.-]+\s*–\s*[\w\s\.-]+/g, '') // Hapus intro "🎶 Title - Artist"
            .replace(/(^|\n)\s*(Intro|Verse|Chorus|Bridge|Outro|Pre-Chorus|Post-Chorus|Hook|Refrain|Solo|Break|Instrumental)\s*\d*\s*(\(|\)|:|\-)?\s*(<br\/?>)?/gi, '') // Hapus penanda struktur
            .split('\n') // Pisahkan per baris
            .map(line => line.trim()) // Hapus spasi di awal/akhir setiap baris
            .filter(line => line.length > 0) // Hapus baris yang kosong sepenuhnya
            .join('\n'); // Gabungkan kembali menjadi string bersih

        const lines = cleanedLyrics.split('\n'); // Sekarang pisahkan lagi baris yang sudah bersih

        lines.forEach(line => {
            const p = document.createElement('p');
            p.classList.add('lyric-line');
            p.textContent = line;
            lyricsText.appendChild(p);
            lyricLines.push(p); // Simpan referensi elemen DOM
        });

        estimatedLineDuration = 0; // Reset dulu, akan dihitung ulang saat loadedmetadata


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

        // === IMPLEMENTASI MEDIA SESSION API ===
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: 'Custom Playlist', // Anda bisa ganti ini jika punya nama album
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

            // Mulai auto-scroll lirik saat lagu play
            startLyricsAutoScroll();

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

        // Hentikan auto-scroll lirik saat lagu pause
        stopLyricsAutoScroll();
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
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Mainkan lagu sebelumnya
    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
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
        if (!isNaN(audioPlayer.duration) && lyricLines.length > 0 && estimatedLineDuration > 0) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);

            // Logika scroll untuk teks biasa (estimasi)
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

            // Hitung estimatedLineDuration
            if (lyricLines.length > 0) {
                const outroCompensation = 3; // Kurangi 3 detik untuk outro/akhir lagu
                const effectiveDuration = Math.max(0, audioPlayer.duration - introOffset - outroCompensation);
                
                if (effectiveDuration > 0) { // Pastikan durasi efektif positif
                    estimatedLineDuration = effectiveDuration / lyricLines.length;
                } else {
                    estimatedLineDuration = 0; // Jika durasi efektif nol atau negatif, set ke nol
                }
                console.log(`Durasi total: ${audioPlayer.duration.toFixed(2)}s, Intro Offset: ${introOffset.toFixed(2)}s, Effective Duration: ${effectiveDuration.toFixed(2)}s, Baris lirik: ${lyricLines.length}, Estimasi durasi per baris: ${estimatedLineDuration.toFixed(2)}s`);
            } else {
                estimatedLineDuration = 0;
            }

            // Jika lagu sedang bermain dan lirik siap, mulai auto-scroll
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
            
            // Logika estimasi
            if (seekTime >= introOffset) {
                const timeAfterIntro = seekTime - introOffset;
                currentLyricLineIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));
            } else {
                currentLyricLineIndex = -1;
            }
            updateLyricsScroll(true); // Panggil dengan force scroll
            if (isPlaying && lyricsScrollInterval === null && estimatedLineDuration > 0) {
                startLyricsAutoScroll();
            }
        }
    });

    audioPlayer.addEventListener('ended', () => {
        playNextSong();
    });

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

    closePlaylistBtn.addEventListener('click', () => {
        hidePlaylistSidebar();
    });

    sidebarOverlay.addEventListener('click', () => {
        hidePlaylistSidebar();
    });


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
                pauseSong(); // Jeda musik saat timer habis
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


    // --- FUNGSI DAN LOGIKA AUTO-SCROLL LIRIK (Disesuaikan untuk Teks Biasa) ---

    function startLyricsAutoScroll() {
        stopLyricsAutoScroll(); // Hentikan interval lama jika ada

        if (lyricLines.length === 0 || estimatedLineDuration <= 0) {
            console.warn("Lirik tidak tersedia atau durasi baris tidak dapat diestimasi. Auto-scroll lirik dinonaktifkan.");
            return;
        }

        // Set index awal berdasarkan posisi lagu saat ini (memperhitungkan introOffset)
        let initialIndex = -1;
        if (audioPlayer.currentTime >= introOffset) {
            const timeAfterIntro = audioPlayer.currentTime - introOffset;
            initialIndex = Math.min(lyricLines.length - 1, Math.floor(timeAfterIntro / estimatedLineDuration));
        }
        currentLyricLineIndex = initialIndex;

        updateLyricsScroll(true); // Langsung update sekali saat mulai

        lyricsScrollInterval = setInterval(() => {
            if (!isPlaying) {
                return;
            }

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

            if (audioPlayer.currentTime >= audioPlayer.duration - 0.5 && lyricsScrollInterval) {
                stopLyricsAutoScroll();
            }
        }, 100); // Periksa setiap 0.1 detik untuk responsivitas yang maksimal
    }

    function stopLyricsAutoScroll() {
        if (lyricsScrollInterval) {
            clearInterval(lyricsScrollInterval);
            lyricsScrollInterval = null;
        }
        lyricLines.forEach(line => {
            if (line) line.classList.remove('active-lyric'); // Cek jika elemen ada
        });
        currentLyricLineIndex = -1;
    }

    function updateLyricsScroll(forceScroll = false) {
        lyricLines.forEach((line, index) => {
            if (!line) return; // Pastikan elemen ada

            if (index === currentLyricLineIndex) {
                line.classList.add('active-lyric');
                const lyricsSection = document.querySelector('.lyrics-section');
                if (!lyricsSection) return;

                const lineRect = line.getBoundingClientRect();
                const containerRect = lyricsSection.getBoundingClientRect();

                const isLineAboveCenter = lineRect.top + (lineRect.height / 2) < containerRect.top + (containerRect.height / 2);
                const isLineBelowCenter = lineRect.top + (lineRect.height / 2) > containerRect.top + (containerRect.height / 2);

                if (forceScroll || isLineAboveCenter || isLineBelowCenter) {
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
        lyricsText.innerHTML = "<p>Silakan tambakan file MP3 dan gambar album di folder yang sama, lalu update array 'playlist' di script.js.</p>";
    }
});
