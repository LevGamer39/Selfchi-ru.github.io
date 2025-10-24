// Менеджер портфолио с фильтрацией и анимациями
class PortfolioManager {
    constructor() {
        this.projects = [];
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.collectProjects();
        this.initFilters();
        this.initProjectModals();
        this.initLazyLoading();
        this.initSorting();
    }

    // Сбор информации о проектах
    collectProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            const project = {
                element: card,
                categories: card.dataset.category.split(' '),
                title: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                priority: parseInt(card.dataset.priority) || index,
                featured: card.classList.contains('featured')
            };
            
            this.projects.push(project);
        });
    }

    // Инициализация фильтров
    initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Обновление активной кнопки
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Применение фильтра
                this.activeFilter = button.dataset.filter;
                this.applyFilter();
                
                // Анимация перехода
                this.animateFilterTransition();
            });
        });
    }

    // Применение фильтра
    applyFilter() {
        this.projects.forEach(project => {
            const shouldShow = this.activeFilter === 'all' || 
                             project.categories.includes(this.activeFilter);
            
            if (shouldShow) {
                project.element.style.display = 'block';
                setTimeout(() => {
                    project.element.style.opacity = '1';
                    project.element.style.transform = 'translateY(0)';
                }, 100);
            } else {
                project.element.style.opacity = '0';
                project.element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.element.style.display = 'none';
                }, 300);
            }
        });
        
        // Показ количества отфильтрованных проектов
        this.updateProjectCount();
    }

    // Анимация перехода фильтра
    animateFilterTransition() {
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.style.animation = 'none';
        
        setTimeout(() => {
            projectsGrid.style.animation = 'filterTransition 0.5s ease-out';
        }, 10);
    }

    // Обновление счетчика проектов
    updateProjectCount() {
        const visibleProjects = this.projects.filter(project => {
            return this.activeFilter === 'all' || 
                   project.categories.includes(this.activeFilter);
        }).length;
        
        const countElement = document.querySelector('.project-count');
        if (countElement) {
            countElement.textContent = `${visibleProjects} проектов`;
        }
    }

    // Инициализация модальных окон проектов
    initProjectModals() {
        const projectButtons = document.querySelectorAll('.project-btn');
        
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = button.dataset.project;
                this.openProjectModal(projectId);
            });
        });
        
        // Закрытие модального окна
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeProjectModal();
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
            }
        });
    }

    // Открытие модального окна проекта
    openProjectModal(projectId) {
        const project = this.getProjectData(projectId);
        if (!project) return;
        
        const modal = this.createModal(project);
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Блокировка прокрутки
        document.body.style.overflow = 'hidden';
    }

    // Получение данных проекта
    getProjectData(projectId) {
        const projectData = {
            'telegram': {
                title: 'Telegram боты',
                description: 'Разработка многофункциональных чат-ботов на Python',
                longDescription: 'Создание интеллектуальных чат-ботов с использованием современных библиотек и API. Боты включают функционал обработки естественного языка, интеграцию с внешними сервисами и базами данных.',
                technologies: ['Python', 'Aiogram', 'SQLite', 'Telegram API'],
                features: ['Модульная архитектура', 'Webhook интеграция', 'Административная панель', 'Мультиязычность'],
                demoUrl: '#',
                codeUrl: 'https://github.com/polysock/telegram-bots',
                images: ['images/project-telegram-1.jpg', 'images/project-telegram-2.jpg'],
                status: 'Завершен'
            },
            'unity': {
                title: 'Игры на Unity',
                description: 'Разработка игровых проектов на C#',
                longDescription: 'Создание 2D и 3D игр с использованием Unity Engine. Проекты включают проработанную механику, оптимизированную графику и адаптивный геймдизайн.',
                technologies: ['C#', 'Unity', 'OOP', 'Game Design'],
                features: ['Физика движка', 'Искусственный интеллект', 'Система частиц', 'Оптимизация'],
                demoUrl: '#',
                codeUrl: 'https://github.com/polysock/unity-games',
                images: ['images/project-unity-1.jpg', 'images/project-unity-2.jpg'],
                status: 'В разработке'
            },
            'demo': {
                title: 'Космическая демка #5',
                description: 'Инструментальная композиция в стиле прогрессивного рока',
                longDescription: 'Собственная инструментальная композиция, сочетающая элементы прогрессивного рока, математического рока и атмосферных электронных текстур.',
                technologies: ['Электрогитара', 'DAW', 'MIDI', 'Аудио обработка'],
                features: ['Сложные ритмы', 'Полифония', 'Динамические переходы', 'Экспериментальные звуки'],
                demoUrl: 'audio/last-demo.mp3',
                downloadUrl: 'audio/last-demo.mp3',
                duration: '3:45',
                bpm: 140,
                key: 'E минор'
            }
        };
        
        return projectData[projectId];
    }

    // Создание модального окна
    createModal(project) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <span class="project-status">${project.status || 'Активный'}</span>
                </div>
                
                <div class="modal-body">
                    <div class="project-gallery">
                        ${project.images ? project.images.map(img => 
                            `<img src="${img}" alt="${project.title}" onerror="this.style.display='none'">`
                        ).join('') : ''}
                    </div>
                    
                    <div class="project-details">
                        <div class="description-section">
                            <h3>Описание</h3>
                            <p>${project.longDescription}</p>
                        </div>
                        
                        <div class="tech-section">
                            <h3>Технологии</h3>
                            <div class="tech-tags">
                                ${project.technologies.map(tech => 
                                    `<span class="tech-tag">${tech}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        ${project.features ? `
                        <div class="features-section">
                            <h3>Особенности</h3>
                            <ul>
                                ${project.features.map(feature => 
                                    `<li>${feature}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        
                        ${project.duration ? `
                        <div class="music-info">
                            <h3>Музыкальная информация</h3>
                            <div class="music-details">
                                <div class="detail-item">
                                    <span>Длительность:</span>
                                    <span>${project.duration}</span>
                                </div>
                                <div class="detail-item">
                                    <span>Темп:</span>
                                    <span>${project.bpm} BPM</span>
                                </div>
                                <div class="detail-item">
                                    <span>Тональность:</span>
                                    <span>${project.key}</span>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="modal-footer">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="cosmic-btn" target="_blank">Демо</a>` : ''}
                    ${project.codeUrl ? `<a href="${project.codeUrl}" class="cosmic-btn" target="_blank">Исходный код</a>` : ''}
                    ${project.downloadUrl ? `<a href="${project.downloadUrl}" class="cosmic-btn" download>Скачать</a>` : ''}
                    ${project.listenUrl ? `<a href="${project.listenUrl}" class="cosmic-btn" target="_blank">Слушать</a>` : ''}
                </div>
            </div>
        `;
        
        // Обработчик закрытия
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeProjectModal();
        });
        
        return modal;
    }

    // Закрытие модального окна
    closeProjectModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Ленивая загрузка изображений
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('.project-image img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    // Сортировка проектов
    initSorting() {
        const sortSelect = document.querySelector('.project-sort');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', (e) => {
            this.sortProjects(e.target.value);
        });
    }

    // Сортировка проектов по выбранному критерию
    sortProjects(criteria) {
        const projectsGrid = document.querySelector('.projects-grid');
        const projects = Array.from(projectsGrid.children);
        
        projects.sort((a, b) => {
            switch (criteria) {
                case 'date':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'name':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'priority':
                    return (parseInt(b.dataset.priority) || 0) - (parseInt(a.dataset.priority) || 0);
                default:
                    return 0;
            }
        });
        
        // Перестановка элементов
        projects.forEach(project => {
            projectsGrid.appendChild(project);
        });
        
        // Анимация перестановки
        this.animateSortTransition();
    }

    // Анимация сортировки
    animateSortTransition() {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach((project, index) => {
            setTimeout(() => {
                project.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s both`;
            }, 10);
        });
    }
}

// Стили для модальных окон и анимаций
const portfolioStyles = document.createElement('style');
portfolioStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 5, 16, 0.9);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-overlay.active {
        opacity: 1;
    }
    
    .modal-content {
        background: var(--cosmic-card);
        border: 1px solid var(--cosmic-border);
        border-radius: 16px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .modal-overlay.active .modal-content {
        transform: scale(1);
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: var(--cosmic-text);
        font-size: 2rem;
        cursor: pointer;
        z-index: 1;
    }
    
    .modal-header {
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid var(--cosmic-border);
    }
    
    .modal-header h2 {
        margin: 0;
        color: var(--cosmic-accent);
    }
    
    .project-status {
        background: var(--cosmic-neon);
        color: var(--cosmic-dark);
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .modal-body {
        padding: 1rem 2rem;
    }
    
    .project-gallery {
        margin-bottom: 2rem;
    }
    
    .project-gallery img {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .description-section,
    .tech-section,
    .features-section,
    .music-info {
        margin-bottom: 2rem;
    }
    
    .description-section h3,
    .tech-section h3,
    .features-section h3,
    .music-info h3 {
        color: var(--cosmic-accent);
        margin-bottom: 1rem;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .features-section ul {
        list-style: none;
        padding: 0;
    }
    
    .features-section li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--cosmic-border);
        position: relative;
        padding-left: 1.5rem;
    }
    
    .features-section li::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: var(--cosmic-neon);
    }
    
    .music-details {
        display: grid;
        gap: 0.5rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--cosmic-border);
    }
    
    .modal-footer {
        padding: 1rem 2rem 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    @keyframes filterTransition {
        0% { opacity: 0.8; transform: scale(0.98); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .project-count {
        text-align: center;
        color: var(--cosmic-text-secondary);
        margin-top: 1rem;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(portfolioStyles);

// Инициализация менеджера портфолио
document.addEventListener('DOMContentLoaded', function() {
    const portfolioManager = new PortfolioManager();
});