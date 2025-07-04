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
    const closeModalBtn = document.getElementById('close-timer-modal'); // Tombol X di modal
    const timerOptionBtns = document.querySelectorAll('.timer-option-btn');
    const customTimerInput = document.getElementById('custom-timer-minutes');
    const setCustomTimerBtn = document.getElementById('set-custom-timer-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // Timer elements (display di player utama)
    const playerTimerDisplay = document.getElementById('player-timer-display');
    const playerTimerCountdown = document.getElementById('player-timer-countdown');
    const playerCancelTimerBtn = document.getElementById('player-cancel-timer-btn'); // Tombol cancel di player utama

    // Timer elements (display di dalam modal)
    const modalActiveTimerDisplay = document.getElementById('modal-active-timer-display');
    const modalTimerCountdown = document.getElementById('modal-timer-countdown');
    const modalCancelTimerBtn = document.getElementById('modal-cancel-timer-btn'); // Tombol cancel di dalam modal

    // Audio Settings Elements (NEW)
    const audioSettingsBtn = document.getElementById('audio-settings-btn');
    const audioSettingsModal = document.getElementById('audio-settings-modal');
    const closeAudioSettingsModalBtn = document.getElementById('close-audio-settings-modal');

    const masterVolumeSlider = document.getElementById('master-volume-slider');
    const masterVolumeValue = document.getElementById('master-volume-value');
    const bassLevelSlider = document.getElementById('bass-level-slider');
    const bassLevelValue = document.getElementById('bass-level-value');
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
    let audioContext = null; // Inisialisasi null, akan dibuat saat play pertama
    let analyser = null;
    let source = null;
    let masterGainNode = null; // Node untuk volume utama
    let bassFilter = null; // Node untuk bass (low-shelf filter)
    let effectGainNode = null; // Node untuk level efek

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;
    let sleepTimerTimeoutId = null;
    let sleepTimerIntervalId = null;
    let timeRemaining = 0;
    let isShuffling = false;
    let repeatMode = 'off'; // 'off', 'one', 'all'
    let originalPlaylistOrder = [];
    let shuffledPlaylist = [];

    // --- DATA LAGU (Playlist lengkap dengan lagu baru) ---
    const playlist = [
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
                This is casual<<br><br>
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
            lyrics: `<b>🎶 Bergema Sampai Selamanya – Nadhif Basalamah</b><br><br>
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
                <b>Chorus</b><br>
                Bergema sampai selamanya<<br>
                Cinta kita takkan sirna<br>
                Di setiap nada yang tercipta<br>
                Hanyalah namamu yang ada<br><br>
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
            lyrics: `<b>🎶 Ride – SoMo</b><br><br>
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
                No rush, no hurry, take it slow<<br>
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
            lyrics: `<b>🎶 Rumah Kita – God Bless</b><br><br>
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
                Tempat kita berbagi cerita<<br>
                <b>Outro</b><br>
                Rumah kita...<br>
                Rumah kita...
            `
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
                You got that long hair, slick back, white T-shirt<br>
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
            lyrics: `<b>🎶 Message In A Bottle – Taylor Swift</b><br><br>
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
            src: "supernatural.mp3",
            albumArt: "album_art_supernatural.jpg",
            lyrics: `<b>🎶 Supernatural – Ariana Grande</b><br><br>
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
                Beyond the logic, beyond the known<<br>
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
                You’re the only one who really knows the things I need<br>
                And darling, I’m the same with you<br><br>
                <b>Chorus</b><br>
                ‘Cause every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br>
                Every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br><br>
                <b>Verse 2</b><br>
                Building something from the ground up, you always help me see<br>
                That even when it’s tough, it’s worth the struggle, endlessly<br>
                You’re the guiding light that always keeps me on my feet<br>
                And darling, I’m the same with you<br><br>
                <b>Chorus</b><br>
                ‘Cause every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br>
                Every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br><br>
                <b>Bridge</b><br>
                Through highs and lows, you’re always there<br>
                A bond like ours is truly rare<br>
                No matter what, we’ll always share<br>
                This journey, with no fear<br><br>
                <b>Chorus</b><br>
                ‘Cause every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br>
                Every lesson you ever taught me<br>
                Has always been the best<br>
                I’m so grateful that you’re always with me<br>
                Always put me to the test<br><br>
                <b>Outro</b><br>
                Favorite lesson... favorite lesson...<br>
                You’re the best... you’re the best...
            `
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
                Like a freshman, crushin' hard, don't pretend<br>
                This feeling's got me spinnin' 'round the bend<br><br>
                <b>Chorus</b><br>
                Oh, you got me feeling so high school<br>
                Got me skipping through the halls with you<br>
                Every moment's golden, shiny, and new<br>
                Yeah, this love is so high school<br><br>
                <b>Verse 2</b><br>
                Passing notes and whispering in class<br>
                Hoping this feeling will forever last<br>
                Every glance, a secret, a sweet little blast<br>
                This story's moving way too fast<br><br>
                <b>Chorus</b><br>
                Oh, you got me feeling so high school<br>
                Got me skipping through the halls with you<br>
                Every moment's golden, shiny, and new<br>
                Yeah, this love is so high school<br><br>
                <b>Bridge</b><br>
                No homework, no drama, just you and me<br>
                Living out a teenage dream, wild and free<br>
                Like the first dance, under the gym lights<br>
                Holding onto these magical nights<br><br>
                <b>Chorus</b><br>
                Oh, you got me feeling so high school<br>
                Got me skipping through the halls with you<br>
                Every moment's golden, shiny, and new<br>
                Yeah, this love is so high school<br><br>
                <b>Outro</b><br>
                So high school...<br>
                Yeah, with you, it's so high school...
            `
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
                When it's good, when it's good, it's so good, it's so good<br>
                'Til it goes bad, 'til it goes bad, 'Til it goes bad<br>
                But still, I know, that I know, that I know<br>
                Good things come to those who wait, no, never give up on you<br><br>
                <b>Chorus</b><br>
                And if you hurt me, that's okay, baby, only words bleed<br>
                Inside these pages you just hold me<br>
                And I won't ever let you go<<br>
                Wait for me to come home<br><br>
                <b>Verse 2</b><br>
                Loving can heal, loving can mend your soul<br>
                And it's the only thing that I know<br>
                I swear it will get easier,<br>
                Remember that with every piece of you<br>
                And it's the only thing we take with us when we die<br><br>
                <b>Chorus</b><br>
                And if you hurt me, that's okay, baby, only words bleed<br>
                Inside these pages you just hold me<br>
                And I won't ever let you go<<br>
                Wait for me to come home<br><br>
                <b>Bridge</b><br>
                You could fit me inside the necklace you got when you were sixteen<br>
                Next to your heartbeat where I should be<br>
                Keep it deep within your soul<br>
                And if you want to, take a look at me now<br>
                Oh, oh, oh, yeah, I'll be there, I'll be there<br>
                Always when you need me, every moment I'll be waiting<br>
                Forever with you, every single day<br><br>
                <b>Chorus</b><br>
                And if you hurt me, that's okay, baby, only words bleed<br>
                Inside these pages you just hold me<br>
                And I won't ever let you go<<br>
                Wait for me to come home<br><br>
                <b>Outro</b><br>
                You can fit me inside the necklace you got when you were sixteen<br>
                Next to your heartbeat where I should be<br>
                Keep it deep within your soul<br>
                And if you want to, take a look at me now
            `
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
                Hold it tight<br>
                I will protect you<br>
                From all around you<br>
                I will be here<br>
                Don't you cry<br><br>
                <b>Chorus</b><br>
                For one so small<br>
                You seem so strong<br>
                My arms will hold you<br>
                Keep you safe and warm<br>
                This bond between us<br>
                Can't be broken<br>
                I will be here, don't you cry<br>
                'Cause you'll be in my heart<br>
                Yes, you'll be in my heart<br>
                From this day on<br>
                Now and forever more<<br><br>
                <b>Verse 2</b><br>
                Why can't they understand the way we feel?<br>
                They just don't trust what they can't explain<br>
                I know we're different but deep inside us<br>
                We're not that different at all<br><br>
                <b>Chorus</b><br>
                For one so small<br>
                You seem so strong<br>
                My arms will hold you<br>
                Keep you safe and warm<br>
                This bond between us<br>
                Can't be broken<br>
                I will be here, don't you cry<br>
                'Cause you'll be in my heart<br>
                Yes, you'll be in my heart<br>
                From this day on<br>
                Now and forever more<br><br>
                <b>Bridge</b><br>
                You'll be in my heart<br>
                No matter what they say<br>
                You'll be in my heart<br>
                Always<br>
                I'll be there, always there<br>
                For one so small, you seem so strong<br>
                My arms will hold you, keep you safe and warm<br>
                This bond between us can't be broken<br>
                I will be here, don't you cry<br><br>
                <b>Outro</b><br>
                'Cause you'll be in my heart<br>
                Yes, you'll be in my heart<br>
                From this day on<br>
                Now and forever more<br>
                Oh, you'll be in my heart<br>
                You'll be in my heart<br>
                Now and forever more
            `
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
                Terungkap dalam setiap sisi<br><br>
                <b>Chorus</b><br>
                Tarot, oh Tarot<br>
                Buka mataku, tunjukkan jalan<br>
                Tarot, oh Tarot<br>
                Bisikkan rahasia kehidupan<br><br>
                <b>Verse 2</b><br>
                Pedang dan cawan, koin dan tongkat<br>
                Setiap simbol punya makna kuat<br>
                Cahaya dan bayangan menari<<br>
                Di panggung takdir yang abadi<br><br>
                <b>Chorus</b><br>
                Tarot, oh Tarot<br>
                Buka mataku, tunjukkan jalan<br>
                Tarot, oh Tarot<br>
                Bisikkan rahasia kehidupan<br><br>
                <b>Bridge</b><br>
                Takdir bukan hanya garis tangan<br>
                Tapi pilihan di persimpangan<br>
                Berani melangkah, hadapi badai<br>
                Dengan petunjuk yang kau berikan<br><br>
                <b>Chorus</b><br>
                Tarot, oh Tarot<br>
                Buka mataku, tunjukkan jalan<br>
                Tarot, oh Tarot<br>
                Bisikkan rahasia kehidupan<br><br>
                <b>Outro</b><br>
                Tarot... Tarot...<br>
                Kisahku terukir di sana...
            `
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
                Mencari makna, mencari arah<br><br>
                <b>Chorus</b><br>
                O, Tuan, bimbinglah langkahku<br>
                Terangi jalanku yang sendu<br>
                Dalam gelap, dalam ragu<br>
                Hanya pada-Mu aku bertumpu<br><br>
                <b>Verse 2</b><br>
                Janji-janji yang terucap<br>
                Seringkali hanya fatamorgana<br>
                Kebenaran yang disembunyikan<br>
                Di balik topeng kemunafikan<br><br>
                <b>Chorus</b><br>
                O, Tuan, bimbinglah langkahku<br>
                Terangi jalanku yang sendu<br>
                Dalam gelap, dalam ragu<br>
                Hanya pada-Mu aku bertumpu<br><br>
                <b>Bridge</b><br>
                Kekuasaan membutakan mata<br>
                Harta melalaikan jiwa<br>
                Tapi keadilan takkan mati<br>
                Sampai akhir nanti<br><br>
                <b>Chorus</b><br>
                O, Tuan, bimbinglah langkahku<br>
                Terangi jalanku yang sendu<br>
                Dalam gelap, dalam ragu<br>
                Hanya pada-Mu aku bertumpu<br><br>
                <b>Outro</b><br>
                O, Tuan... O, Tuan...<br>
                Dengarkanlah...
            `
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
                Namun hatiku, masih terasing<br><br>
                <b>Chorus</b><br>
                Ramai sepi bersama, dalam riuh kota<br>
                Kita mencari makna, di antara fatamorgana<<br>
                Ramai sepi bersama, dalam hening jiwa<br>
                Berharap menemukan, damai yang nyata<br><br>
                <b>Verse 2</b><br>
                Wajah-wajah asing, silih berganti<<br>
                Senyum dan tawa, hanya ilusi<br>
                Ingin ku bicara, namun tak berani<br>
                Terjebak dalam, sunyi yang abadi<br><br>
                <b>Chorus</b><br>
                Ramai sepi bersama, dalam riuh kota<br>
                Kita mencari makna, di antara fatamorgana<br>
                Ramai sepi bersama, dalam hening jiwa<<br>
                Berharap menemukan, damai yang nyata<br><br>
                <b>Bridge</b><br>
                Mungkin ini jalan, yang harus kutempuh<br>
                Menyelami diri, di antara keruh<br>
                Mencari cahaya, di ujung keluh<br>
                Agar tak lagi, merasa rapuh<br><br>
                <b>Chorus</b><br>
                Ramai sepi bersama, dalam riuh kota<br>
                Kita mencari makna, di antara fatamorgana<br>
                Ramai sepi bersama, dalam hening jiwa<br>
                Berharap menemukan, damai yang nyata<br><br>
                <b>Outro</b><br>
                Ramai sepi... bersama...<br>
                Hindia...
            `
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
                Reflects the truth beneath the sky<br><br>
                <b>Chorus</b><br>
                'Cause everything you are, is everything I need<br>
                A guiding star, planting a hopeful seed<br>
                In every beat, my heart finds its release<br>
                Everything you are, brings me inner peace<br><br>
                <b>Verse 2</b><br>
                Through fragile moments, and darkest nights<br>
                Your spirit shines, with endless lights<br>
                A symphony of grace, a gentle art<br>
                You're etched forever, deep within my heart<br><br>
                <b>Chorus</b><br>
                'Cause everything you are, is everything I need<<br>
                A guiding star, planting a hopeful seed<br>
                In every beat, my heart finds its release<br>
                Everything you are, brings me inner peace<br><br>
                <b>Bridge</b><br>
                No words can capture, no song can define<br>
                The depth of beauty, truly divine<br>
                A masterpiece, uniquely made<br>
                In every shade, a love displayed<br><br>
                <b>Chorus</b><br>
                'Cause everything you are, is everything I need<br>
                A guiding star, planting a hopeful seed<<br>
                In every beat, my heart finds its release<br>
                Everything you are, brings me inner peace<br><br>
                <b>Outro</b><br>
                Everything you are...<br>
                Oh, everything you are...
            `
        },
        {
            title: "Guilty As Sin",
            artist: "Taylor Swift",
            src: "guilty_as_sin.mp3",
            albumArt: "album_art_guilty_as_sin.jpg",
            lyrics: `<b>🎶 Guilty As Sin – Taylor Swift</b><br><br>
                <b>Verse 1</b><br>
                What if I told you I'm in love with someone new?<br>
                What if I told you that my heart broke for them too?<br>
                Not your fault, not my fault, maybe it's the season<br>
                But I can't shake this feeling, there's a reason<br><br>
                <b>Chorus</b><br>
                Guilty as sin, for the thoughts that I let creep in<br>
                For the way my mind keeps wandering, where it shouldn't have been<br>
                Oh, I'm guilty as sin, but the truth is I'm falling<br>
                For a fantasy, a whisper, a silent calling<br><br>
                <b>Verse 2</b><br>
                I try to push it down, to lock it far away<br>
                But every single night, it haunts me through the day<br>
                A fragile dream, a secret, a forbidden delight<br>
                Burning fiercely in the shadows of the night<br><br>
                <b>Chorus</b><br>
                Guilty as sin, for the thoughts that I let creep in<br>
                For the way my mind keeps wandering, where it shouldn't have been<br>
                Oh, I'm guilty as sin, but the truth is I'm falling<br>
                For a fantasy, a whisper, a silent calling<br><br>
                <b>Bridge</b><br>
                They say temptation's a devil dressed in gold<br>
                A story whispered, a story left untold<br>
                But how can something so wrong feel so right?<br>
                Lost in the shadows, bathed in the moonlight<br><br>
                <b>Outro</b><br>
                Guilty as sin... but I can't escape this pull<br>
                Guilty as sin... losing all control...
            `
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar (album art, judul, artis, lirik)
    function loadSong(songIndex) {
        // Tentukan playlist yang akan digunakan (asli atau diacak)
        const currentPlaylist = isShuffling ? shuffledPlaylist : playlist;

        if (songIndex < 0 || songIndex >= currentPlaylist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", currentPlaylist.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            lyricsText.innerHTML = "<p>Terjadi kesalahan saat memuat lirik.</p>";
            audioPlayer.src = "";
            currentAlbumArt.src = "album_art_default.jpg";
            pauseSong();
            return;
        }

        const song = currentPlaylist[songIndex];
        audioPlayer.src = song.src;
        audioPlayer.load(); // Panggil .load() secara eksplisit setiap kali src berubah
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

            // Pastikan action handlers diatur sekali saja atau diatur ulang
            // agar tidak ada duplikasi listener
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
                effectGainNode = audioContext.createGain();

                // Konfigurasi Bass Filter (Low-shelf filter)
                bassFilter.type = 'lowshelf';
                bassFilter.frequency.value = 250; // Frekuensi cutoff untuk bass (Hz)
                bassFilter.gain.value = parseFloat(bassLevelSlider.value); // Gain awal dari slider

                // Hubungkan node-node dalam graph:
                // source -> analyser -> bassFilter -> effectGainNode -> masterGainNode -> destination
                source.connect(analyser);
                analyser.connect(bassFilter);
                bassFilter.connect(effectGainNode);
                effectGainNode.connect(masterGainNode);
                masterGainNode.connect(audioContext.destination);

                analyser.fftSize = 256;
                console.log("Web Audio API initialized successfully with effects chain.");
                drawVisualizer(); // Mulai menggambar visualizer
            } catch (e) {
                console.error("Gagal menginisialisasi Web Audio API:", e);
                audioVisualizerCanvas.style.display = 'none'; // Sembunyikan visualizer jika error
                // Jika API gagal, fallback ke pemutaran audio langsung
                audioPlayer.connect(audioContext.destination); // Ini tidak akan bekerja jika audioContext gagal
                // Jadi, jika ada error, kita harus memastikan audioPlayer tetap bisa memutar langsung
                // tanpa Web Audio API chain. Untuk kesederhanaan, kita akan biarkan audioPlayer.src
                // yang menangani pemutaran, dan Web Audio API hanya untuk efek tambahan.
                // Jika audioContext gagal, efek tidak akan berfungsi, tapi play/pause tetap.
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
        const currentPlaylist = isShuffling ? shuffledPlaylist : playlist;

        if (repeatMode === 'one') {
            loadSong(currentSongIndex); // Muat ulang lagu yang sama
        } else if (repeatMode === 'all' || isShuffling) {
            currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
            loadSong(currentSongIndex);
        } else { // Repeat off
            if (currentSongIndex < currentPlaylist.length - 1) {
                currentSongIndex++;
                loadSong(currentSongIndex);
            } else {
                // Berhenti jika sudah lagu terakhir dan repeat off
                pauseSong();
                currentSongIndex = 0; // Kembali ke lagu pertama
                loadSong(currentSongIndex); // Muat lagu pertama tanpa memutar
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
        const currentPlaylist = isShuffling ? shuffledPlaylist : playlist;

        if (repeatMode === 'one') {
            loadSong(currentSongIndex); // Muat ulang lagu yang sama
        } else {
            currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
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
            updateLyricsScroll(); // Panggil fungsi auto-scroll lirik
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioPlayer.duration)) {
            durationSpan.textContent = formatTime(audioPlayer.duration);
            // Set volume awal saat metadata dimuat
            // Volume utama sekarang dikontrol oleh masterGainNode
            // audioPlayer.volume = masterVolumeSlider.value / 100; // Ini tidak lagi diperlukan
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

    // --- Fungsi Playlist ---

    function buildPlaylist(filterText = '') {
        playlistUl.innerHTML = '';
        const currentPlaylist = isShuffling ? shuffledPlaylist : playlist;
        const filteredPlaylist = currentPlaylist.filter(song =>
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
            // Gunakan index dari playlist asli untuk loadSong agar tidak bingung saat shuffle/filter
            const originalIndex = playlist.findIndex(s => s.title === song.title && s.artist === song.artist);
            li.setAttribute('data-original-index', originalIndex); // Simpan indeks asli
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title} Album Art">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => {
                // Saat diklik, gunakan indeks asli untuk memuat lagu dari playlist asli
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

    // Fungsi untuk menampilkan modal timer
    function showTimerModal() {
        updateAllTimerDisplays();
        timerModal.classList.add('visible');
        modalOverlay.classList.add('visible');
    }

    // Fungsi untuk menyembunyikan modal timer
    function hideTimerModal() {
        timerModal.classList.remove('visible');
        modalOverlay.classList.remove('visible');
        timerOptionBtns.forEach(btn => btn.classList.remove('selected'));
        customTimerInput.value = '';
    }

    // Fungsi untuk memulai sleep timer
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

    // Fungsi untuk mengupdate tampilan timer di player utama dan di modal
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

    // Fungsi untuk mereset sleep timer (membatalkan)
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
    modalOverlay.addEventListener('click', hideTimerModal);

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

    // --- Audio Settings Modal Functions (NEW) ---
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
        if (effectGainNode) {
            effectLevelSlider.value = effectGainNode.gain.value * 100;
            effectLevelValue.textContent = `${Math.round(effectGainNode.gain.value * 100)}%`;
        }
    }

    function hideAudioSettingsModal() {
        audioSettingsModal.classList.remove('visible');
        modalOverlay.classList.remove('visible');
    }

    audioSettingsBtn.addEventListener('click', showAudioSettingsModal);
    closeAudioSettingsModalBtn.addEventListener('click', hideAudioSettingsModal);

    // --- Audio Control Sliders Event Listeners (NEW) ---
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

    effectLevelSlider.addEventListener('input', () => {
        if (effectGainNode) {
            effectGainNode.gain.value = effectLevelSlider.value / 100;
            effectLevelValue.textContent = `${effectLevelSlider.value}%`;
        }
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
            originalPlaylistOrder = [...playlist]; // Simpan urutan asli
            shuffledPlaylist = shuffleArray([...playlist]); // Acak salinan
            // Perbarui currentSongIndex ke posisi lagu saat ini di playlist yang diacak
            const currentSong = playlist[currentSongIndex]; // Lagu yang sedang diputar (dari playlist asli)
            currentSongIndex = shuffledPlaylist.findIndex(song => song.title === currentSong.title && song.artist === currentSong.artist);
        } else {
            shuffleBtn.classList.remove('active');
            // Kembali ke urutan playlist asli
            const currentSong = shuffledPlaylist[currentSongIndex]; // Lagu yang sedang diputar (dari playlist acak)
            currentSongIndex = originalPlaylistOrder.findIndex(song => song.title === currentSong.title && song.artist === currentSong.artist);
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
        const lyricsLines = lyricsText.querySelectorAll('p, b'); // Pilih p atau b (untuk verse/chorus)
        if (lyricsLines.length === 0 || isNaN(audioPlayer.duration) || audioPlayer.duration === 0) {
            return;
        }

        // Hapus highlight dari semua baris
        lyricsText.querySelectorAll('.active-lyric').forEach(line => line.classList.remove('active-lyric'));

        // Hitung persentase progres lagu
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration);

        // Estimasi baris lirik yang aktif
        // Ini adalah pendekatan sederhana karena tidak ada timestamp per baris lirik.
        // Akan lebih akurat jika lirik memiliki timestamp.
        const estimatedLineIndex = Math.floor(progressPercentage * lyricsLines.length);

        if (estimatedLineIndex < lyricsLines.length) {
            const activeLine = lyricsLines[estimatedLineIndex];
            activeLine.classList.add('active-lyric');

            // Gulir lirik agar baris aktif terlihat di tengah
            const lyricsSectionHeight = lyricsText.clientHeight;
            const lineHeight = activeLine.offsetHeight;
            const lineOffsetTop = activeLine.offsetTop;

            // Hitung posisi scroll yang diinginkan
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
            return; // Hanya menggambar jika analyser ada dan audio sedang diputar
        }

        requestAnimationFrame(drawVisualizer); // Loop animasi

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
    resizeCanvas(); // Panggil sekali saat dimuat
    window.addEventListener('resize', resizeCanvas); // Panggil saat resize

    // --- Theme Toggle Function ---
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme'); // Hapus semua tema
        document.body.classList.add(theme); // Tambahkan tema baru (misal: 'light-theme')
        localStorage.setItem('theme', theme); // Simpan preferensi tema

        // Update tombol tema
        if (theme === 'light-theme') { // Perhatikan: kelas tema di body adalah 'light-theme' atau 'dark-theme'
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
            themeToggleBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
            themeToggleBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        // Dapatkan tema saat ini dari body, bukan dari local storage yang mungkin belum diinisialisasi
        const currentThemeClass = document.body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
        if (currentThemeClass === 'dark-theme') {
            applyTheme('light-theme');
        } else {
            applyTheme('dark-theme');
        }
    });


    // --- Inisialisasi Aplikasi (Fungsi yang Berjalan Saat Halaman Dimuat) ---
    // Simpan urutan playlist asli saat inisialisasi
    originalPlaylistOrder = [...playlist];

    if (playlist.length > 0) {
        loadSong(currentSongIndex);
        buildPlaylist(); // Bangun playlist awal
        updateAllTimerDisplays(); // Inisialisasi tampilan timer
        // updateMuteButtonIcon(); // Tidak lagi diperlukan karena kontrol volume di modal
        // Muat preferensi tema
        const savedTheme = localStorage.getItem('theme') || 'dark-theme'; // Default ke 'dark-theme'
        applyTheme(savedTheme);

        // Inisialisasi slider volume modal dengan nilai default
        masterVolumeSlider.value = 100;
        masterVolumeValue.textContent = '100%';
        bassLevelSlider.value = 0;
        bassLevelValue.textContent = '0 dB';
        effectLevelSlider.value = 0;
        effectLevelValue.textContent = '0%';

    } else {
        console.error("Tidak ada lagu ditemukan di array 'playlist'.");
        currentSongTitle.textContent = "Tidak ada lagu";
        currentArtistName.textContent = "Silakan tambahkan lagu di script.js";
        lyricsText.innerHTML = "<p>Silakan tambahkan file MP3 dan gambar album di folder yang sama, lalu update array 'playlist' di script.js.</p>";
    }
});
