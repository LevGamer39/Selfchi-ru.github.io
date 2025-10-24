// Portfolio Filtering
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setActiveFilter(button);
                this.filterProjects(button.dataset.filter);
            });
        });
    }

    setActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
        this.activeFilter = activeButton.dataset.filter;
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Показ количества отфильтрованных проектов
        this.updateProjectCount(filter);
    }

    updateProjectCount(filter) {
        const visibleProjects = Array.from(this.projectCards).filter(card => {
            const categories = card.dataset.category.split(' ');
            return filter === 'all' || categories.includes(filter);
        }).length;

        // Можно добавить отображение счетчика, если нужно
        console.log(`Показано проектов: ${visibleProjects}`);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const portfolioFilter = new PortfolioFilter();
    
    // Добавляем анимацию появления проектов
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
