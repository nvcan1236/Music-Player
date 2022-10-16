const $ =  document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOREGE_KEY = 'caMUSIC'

var audio = $('#audio');
var playBtn = $('.play-btn');
var nextBtn = $('.next-btn');
var prevBtn = $('.prev-btn');
var randomBtn = $('.random-btn');
var repeatBtn = $('.repeat-btn');
var progress = $('#progress');
var volumeControl = $('#volume-control');

const app = {
    songs: [
        {
            name: 'Angle Baby',
            singer: 'Troye Sivan',
            path: './/music//Angel Baby - Troye Sivan (NhacPro.net).mp3',
            image: './/image//ab.jpg'
        },
        {
            name: 'That\'s Hilarious',
            singer: 'Charlie Puth',
            path: './/music//That s Hilarious - Charlie Puth (NhacPro.net).mp3',
            image: './/image//that-is-hilarious.jpg'
        },
        {
            name: 'Peter Pan was right',
            singer: 'Anson Seabra',
            path: './/music//Peter Pan Was Right - Anson Seabra.mp3',
            image: './/image//peter-pan-was-right.jpg'
        },
        {
            name: 'Reckless',
            singer: 'Radison Beer',
            path: './/music//Reckless - Madison Beer.mp3',
            image: './/image//reckless.jpg'
        },
        {
            name: 'double take',
            singer: 'dhruv',
            path: './/music//Double Take - Dhruv.mp3',
            image: './/image//double-take.jpg'
        },
        {
            name: 'When I\'m Still Getting Over You',
            singer: 'Peder Elias, Paige',
            path: './/music//When I__m Still Getting Over You - Peder.mp3',
            image: './/image//whenim.jpg'
        },
        {
            name: 'Left and Right',
            singer: 'Charlie Puth, Jung Kook, BTS',
            path: './/music//Left And Right - Charlie Puth_ Jung Kook.mp3',
            image: './/image//lar.jpg'
        },
        {
            name: 'I Don\’t Think That I Like Her',
            singer: 'Charlie Puth',
            path: './/music//I Don’t Think That I Like Her.mp3',
            image: './/image//idont.jpg'
        },
        {
            name: 'Light Switch',
            singer: 'Charlie Puth',
            path: './/music//Light Switch - Charlie Puth.mp3',
            image: './/image//ls.jpg'
        },
        {
            name: 'The Joker And The Queen',
            singer: 'Ed Sheeran, Taylor Swift',
            path: './/music//TheJokerAndTheQueenFeatTaylorSwift-EdSheeran-7237621.mp3',
            image: './/image//thejoker.jpg'
        },
        {
            name: 'Save Your Tears',
            singer: 'The Weeknd, Ariana Grande',
            path: './/music//Save Your Tears Remix_ - The Weeknd_ Ari.mp3',
            image: './/image//save.jpg'
        },
    ],

    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentSongIndex: 0,
    defautVolume: 1,
    config: JSON.parse(localStorage.getItem(PLAYER_STOREGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOREGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentSongIndex = this.config.currentSongIndex;
        this.defautVolume = this.config.defautVolume;
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentSongIndex]
            }
        })
    },
    handleEvent: function() {
        
        var _this = this;
        
        // xử lí khi phát nhạc dừng nhạc
        const cdAnimation = $('.cd img').animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdAnimation.pause();
        // xử lí các trạng thái của audio
        audio.onplay = function() {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            if(!$('.dash-board').classList.contains('hor')) 
                cdAnimation.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
            cdAnimation.pause();
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                _this.setTime();
                var progressPercent = Math.floor(audio.currentTime*100 / audio.duration)
                progress.value = progressPercent;
                $('.curentProgress').style.width = progressPercent + '%';
            }
        }

        audio.onended = function() {
            if(_this.isRepeat ) {
                audio.load();
            }
            else if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
        }

        // xử lí khi kéo thanh input
        progress.oninput = function(e) {
            var progressPercent = e.target.value;
            audio.currentTime = progressPercent/100 * audio.duration;
            $('.curentProgress').style.width = progressPercent + '%';
        }

        // xuwr lis khi tang giam am luong
        volumeControl.oninput = function(e) {
            var volumeValue = this.value/100;
            _this.setVolume(volumeValue);
            _this.defautVolume = volumeValue;
            _this.setConfig('defautVolume', volumeValue);
        }


        // xử lí nút bấm 
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
        }
        
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('favourite', _this.isRepeat);
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);

            this.classList.toggle('favourite',  _this.isRandom);
        }

        // mở rộng danh sách bài hát
        $('.swipe-btn').onclick = function() {
            $('.dash-board').classList.add('hor')
            cdAnimation.cancel();
        }
        $('.back-btn').onclick = function() {
            $('.dash-board').classList.remove('hor')
            cdAnimation.play();
        }

      

        // trạng thái icon tim
        $('.heart-icon').onclick = function() {
            this.classList.toggle('favourite');
            this.classList.toggle('fa-regular');
            this.classList.toggle('fa-solid');
        }
        // click de phat tung bai hat
        $('.song-list').onclick = function(e) {
            song  = e.target.closest('.song-item:not(.current');
            optn = e.target.closest('.optn');
            if(song || optn) {
                if(song) {
                    _this.currentSongIndex = song.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                }
                if(optn) {
                    console.log("option");
                }
            }
        }
        
    },
      // set volume
    setVolume: function(value) {
        if(value == 0) {

        }else {
            audio.volume = value;
        }
    },
    loadCurrentSong: function() {
        var name = $('.dash-board .song-name');
        var singer = $('.dash-board .song-singer');
        var cd = $('.dash-board .cd img');
        
        this.setConfig('currentSongIndex', this.currentSongIndex);

        $('body').style = `
            background-image: url(${this.currentSong.image});
        `;
        name.innerText = this.currentSong.name;
        singer.innerText = this.currentSong.singer;
        cd.src = this.currentSong.image;
        audio.src = this.currentSong.path;
        audio.volume = this.defautVolume;
        volumeControl.value = this.defautVolume*100;

        console.log(this.defautVolume);

        var songItems = $$('.song-item');
        for (var s of songItems) {
            s.classList.remove('current');
        }
        songItems[this.currentSongIndex].classList.add('current');

        setTimeout(() => {
            $('.song-item.current').scrollIntoView({
                behavior : 'smooth',
                block : 'nearest'
            });
        }, 300);
    },
    setTime: function() {
        var minute = Math.floor(audio.currentTime / 60)<10? '0'+Math.floor(audio.currentTime / 60) : Math.floor(audio.currentTime / 60);
        var second = Math.floor(audio.currentTime % 60)<10? '0'+Math.floor(audio.currentTime % 60) : Math.floor(audio.currentTime % 60);

        var maxMinute = Math.floor(audio.duration / 60)<10? '0'+Math.floor(audio.duration / 60) : Math.floor(audio.duration / 60);
        var maxSecond = Math.floor(audio.duration % 60)<10? '0'+Math.floor(audio.duration % 60) : Math.floor(audio.duration % 60);

        $('.current').innerText = `${minute}:${second}`
        $('.duration').innerText = `${maxMinute}:${maxSecond}`;
    },
    render: function() {
        var htmls = this.songs.map((song, index) => {
            return `
                <li class="song-item" data-index=${index}>
                    <div class="song-thumb">
                        <img src="${song.image}" alt="song thumbnail">
                    </div>
                    <div class="song-infor">
                        <h3 class="song-name">${song.name}</h3>
                        <h4 class="song-singer">${song.singer}</h4>
                    </div>
                    <i class="fa-solid fa-ellipsis optn"></i>
                </li>
             `
        })
        $('.song-list').innerHTML = htmls.join('');
        
    },
    nextSong() {
        if(this.currentSongIndex == this.songs.length - 1)
            this.currentSongIndex = 0;
        else 
            this.currentSongIndex ++;

        this.loadCurrentSong();
        playBtn.classList.add('playing');
    },
    prevSong() {
        if(this.currentSongIndex == 0)
            this.currentSongIndex = this.songs.length - 1;
        else 
            this.currentSongIndex --;

        this.loadCurrentSong();
        playBtn.classList.add('playing');
    },
    playRandomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.currentSongIndex);
        this.currentSongIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        
        this.render();
        this.loadCurrentSong();

        this.handleEvent();

        repeatBtn.classList.toggle('favourite', this.isRepeat);
        randomBtn.classList.toggle('favourite', this.isRandom);

    }
}

app.start();
