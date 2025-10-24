// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация аудио плееров
    initAudioPlayers();
    
    // Инициализация космических эффектов
    initCosmicEffects();
});

// Управление темой
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Установка сохраненной темы
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggle(newTheme);
            
            // Анимация переключения
            createThemeTransition();
        });
    }
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function createThemeTransition() {
    const transition = document.createElement('div');
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--cosmic-accent);
        opacity: 0;
        z-index: 9999;
        pointer-events: none;
        animation: themeFade 0.6s ease-in-out;
    `;
    
    document.body.appendChild(transition);
    
    setTimeout(() => {
        transition.remove();
    }, 600);
}

// Навигация
function initNavigation() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Активное состояние навигации при скролле
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Анимации
function initAnimations() {
    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out ${entry.target.dataset.delay || '0s'} both`;
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });
    
    // Анимируем элементы с задержкой
    document.querySelectorAll('.project-card, .essay-card, .contact-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.dataset.delay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Аудио плееры
function initAudioPlayers() {
    const audioManager = {
        currentPlaying: null,
        
        playAudio(audioElement) {
            // Если уже что-то играет, останавливаем
            if (this.currentPlaying && this.currentPlaying !== audioElement) {
                this.currentPlaying.pause();
                this.currentPlaying.currentTime = 0;
            }
            
            this.currentPlaying = audioElement;
        }
    };
    
    const audioPlayers = document.querySelectorAll('audio');
    audioPlayers.forEach(audio => {
        audio.controls = true;
        audio.preload = 'metadata';
        
        // Добавляем обработчик для управления воспроизведением
        audio.addEventListener('play', function() {
            audioManager.playAudio(this);
        });
        
        // Добавляем обработчик окончания трека
        audio.addEventListener('ended', function() {
            audioManager.currentPlaying = null;
        });
        
        // Стилизация аудио элементов
        audio.style.borderRadius = '8px';
        audio.style.background = 'var(--cosmic-card)';
    });
}

// Космические эффекты
function initCosmicEffects() {
    createFloatingParticles();
    initParallaxEffect();
}

// Парящие частицы
function createFloatingParticles() {
    const particlesContainer = document.getElementById('cosmic-background');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Параллакс эффект
function initParallaxEffect() {
    const cosmicBg = document.getElementById('cosmic-background');
    if (!cosmicBg) return;
    
    window.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        cosmicBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#ff6b6b' : 
                   type === 'success' ? '#51cf66' : 
                   'var(--cosmic-accent)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Анимации CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes themeFade {
        0% { opacity: 0; }
        50% { opacity: 0.1; }
        100% { opacity: 0; }
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Вспомогательные функции
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспорт функций для использования в других файлах

window.showNotification = showNotification;
// Мобильная навигация (скрытие при скролле)
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Установка сохраненной темы
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggle(newTheme);
            
            // Анимация переключения
            createThemeTransition();
            
            // Принудительное обновление стилей навигации
            updateNavStyles(newTheme);
        });
    }
}

// Функция для обновления стилей навигации при смене темы
function updateNavStyles(theme) {
    const nav = document.querySelector('.cosmic-nav');
    if (!nav) return;
    
    // Небольшая задержка для применения CSS переменных
    setTimeout(() => {
        if (theme === 'light') {
            nav.style.background = 'rgba(240, 244, 248, 0.95)';
            nav.style.borderBottom = '1px solid rgba(100, 116, 139, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 26, 0.95)';
            nav.style.borderBottom = '1px solid var(--cosmic-border)';
        }
    }, 10);
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему');
    }
}

