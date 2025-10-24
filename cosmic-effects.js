// Космические эффекты и анимации
class CosmicEffects {
    constructor() {
        this.particles = [];
        this.meteors = [];
        this.init();
    }

    init() {
        this.createStars();
        this.createNebulas();
        this.createAsteroidField();
        this.initScrollEffects();
        this.initMouseEffects();
        this.initOrbitalAnimations();
    }

    // Создание звездного поля
    createStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;

        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            const animationDelay = Math.random() * 5;
            const animationDuration = Math.random() * 10 + 5;
            
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${opacity};
                animation: starTwinkle ${animationDuration}s infinite ${animationDelay}s;
                box-shadow: 0 0 ${size * 2}px white;
            `;
            
            starsContainer.appendChild(star);
        }
    }

    // Создание туманностей
    createNebulas() {
        const background = document.getElementById('cosmic-background');
        if (!background) return;

        const nebulaCount = 3;
        const colors = [
            'rgba(106, 90, 205, 0.1)',
            'rgba(72, 209, 204, 0.08)',
            'rgba(255, 107, 107, 0.05)'
        ];

        for (let i = 0; i < nebulaCount; i++) {
            const nebula = document.createElement('div');
            nebula.className = 'nebula';
            
            const width = Math.random() * 300 + 200;
            const height = Math.random() * 300 + 200;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const blur = Math.random() * 100 + 50;
            
            nebula.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}px;
                background: ${colors[i]};
                border-radius: 50%;
                left: ${left}%;
                top: ${top}%;
                filter: blur(${blur}px);
                animation: nebulaFloat ${Math.random() * 60 + 30}s infinite ease-in-out;
            `;
            
            background.appendChild(nebula);
        }
    }

    // Создание поля астероидов
    createAsteroidField() {
        const background = document.getElementById('cosmic-background');
        if (!background) return;

        const asteroidCount = 8;
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = 'asteroid';
            
            const size = Math.random() * 20 + 10;
            const rotation = Math.random() * 360;
            const animationDuration = Math.random() * 100 + 50;
            const animationDelay = Math.random() * 20;
            
            asteroid.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, #666, #999);
                border-radius: 20%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                transform: rotate(${rotation}deg);
                animation: asteroidFloat ${animationDuration}s linear infinite ${animationDelay}s;
                box-shadow: inset -5px -5px 10px rgba(0,0,0,0.5);
            `;
            
            background.appendChild(asteroid);
        }
    }

    // Эффекты при скролле
    initScrollEffects() {
        let ticking = false;
        
        const updateElements = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            // Анимация появления элементов
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    el.classList.add('active');
                }
            });
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateElements);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll);
        updateElements(); // Инициализация при загрузке
    }

    // Эффекты при движении мыши
    initMouseEffects() {
        document.addEventListener('mousemove', (e) => {
            this.createMouseTrail(e);
            this.updateParallax(e);
        });
        
        // Клик для создания волн
        document.addEventListener('click', (e) => {
            this.createRippleEffect(e);
        });
    }

    // След от мыши
    createMouseTrail(e) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--cosmic-accent);
            border-radius: 50%;
            pointer-events: none;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            z-index: 10000;
            animation: trailFade 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 600);
    }

    // Параллакс эффект для элементов
    updateParallax(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const parallaxElements = document.querySelectorAll('.mouse-parallax');
        parallaxElements.forEach(el => {
            const depth = el.dataset.depth || 0.1;
            const moveX = (mouseX - 0.5) * depth * 100;
            const moveY = (mouseY - 0.5) * depth * 100;
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Эффект ряби при клике
    createRippleEffect(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const size = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight);
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, var(--cosmic-accent) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            pointer-events: none;
            opacity: 0.3;
            animation: ripple 1s ease-out forwards;
            z-index: 9999;
        `;
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }

    // Орбитальные анимации для спутников - ИСПРАВЛЕННЫЙ МЕТОД
    initOrbitalAnimations() {
        const satellites = document.querySelectorAll('.satellite');
        
        satellites.forEach((satellite, index) => {
            // Убедимся, что спутники правильно позиционированы
            satellite.style.cssText += `
                position: absolute;
                top: 0;
                left: 0;
                width: 200px;
                animation: satellite-orbit 20s linear infinite;
                transform-origin: center;
            `;
            
            // Установим правильные задержки для спутников
            if (satellite.id === 'music-satellite') {
                satellite.style.animationDelay = '-10s';
            } else {
                satellite.style.animationDelay = '0s';
            }
            
            // Добавим обработчик для перезапуска анимации при необходимости
            satellite.addEventListener('animationiteration', () => {
                // Перезапускаем анимацию если есть проблемы
                if (!this.isAnimating(satellite)) {
                    satellite.style.animation = 'none';
                    setTimeout(() => {
                        satellite.style.animation = `satellite-orbit 20s linear infinite ${satellite.style.animationDelay}`;
                    }, 10);
                }
            });
        });
        
        // Добавим проверку анимации
        this.startAnimationMonitoring();
    }

    // Проверка работает ли анимация
    isAnimating(element) {
        const style = window.getComputedStyle(element);
        return style.animationName !== 'none' && style.animationPlayState === 'running';
    }

    // Мониторинг анимаций
    startAnimationMonitoring() {
        setInterval(() => {
            const satellites = document.querySelectorAll('.satellite');
            satellites.forEach(satellite => {
                if (!this.isAnimating(satellite)) {
                    console.log('Restarting animation for:', satellite.id);
                    satellite.style.animation = 'none';
                    setTimeout(() => {
                        if (satellite.id === 'music-satellite') {
                            satellite.style.animation = 'satellite-orbit 20s linear infinite -10s';
                        } else {
                            satellite.style.animation = 'satellite-orbit 20s linear infinite';
                        }
                    }, 10);
                }
            });
        }, 5000); // Проверяем каждые 5 секунд
    }

    // Создание кометы
    createComet() {
        const background = document.getElementById('cosmic-background');
        if (!background) return;

        const comet = document.createElement('div');
        comet.className = 'comet';
        
        comet.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 20px var(--cosmic-accent);
            top: ${Math.random() * 50}%;
            left: -100px;
            animation: cometFly 8s linear forwards;
            z-index: 1;
        `;
        
        background.appendChild(comet);
        
        setTimeout(() => {
            if (comet.parentNode) {
                comet.parentNode.removeChild(comet);
            }
        }, 8000);
    }

    // Запуск случайных космических событий
    startRandomEvents() {
        // Случайные кометы
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createComet();
            }
        }, 10000);
        
        // Случайные вспышки звезд
        setInterval(() => {
            this.createStarFlash();
        }, 3000);
    }

    // Создание вспышки звезды
    createStarFlash() {
        const stars = document.querySelectorAll('.star');
        if (stars.length === 0) return;
        
        const randomStar = stars[Math.floor(Math.random() * stars.length)];
        randomStar.style.animation = 'starFlash 0.5s ease-in-out';
        
        setTimeout(() => {
            randomStar.style.animation = '';
        }, 500);
    }

    // Метод для принудительного перезапуска орбитальных анимаций
    restartOrbitalAnimations() {
        const satellites = document.querySelectorAll('.satellite');
        satellites.forEach(satellite => {
            satellite.style.animation = 'none';
            setTimeout(() => {
                if (satellite.id === 'music-satellite') {
                    satellite.style.animation = 'satellite-orbit 20s linear infinite -10s';
                } else {
                    satellite.style.animation = 'satellite-orbit 20s linear infinite';
                }
            }, 50);
        });
    }
}

// Инициализация космических эффектов
document.addEventListener('DOMContentLoaded', function() {
    const cosmicEffects = new CosmicEffects();
    cosmicEffects.startRandomEvents();
    
    // Добавление CSS анимаций
    const cosmicStyles = document.createElement('style');
    cosmicStyles.textContent = `
        @keyframes starTwinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes starFlash {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; transform: scale(2); }
        }
        
        @keyframes nebulaFloat {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
            33% { transform: translate(20px, 10px) scale(1.1); opacity: 0.2; }
            66% { transform: translate(-10px, 15px) scale(0.9); opacity: 0.15; }
        }
        
        @keyframes asteroidFloat {
            0% { transform: translateX(-100px) rotate(0deg); }
            100% { transform: translateX(calc(100vw + 100px)) rotate(360deg); }
        }
        
        @keyframes trailFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
        
        @keyframes ripple {
            0% { transform: scale(0); opacity: 0.3; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes cometFly {
            0% { transform: translateX(0) translateY(0); opacity: 1; }
            100% { transform: translateX(calc(100vw + 200px)) translateY(200px); opacity: 0; }
        }
        
        /* Ключевые кадры для орбитальных анимаций спутников */
        @keyframes satellite-orbit {
            0% {
                transform: rotate(0deg) translateX(300px) rotate(0deg);
            }
            100% {
                transform: rotate(360deg) translateX(300px) rotate(-360deg);
            }
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .animate-on-scroll.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mouse-parallax {
            transition: transform 0.1s ease-out;
        }
        
        /* Медиа-запросы для мобильных устройств */
        @media (max-width: 768px) {
            @keyframes satellite-orbit {
                0% {
                    transform: rotate(0deg) translateX(150px) rotate(0deg);
                }
                100% {
                    transform: rotate(360deg) translateX(150px) rotate(-360deg);
                }
            }
        }
    `;
    document.head.appendChild(cosmicStyles);

    // Глобальная функция для перезапуска анимаций
    window.restartSatelliteAnimations = () => {
        cosmicEffects.restartOrbitalAnimations();
    };
});

// Дополнительная защита от застревания анимаций
window.addEventListener('load', function() {
    setTimeout(() => {
        if (typeof window.restartSatelliteAnimations === 'function') {
            window.restartSatelliteAnimations();
        }
    }, 1000);
});
