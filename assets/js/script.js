    const moreArticles = [
        {
            title: "Как найти дешевые билеты: секреты опытного путешественника",
            date: "2026-03-18",
            preview: "Делюсь проверенными способами экономить на перелетах без ущерба для комфорта. Личный опыт и полезные сервисы."
        },
        {
            title: "Что попробовать в Токио: гид по уличной еде",
            date: "2026-03-10",
            preview: "От такояки до окономияки — рассказываю, что обязательно нужно съесть в японской столице и где найти лучшие места."
        },
        {
            title: "5 ошибок, которые я совершил в первом solo-трипе",
            date: "2026-03-05",
            preview: "На чужих ошибках учатся, но я поделюсь своими, чтобы вы их не повторяли. Бюджет, безопасность, маршруты."
        }
    ];
    
    // Количество УЖЕ существующих статей в HTML
    const existingArticlesCount = 2;

    // Сколько новых статей уже загружено
    let loadedNewArticlesCount = 0;

    function createArticleElement(article, articleId) {
        const articleElement = document.createElement('article');
        const formattedDate = article.date.split('-').reverse().join('.');
        
        articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <div class="article-meta">
                <time datetime="${article.date}">${formattedDate}</time>
                <span class="views-count" data-article-id="${articleId}">👁️ 0 просмотров</span>
            </div>
            <p>${article.preview}</p>
            <a href="#" class="read-more" aria-label="Читать статью: ${article.title}">Читать дальше</a>`;
        
        return articleElement;
    }

        function getViews(articleId) {
        const views = localStorage.getItem(`article_views_${articleId}`);
        return views ? parseInt(views) : 0;
    }
    
    function incrementViews(articleId) {
        const currentViews = getViews(articleId);
        const newViews = currentViews + 1;
        localStorage.setItem(`article_views_${articleId}`, newViews);
        return newViews;
    }
    
    function updateAllViewCounters() {
        const allViewSpans = document.querySelectorAll('.views-count');
        allViewSpans.forEach(span => {
            const articleId = span.getAttribute('data-article-id');
            if (articleId) {
                const views = getViews(articleId);
                span.textContent = `👁️ ${views} просмотров`;
            }
        });
    }
    
    function initializeViewCounters() {
        const articles = document.querySelectorAll('article');
        articles.forEach((article, index) => {
            const viewsSpan = article.querySelector('.views-count');
            if (viewsSpan && !viewsSpan.hasAttribute('data-article-id')) {
                viewsSpan.setAttribute('data-article-id', index);
                const views = getViews(index);
                viewsSpan.textContent = `👁️ ${views} просмотров`;
            }
        });
    }
    
    function setupArticleClickTracking() {
        const articles = document.querySelectorAll('article');
        articles.forEach((article, index) => {
            const viewsSpan = article.querySelector('.views-count');
            if (viewsSpan) {
                const articleId = viewsSpan.getAttribute('data-article-id');
                
                // Отслеживаем клики на ссылку "Читать дальше"
                const readMoreLink = article.querySelector('.read-more');
                if (readMoreLink) {
                    readMoreLink.addEventListener('click', () => {
                        const newViews = incrementViews(articleId);
                        viewsSpan.textContent = `👁️ ${newViews} просмотров`;
                    });
                }
            }
        });
    }
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        // Проверяем, остались ли еще не загруженные статьи
        if (loadedNewArticlesCount < moreArticles.length) {
            const mainElement = document.querySelector('main');
            
            // Берем следующую статью из массива (начиная с индекса 0)
            const currentArticle = moreArticles[loadedNewArticlesCount];
            
            // ID для новой статьи = существующие статьи + уже загруженные новые
            const newArticleId = existingArticlesCount + loadedNewArticlesCount;
            
            // Создаем новую статью
            const newArticle = createArticleElement(currentArticle, newArticleId);
            
            // Находим контейнер с кнопкой (чтобы вставить перед ним)
            const buttonContainer = document.querySelector('.load-more-container');
            
            // Вставляем статью перед кнопкой
            if (buttonContainer) {
                mainElement.insertBefore(newArticle, buttonContainer);
            } else {
                mainElement.appendChild(newArticle);
            }
            
            console.log(`Загружена статья ${loadedNewArticlesCount + 1}: ${currentArticle.title}`);
            
            // Настраиваем счетчик для новой статьи
            const newViewsSpan = newArticle.querySelector('.views-count');
            if (newViewsSpan) {
                newViewsSpan.setAttribute('data-article-id', newArticleId);
                const views = getViews(newArticleId);
                newViewsSpan.textContent = `👁️ ${views} просмотров`;
            }
            
            // Навешиваем обработчик на новую ссылку "Читать дальше"
            const newReadMoreLink = newArticle.querySelector('.read-more');
            if (newReadMoreLink && newViewsSpan) {
                newReadMoreLink.addEventListener('click', () => {
                    const newViews = incrementViews(newArticleId);
                    newViewsSpan.textContent = `👁️ ${newViews} просмотров`;
                });
            }
            
            // Увеличиваем счетчик загруженных новых статей
            loadedNewArticlesCount++;
            
            // Если загрузили все статьи, скрываем кнопку
            if (loadedNewArticlesCount === moreArticles.length) {
                loadMoreBtn.style.display = 'none';
                console.log('Все новые статьи загружены!');
            }
        } else {
            console.log('Больше нет статей для загрузки');
        }
    });
}
    
        
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Проверяем сохраненную тему при загрузке
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️ Светлая тема';
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? '☀️ Светлая тема' : '🌙 Темная тема';
        });
    }
    
    initializeViewCounters();
    setupArticleClickTracking();
    updateAllViewCounters();