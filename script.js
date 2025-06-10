document.addEventListener('DOMContentLoaded', () => {
    // === Elemen DOM ===
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const currentSongTitle = document.getElementById('current-song-title');
    const currentArtistName = document.getElementById('current-artist-name');
    const currentAlbumArt = document.getElementById('current-album-art');
    const lyricsText = document.getElementById('lyrics-text'); // Pastikan id ini ada di HTML
    const togglePlaylistBtn = document.getElementById('toggle-playlist');
    const playlistSidebar = document.querySelector('.playlist-sidebar');
    const playlistUl = document.getElementById('playlist');
    const backgroundVideo = document.getElementById('background-video');

    // === Data Lagu (Daftar Putar) ===
    const playlist = [
        {
            title: 'Back to Friends',
            artist: 'Sombr',
            albumArt: 'album_art_back_to_friends.jpg',
            audioSrc: 'Sombr_Back_to_Friends.mp3', // Ganti dengan path audio yang benar
            lyrics: `(Verse 1)
Masih teringat canda tawa kita
Dulu selalu bersama tanpa ada celah
Cerita dan mimpi yang kita rajut indah
Takkan pudar walau waktu terus melangkah

(Chorus)
Ku ingin kembali ke masa itu, teman
Dimana riang gembira tak pernah usai
Kembali ke teman, kembali ke cerita
Back to friends, dan bergema sampai selamanya

(Verse 2)
Jalan kita berbeda, sibuk dengan dunia
Namun hati ini tak pernah lupa
Ikatan batin yang takkan pernah sirna
Selalu ada walau jarak memisah kita

(Chorus)
Ku ingin kembali ke masa itu, teman
Dimana riang gembira tak pernah usai
Kembali ke teman, kembali ke cerita
Back to friends, dan bergema sampai selamanya

(Bridge)
Mungkin tak seperti dulu, tapi semangat itu
Kan selalu membara di dalam kalbu
Mari kita ciptakan kenangan baru
Bersama lagi, mengukir kisah yang syahdu

(Chorus)
Ku ingin kembali ke masa itu, teman
Dimana riang gembira tak pernah usai
Kembali ke teman, kembali ke cerita
Back to friends, dan bergema sampai selamanya

(Outro)
Oh, teman-teman, selalu di hati
Bergema sampai selamanya, takkan mati
Kembali ke teman... selamanya...
`
        },
        {
            title: 'Bergema Sampai Selamanya',
            artist: 'Sombr', // Contoh artis lain
            albumArt: 'album_art_bergema_selamanya.jpg', // Ganti dengan gambar lain
            audioSrc: 'Sombr_Bergema_Sampai_Selamanya.mp3', // Ganti dengan path audio yang benar
            lyrics: `(Verse 1)
Di dalam sunyi, ku dengar namamu
Bergema di relung hati yang pilu
Setiap detik, setiap waktu
Kau selalu ada, di setiap langkahku

(Chorus)
Bergema sampai selamanya, cintaku
Takkan pudar, walau badai menerpa
Bergema sampai selamanya, rinduku
Kau adalah bintang di gelapnya jiwa

(Verse 2)
Kenangan indah, takkan terlupakan
Tersimpan rapi dalam sanubari
Setiap senyum, setiap tatapan
Mengukir kisah abadi yang takkan mati

(Chorus)
Bergema sampai selamanya, cintaku
Takkan pudar, walau badai menerpa
Bergema sampai selamanya, rinduku
Kau adalah bintang di gelapnya jiwa

(Bridge)
Waktu boleh berlalu, dunia boleh berubah
Namun cinta ini takkan pernah lelah
Terus bersemi, terus tumbuh merekah
Dalam hati ini, selamanya kau tinggallah

(Chorus)
Bergema sampai selamanya, cintaku
Takkan pudar, walau badai menerpa
Bergema sampai selamanya, rinduku
Kau adalah bintang di gelapnya jiwa

(Outro)
Selamanya... bergema...
Cinta ini... takkan sirna...
`
        },
        // Tambahkan lagu lain di sini
        {
            title: 'Another Song Title',
            artist: 'Another Artist',
            albumArt: 'album_art_placeholder.jpg',
            audioSrc: 'another_song.mp3',
            lyrics: `Lirik untuk lagu lain...
Baris 1
Baris 2
Baris 3`
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // === Fungsi Pembantu ===

    // Format waktu (misal: 150 detik -> 2:30)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Muat lagu ke player
    function loadSong(songIndex) {
        const song = playlist[songIndex];
        currentSongTitle.textContent = song.title;
        currentArtistName.textContent = song.artist;
        currentAlbumArt.src = song.albumArt;
        audioPlayer.src = song.audioSrc;
        // Memecah lirik per baris dan membungkusnya dengan tag <p>
        lyricsText.innerHTML = song.lyrics.split('\n').map(line => `<p>${line}</p>`).join('');
        updatePlaylistHighlight(songIndex); // Sorot lagu di daftar putar

        // Memastikan video background sesuai dengan mood lagu jika diinginkan
        // Contoh sederhana: jika ada video untuk setiap lagu, ganti src video di sini
        // backgroundVideo.src = song.backgroundVideo || 'abstract_wave_bg.mp4';
        // backgroundVideo.load();
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    // Mainkan lagu berikutnya
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon play jika tidak otomatis play
        }
    }

    // Mainkan lagu sebelumnya
    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon play jika tidak otomatis play
        }
    }

    // Perbarui tampilan daftar putar
    function renderPlaylist() {
        playlistUl.innerHTML = ''; // Kosongkan daftar putar yang ada
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title}">
                <div class="playlist-song-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (!isPlaying) { // Jika tidak sedang bermain, mulai mainkan
                    togglePlayPause();
                }
                // Opsional: sembunyikan sidebar setelah memilih lagu di mobile
                // if (window.innerWidth <= 768) {
                //     playlistSidebar.classList.remove('visible');
                // }
            });
            playlistUl.appendChild(li);
        });
    }

    // Sorot lagu yang sedang diputar di daftar putar
    function updatePlaylistHighlight(activeIndex) {
        document.querySelectorAll('.playlist-items li').forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // === Event Listeners ===

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);

    // Update progress bar dan waktu saat lagu diputar
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = isNaN(progress) ? 0 : progress; // Hindari NaN sebelum durasi dimuat
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    });

    // Update total durasi setelah metadata dimuat
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
    });

    // Seek lagu saat progress bar digeser
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Otomatis putar lagu berikutnya saat lagu selesai
    audioPlayer.addEventListener('ended', () => {
        playNextSong();
    });

    // Toggle tampilan playlist sidebar
    togglePlaylistBtn.addEventListener('click', () => {
        playlistSidebar.classList.toggle('visible');
    });

    // === Inisialisasi Aplikasi ===
    loadSong(currentSongIndex); // Muat lagu pertama saat aplikasi dimulai
    renderPlaylist(); // Render daftar putar
});
