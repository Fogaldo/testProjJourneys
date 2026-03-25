// проверка подключения скрипта
console.log('✅ Скрипт script.js загружен!');
console.log('📍 Текущая страница:', window.location.href);

// КОНФИГУРАЦИЯ
const API_URL = 'http://localhost:3000/api';

let currentPage = 1;           // текущая страница
let totalPages = 0;            // всего страниц
let isLoading = false;         // флаг загрузки (чтобы не отправлять несколько запросов)

// ЗАГРУЗКА СТАТЕЙ С СЕРВЕРА
async function loadArticles(page = 1) {
    console.log(`📡 Загружаем страницу ${page}...`);
    
    try {
        const response = await fetch(`${API_URL}/articles?page=${page}&limit=2`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Ответ от сервера:', data);
        
        // Сохраняем информацию о пагинации
        currentPage = data.page;
        totalPages = data.totalPages;
        
        console.log(`✅ Загружено статей: ${data.articles.length} из ${data.total}`);
        console.log(`📄 Страница ${currentPage} из ${totalPages}`);
        
        return data;
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error.message);
        console.log('💡 Проверь:');
        console.log('   1. Запущен ли сервер? (cd travel-blog-backend && node server.js)');
        console.log('   2. Правильный ли порт? (3000)');
        return { articles: [], total: 0, page: 1, totalPages: 0 };
    }
}

// СОЗДАНИЕ HTML СТАТЬИ
function createArticleHTML(article) {
    // Преобразуем дату из 2026-03-12 в 12.03.2026
    const dateParts = article.date.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    
    return `
        <article>
            <h2>${escapeHtml(article.title)}</h2>
            <div class="article-meta">
                <time datetime="${escapeHtml(article.date)}">${escapeHtml(formattedDate)}</time>
                <span class="views-count" data-article-id="${escapeHtml(String(article.id))}">👁️ ${escapeHtml(String(article.views))} просмотров</span>
            </div>
            <p>${escapeHtml(article.preview)}</p>
            <a href="#" class="read-more">Читать дальше</a>
        </article>
    `;
}

// ОТОБРАЖЕНИЕ СТАТЕЙ НА СТРАНИЦЕ
function displayArticles(articles, append = false) {
    console.log(`🎨 Отображаем ${articles.length} статей (append: ${append})...`);
    
    const mainElement = document.querySelector('main');
    
    if (!mainElement) {
        console.error('❌ Элемент <main> не найден!');
        return;
    }
    
    const buttonContainer = document.querySelector('.load-more-container');
    
    // Если это не добавление (append = false) — очищаем main, но сохраняем кнопку
    if (!append) {
        while (mainElement.firstChild) {
            if (mainElement.firstChild === buttonContainer) {
                break;
            }
            mainElement.removeChild(mainElement.firstChild);
        }
    }
    
    // Добавляем каждую статью
    articles.forEach(article => {
        const articleHTML = createArticleHTML(article);
        
        if (buttonContainer) {
            // Вставляем HTML в конец main
            mainElement.insertAdjacentHTML('beforeend', articleHTML);
            // Перемещаем последнюю добавленную статью перед кнопкой
            const lastArticle = mainElement.querySelector('article:last-of-type');
            if (lastArticle && buttonContainer) {
                mainElement.insertBefore(lastArticle, buttonContainer);
            }
        } else {
            mainElement.insertAdjacentHTML('beforeend', articleHTML);
        }
    });
    
    // Убеждаемся, что кнопка на месте (если она существует)
    if (buttonContainer && !mainElement.contains(buttonContainer)) {
        mainElement.appendChild(buttonContainer);
    }
    
    const totalArticles = mainElement.querySelectorAll('article').length;
    console.log(`✅ Теперь на странице статей: ${totalArticles}`);
}

// ЗАЩИТА ОТ XSS (безопасный вывод)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// УВЕЛИЧЕНИЕ ПРОСМОТРОВ
async function incrementViews(articleId) {
    console.log(`📈 Увеличиваем просмотры для статьи ${articleId}...`);
    
    try {
        const response = await fetch(`${API_URL}/articles/${articleId}/views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Новое количество просмотров: ${data.views}`);
        return data.views;
    } catch (error) {
        console.error(`❌ Ошибка увеличения просмотров: ${error.message}`);
        return null;
    }
}

// НАВЕШИВАНИЕ ОБРАБОТЧИКОВ
function setupClickHandlers() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    console.log(`🔗 Найдено ссылок: ${readMoreLinks.length}`);
    
    readMoreLinks.forEach(link => {
        // Убираем старые обработчики (создаем копию без обработчиков)
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const article = newLink.closest('article');
            const viewsSpan = article.querySelector('.views-count');
            const articleId = viewsSpan.getAttribute('data-article-id');
            
            const newViews = await incrementViews(articleId);
            
            if (newViews !== null) {
                viewsSpan.textContent = `👁️ ${newViews} просмотров`;
            }
        });
    });
    
    console.log('✅ Обработчики навешаны');
}

// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ (безопасный вывод)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ИНИЦИАЛИЗАЦИЯ
async function init() {
    console.log('🚀 Инициализация блога...');
    
    const data = await loadArticles(1);
    
    if (data.articles.length > 0) {
        // Отображаем первые статьи (append = false — очищаем и показываем новые)
        displayArticles(data.articles, false);
        setupClickHandlers();
        
        // Настраиваем кнопку "Показать еще"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (currentPage >= totalPages) {
                loadMoreBtn.style.display = 'none';
                console.log('🔘 Кнопка скрыта (все статьи загружены)');
            } else {
                loadMoreBtn.style.display = 'inline-block';
                console.log(`🔘 Кнопка видима (страница ${currentPage} из ${totalPages})`);
            }
        }
    } else {
        console.error('❌ Не удалось загрузить статьи');
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = `
                <p style="color: red; text-align: center; padding: 50px;">
                    ❌ Ошибка загрузки статей.<br>
                    Убедитесь, что сервер запущен: <code>node server.js</code>
                </p>
            `;
        }
    }
}

// КНОПКА "ПОКАЗАТЬ ЕЩЕ"
const loadMoreBtn = document.getElementById('loadMoreBtn');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async () => {
        // Защита от множественных кликов
        if (isLoading) {
            console.log('⏳ Уже загружается, подождите...');
            return;
        }
        
        isLoading = true;
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Загрузка...';
        
        try {
            const nextPage = currentPage + 1;
            
            if (nextPage <= totalPages) {
                console.log(`📡 Загружаем страницу ${nextPage}...`);
                const data = await loadArticles(nextPage);
                
                if (data.articles.length > 0) {
                    // append = true — добавляем к существующим статьям
                    displayArticles(data.articles, true);
                    setupClickHandlers();  // навешиваем обработчики на новые статьи
                    
                    // Обновляем состояние кнопки
                    if (currentPage >= totalPages) {
                        loadMoreBtn.style.display = 'none';
                        console.log('🔘 Кнопка скрыта (все статьи загружены)');
                    }
                }
            } else {
                loadMoreBtn.style.display = 'none';
                console.log('🔘 Кнопка скрыта (больше нет статей)');
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
        } finally {
            isLoading = false;
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Показать еще статьи';
        }
    });
}

// ЗАПУСК
init();