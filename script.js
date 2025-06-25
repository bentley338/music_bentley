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
    const lyricsText = document.getElementById('lyrics-text');
    const playlistUl = document.getElementById('playlist');
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.getElementById('playlist-sidebar');
    const closePlaylistBtn = document.getElementById('close-playlist-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const backgroundVideo = document.getElementById('background-video');

    // --- Variabel State ---
    let currentSongIndex = 0;
    let isPlaying = false;

    // --- DATA LAGU (INI BAGIAN KRUSIAL YANG HARUS COCOK DENGAN FILE FISIK ANDA) ---
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
                While you let go<<br>
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
                Bergema sampai selamanya<br>
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
                And I won't ever let you go<br>
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
                And I won't ever let you go<br>
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
                And I won't ever let you go<br>
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
                Now and forever more<br><br>
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
        // === LAGU BARU: TAROT ===
        {
            title: "Tarot",
            artist: ".Feast",
            src: "tarot.mp3", // PASTIKAN NAMA FILE MP3 INI SAMA PERSIS
            albumArt: "album_art_tarot.jpg", // PASTIKAN NAMA FILE GAMBAR INI SAMA PERSIS
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
                Cahaya dan bayangan menari<br>
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
        // === LAGU BARU: O, TUAN ===
        {
            title: "O, Tuan",
            artist: ".Feast",
            src: "o_tuan.mp3", // PASTIKAN NAMA FILE MP3 INI SAMA PERSIS
            albumArt: "album_art_o_tuan.jpg", // PASTIKAN NAMA FILE GAMBAR INI SAMA PERSIS
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
        }
    ];

    // --- Fungsi Utama Pemutar Musik ---

    // Memuat data lagu ke pemutar (album art, judul, artis, lirik)
    function loadSong(songIndex) {
        // Validasi songIndex untuk menghindari error jika index tidak valid
        if (songIndex < 0 || songIndex >= playlist.length) {
            console.error("Error: songIndex di luar batas array playlist. Index:", songIndex, "Ukuran array:", playlist.length);
            currentSongTitle.textContent = "Lagu tidak ditemukan";
            currentArtistName.textContent = "Pilih lagu lain atau cek data";
            lyricsText.innerHTML = "<p>Terjadi kesalahan saat memuat lirik.</p>";
            audioPlayer.src = ""; // Kosongkan sumber audio untuk mencegah error putar
            currentAlbumArt.src = "album_art_default.jpg"; // Ganti dengan gambar default/error
            pauseSong(); // Pastikan pemutar berhenti jika error
            return;
        }

        const song = playlist[songIndex];
        audioPlayer.src = song.src;
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

            // Handle actions (play, pause, nexttrack, previoustrack)
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
            // Anda juga bisa menambahkan setActionHandler untuk 'seekbackward', 'seekforward', dll.
        }
    }

    // Memutar lagu
    function playSong() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            console.warn("Audio source not loaded yet or invalid. Cannot play.");
            return;
        }

        audioPlayer.play().catch(error => {
            console.error("Error playing audio (autoplay blocked?):", error);
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playPauseBtn.setAttribute('aria-label', 'Pause');
        const albumArtImg = document.querySelector('.album-art-img');
        if (albumArtImg) {
            albumArtImg.style.animationPlayState = 'running';
        }

        // Update Media Session state
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
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

        // Update Media Session state
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
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) { // Putar jika sebelumnya sedang bermain
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon play jika tidak otomatis play
        }
    }

    // Mainkan lagu sebelumnya
    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) { // Putar jika sebelumnya sedang bermain
            playSong();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon play jika tidak otomatis play
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

    // --- Inisialisasi Aplikasi (Fungsi yang Berjalan Saat Halaman Dimuat) ---
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
