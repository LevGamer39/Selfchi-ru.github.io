// Обработка формы обратной связи
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
            this.initValidation();
            this.initAutosave();
        }
    }

    // Привязка событий
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Очистка ошибок при вводе
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearError(input);
                this.saveToLocalStorage();
            });
        });

        // Загрузка сохраненных данных
        this.loadFromLocalStorage();
    }

    // Инициализация валидации
    initValidation() {
        // Добавляем правила валидации для полей
        this.rules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/
            },
            email: {
                required: true,
                email: true
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 100
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000
            },
            category: {
                required: true
            }
        };
    }

    // Автосохранение в LocalStorage
    initAutosave() {
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);
    }

    // Сохранение в LocalStorage
    saveToLocalStorage() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData) {
            data[key] = value;
        }
        
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }

    // Загрузка из LocalStorage
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
            
            this.showAutosaveNotification();
        }
    }

    // Обработка отправки формы
    handleSubmit() {
        if (this.validateForm()) {
            this.sendForm();
        }
    }

    // Валидация формы
    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);

        for (let [name, value] of formData) {
            const field = this.form.querySelector(`[name="${name}"]`);
            const rules = this.rules[name];

            if (rules) {
                const error = this.validateField(value, rules, field);
                if (error) {
                    this.showError(field, error);
                    isValid = false;
                } else {
                    this.clearError(field);
                }
            }
        }

        return isValid;
    }

    // Валидация поля
    validateField(value, rules, field) {
        if (rules.required && !value.trim()) {
            return 'Это поле обязательно для заполнения';
        }

        if (rules.minLength && value.length < rules.minLength) {
            return `Минимальная длина: ${rules.minLength} символов`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return `Максимальная длина: ${rules.maxLength} символов`;
        }

        if (rules.email && !this.isValidEmail(value)) {
            return 'Введите корректный email адрес';
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            return 'Недопустимые символы в поле';
        }

        return null;
    }

    // Проверка email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Показать ошибку
    showError(field, message) {
        this.clearError(field);

        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        `;

        field.parentNode.appendChild(errorElement);

        // Анимация ошибки
        field.style.animation = 'fieldError 0.3s ease';
        setTimeout(() => {
            field.style.animation = '';
        }, 300);
    }

    // Очистить ошибку
    clearError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Отправка формы
    async sendForm() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        try {
            // Показываем индикатор загрузки
            submitBtn.innerHTML = `
                <span class="btn-glow"></span>
                <span class="loading-spinner"></span>
                Отправка...
            `;
            submitBtn.disabled = true;

            // Имитация отправки (в реальном проекте замените на реальный endpoint)
            await this.simulateApiCall(formData);

            this.showSuccessMessage();
            this.form.reset();
            localStorage.removeItem('contactFormData'); // Очищаем сохраненные данные

        } catch (error) {
            this.showErrorMessage('Ошибка при отправке сообщения. Попробуйте еще раз.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Имитация API вызова
    simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // В реальном приложении здесь был бы fetch/axios запрос
                // Например:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     body: formData
                // })
                
                if (Math.random() > 0.1) { // 90% успеха для демо
                    resolve({
                        success: true,
                        message: 'Сообщение успешно отправлено'
                    });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    // Показать сообщение об успехе
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="success-content">
                <div class="success-icon">🚀</div>
                <h3>Сообщение отправлено в космос!</h3>
                <p>Спасибо за ваше сообщение. Я свяжусь с вами в ближайшее время.</p>
                <div class="success-details">
                    <p><strong>Ожидайте ответ в течение 24 часов</strong></p>
                    <p>Пока ждете, можете посмотреть мои проекты или послушать музыку!</p>
                </div>
                <div class="success-actions">
                    <button class="cosmic-btn success-close">Понятно</button>
                    <a href="portfolio.html" class="cosmic-btn">Смотреть проекты</a>
                </div>
            </div>
        `;

        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(5, 5, 16, 0.95);
            backdrop-filter: blur(20px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: modalFadeIn 0.5s ease;
        `;

        const successContent = successMessage.querySelector('.success-content');
        successContent.style.cssText = `
            background: var(--cosmic-card);
            border: 2px solid var(--cosmic-accent);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            width: 90%;
            animation: modalSlideIn 0.5s ease;
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
        `;

        successContent.querySelector('.success-icon').style.cssText = `
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: bounce 1s ease infinite;
        `;

        successContent.querySelector('h3').style.cssText = `
            color: var(--cosmic-accent);
            margin-bottom: 1rem;
            font-family: 'Orbitron', sans-serif;
        `;

        successContent.querySelector('.success-details').style.cssText = `
            margin: 1.5rem 0;
            padding: 1rem;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 12px;
            border: 1px solid var(--cosmic-border);
        `;

        successContent.querySelector('.success-actions').style.cssText = `
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        `;

        // Обработчики закрытия
        successContent.querySelector('.success-close').addEventListener('click', () => {
            successMessage.remove();
        });

        // Закрытие по клику на оверлей
        successMessage.addEventListener('click', (e) => {
            if (e.target === successMessage) {
                successMessage.remove();
            }
        });

        document.body.appendChild(successMessage);

        // Автоматическое закрытие через 10 секунд
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 10000);
    }

    // Показать сообщение об ошибке
    showErrorMessage(message) {
        const errorNotification = document.createElement('div');
        errorNotification.className = 'error-notification';
        errorNotification.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <div class="error-text">
                    <strong>Ошибка отправки</strong>
                    <p>${message}</p>
                </div>
                <button class="error-close">&times;</button>
            </div>
        `;

        errorNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 12px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
        `;

        errorNotification.querySelector('.error-close').addEventListener('click', () => {
            errorNotification.remove();
        });

        document.body.appendChild(errorNotification);

        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.remove();
            }
        }, 5000);
    }

    // Уведомление об автосохранении
    showAutosaveNotification() {
        const notification = document.createElement('div');
        notification.textContent = '✓ Данные восстановлены из автосохранения';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--cosmic-neon);
            color: var(--cosmic-dark);
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 3s ease;
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Дополнительные стили для формы
const contactFormStyles = document.createElement('style');
contactFormStyles.textContent = `
    .cosmic-form {
        max-width: 600px;
        margin: 0 auto;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .cosmic-form label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--cosmic-text);
        font-weight: 600;
        font-size: 0.9rem;
    }

    .cosmic-form input,
    .cosmic-form textarea,
    .cosmic-form select {
        width: 100%;
        padding: 1rem 1.2rem;
        background: rgba(16, 16, 32, 0.6);
        border: 2px solid var(--cosmic-border);
        border-radius: 12px;
        color: var(--cosmic-text);
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .cosmic-form input:focus,
    .cosmic-form textarea:focus,
    .cosmic-form select:focus {
        outline: none;
        border-color: var(--cosmic-accent);
        box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
        background: rgba(16, 16, 32, 0.8);
    }

    .cosmic-form input.error,
    .cosmic-form textarea.error,
    .cosmic-form select.error {
        border-color: #ff6b6b;
        box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
    }

    .cosmic-form textarea {
        resize: vertical;
        min-height: 120px;
        line-height: 1.5;
    }

    .cosmic-form select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2300d4ff' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1.2rem center;
        background-size: 12px;
    }

    .submit-btn {
        width: 100%;
        margin-top: 1rem;
        position: relative;
        overflow: hidden;
    }

    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }

    @keyframes fieldError {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes modalSlideIn {
        from { 
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(100%);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Адаптивность формы */
    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .cosmic-form input,
        .cosmic-form textarea,
        .cosmic-form select {
            padding: 0.8rem 1rem;
        }
        
        .success-actions {
            flex-direction: column;
        }
        
        .success-actions .cosmic-btn {
            width: 100%;
            text-align: center;
        }
    }

    /* Стили для успешного состояния полей */
    .cosmic-form input:valid:not(:focus),
    .cosmic-form textarea:valid:not(:focus),
    .cosmic-form select:valid:not(:focus) {
        border-color: var(--cosmic-neon);
        background: rgba(0, 255, 136, 0.05);
    }

    /* Анимация при валидности поля */
    .cosmic-form input:valid:not(:focus)::after,
    .cosmic-form textarea:valid:not(:focus)::after {
        content: '✓';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--cosmic-neon);
        font-weight: bold;
    }
`;
document.head.appendChild(contactFormStyles);

// Инициализация формы при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = new ContactForm();
    
    // Добавление глобальных методов для тестирования
    window.contactForm = contactForm;
});