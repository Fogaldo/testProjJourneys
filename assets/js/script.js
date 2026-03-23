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
    
    let loadedArticlesCount = 2; // Дефолтные 2 статьи в HTML
    

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
            <a href="#" class="read-more" aria-label="Читать статью: ${article.title}">Читать дальше</a>
        `;
        
        return articleElement;
    }