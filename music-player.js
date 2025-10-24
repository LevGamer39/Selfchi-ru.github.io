// Продвинутый музыкальный плеер и интерактивная гитара
class CosmicMusicPlayer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.visualizer = null;
        this.guitarStrings = [];
        this.init();
    }

    init() {
        this.initAudioContext();
        this.initGuitar();
        this.initVisualizer();
        this.bindEvents();
        this.preloadAudio();
    }

    // Инициализация Audio Context
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
        } catch (e) {
            console.warn('Web Audio API не поддерживается:', e);
        }
    }

    // Инициализация интерактивной гитары
    initGuitar() {
        this.guitarStrings = Array.from(document.querySelectorAll('.guitar-string'));
        
        this.guitarStrings.forEach(string => {
            const stringLine = string.querySelector('.string-line');
            const frets = string.querySelectorAll('.fret');
            
            // Анимация струны при наведении
            stringLine.addEventListener('mouseenter', () => {
                stringLine.style.transform = 'scaleY(1.5)';
                stringLine.style.background = 'var(--cosmic-neon)';
                this.playStringSound(string.dataset.frequency);
            });
            
            stringLine.addEventListener('mouseleave', () => {
                stringLine.style.transform = 'scaleY(1)';
                stringLine.style.background = 'linear-gradient(90deg, transparent, #e2e8f0, transparent)';
            });
            
            // Клик по ладам
            frets.forEach(fret => {
                fret.addEventListener('click', () => {
                    const fretNumber = parseInt(fret.dataset.fret);
                    const baseFrequency = parseFloat(string.dataset.frequency);
                    const noteFrequency = this.calculateFretFrequency(baseFrequency, fretNumber);
                    
                    this.playStringSound(noteFrequency);
                    this.createFretEffect(fret);
                });
            });
        });
    }

    // Расчет частоты ноты на ладу
    calculateFretFrequency(baseFrequency, fret) {
        return baseFrequency * Math.pow(2, fret / 12);
    }

    // Воспроизведение звука струны
    playStringSound(frequency) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Плавное нарастание и затухание
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
        
        // Визуальный эффект
        this.createStringWaveEffect(frequency);
    }

    // Создание визуального эффекта волны на струне
    createStringWaveEffect(frequency) {
        const stringLines = document.querySelectorAll('.string-line');
        stringLines.forEach(line => {
            line.style.animation = 'none';
            setTimeout(() => {
                line.style.animation = `stringWave ${1/frequency * 1000}ms infinite linear`;
            }, 10);
        });
    }

    // Эффект при нажатии на лад
    createFretEffect(fret) {
        fret.style.background = 'var(--cosmic-neon)';
        fret.style.boxShadow = '0 0 20px var(--cosmic-neon)';
        
        setTimeout(() => {
            fret.style.background = '#cbd5e0';
            fret.style.boxShadow = 'none';
        }, 300);
    }

    // Инициализация визуализатора
    initVisualizer() {
        const canvas = document.getElementById('audioVisualizer');
        if (!canvas) return;
        
        this.visualizer = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        this.drawVisualizer();
    }

    // Отрисовка визуализатора
    drawVisualizer() {
        if (!this.analyser || !this.visualizer) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = this.visualizer.canvas;
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            this.visualizer.fillStyle = 'var(--cosmic-dark)';
            this.visualizer.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                
                const gradient = this.visualizer.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, 'var(--cosmic-accent)');
                gradient.addColorStop(1, 'var(--cosmic-neon)');
                
                this.visualizer.fillStyle = gradient;
                this.visualizer.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    // Предзагрузка аудио
    preloadAudio() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.addEventListener('canplaythrough', () => {
                console.log(`Аудио ${audio.src} готово к воспроизведению`);
            });
        });
    }

    // Воспроизведение случайной мелодии
    playRandomMelody() {
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
        let currentTime = this.audioContext.currentTime;
        
        for (let i = 0; i < 16; i++) {
            const noteIndex = Math.floor(Math.random() * notes.length);
            const frequency = notes[noteIndex] * (Math.random() > 0.5 ? 2 : 1);
            
            setTimeout(() => {
                this.playStringSound(frequency);
            }, i * 200);
        }
    }

    // Воспроизведение аккорда
    playChord() {
        const chords = {
            'E_minor': [82.41, 110.00, 146.83, 196.00, 246.94, 329.63],
            'A_major': [110.00, 146.83, 174.61, 220.00, 277.18, 329.63],
            'C_major': [130.81, 164.81, 196.00, 261.63, 329.63, 392.00]
        };
        
        const chordNames = Object.keys(chords);
        const randomChord = chordNames[Math.floor(Math.random() * chordNames.length)];
        const frequencies = chords[randomChord];
        
        frequencies.forEach(freq => {
            this.playStringSound(freq);
        });
        
        this.showChordName(randomChord);
    }

    // Показать название аккорда
    showChordName(chordName) {
        const notification = document.createElement('div');
        notification.textContent = `Аккорд: ${chordName}`;
        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--cosmic-card);
            color: var(--cosmic-neon);
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid var(--cosmic-border);
            z-index: 1000;
            font-family: 'Orbitron', sans-serif;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.querySelector('.guitar-controls').appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    // Привязка событий
    bindEvents() {
        // Кнопка воспроизведения аккорда
        const playChordBtn = document.getElementById('playChord');
        if (playChordBtn) {
            playChordBtn.addEventListener('click', () => {
                this.playChord();
            });
        }
        
        // Кнопка случайной мелодии
        const randomMelodyBtn = document.getElementById('randomMelody');
        if (randomMelodyBtn) {
            randomMelodyBtn.addEventListener('click', () => {
                this.playRandomMelody();
            });
        }
        
        // Слайдер громкости
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
        
        // Глобальное управление аудио
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'AUDIO') {
                this.handleAudioPlay(e.target);
            }
        });
    }

    // Установка громкости
    setVolume(volume) {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.volume = volume;
        });
    }

    // Обработка воспроизведения аудио
    handleAudioPlay(audioElement) {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Подключение к визуализатору
        if (this.analyser) {
            const source = this.audioContext.createMediaElementSource(audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }
    }
}

// Стили для анимаций гитары
const guitarStyles = document.createElement('style');
guitarStyles.textContent = `
    @keyframes stringWave {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.8); }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -60%); }
        50% { opacity: 1; transform: translate(-50%, -50%); }
    }
    
    .string-line {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(guitarStyles);

// Инициализация музыкального плеера
document.addEventListener('DOMContentLoaded', function() {
    const musicPlayer = new CosmicMusicPlayer();
    
    // Добавление глобальных методов
    window.musicPlayer = musicPlayer;
});