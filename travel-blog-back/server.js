
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Разрешаем запросы с фронтенда
app.use(cors());

// Разрешаем серверу понимать JSON
app.use(express.json());

// Данные статей
const articles = [
    {
        id: 1,
        title: "Город, который пахнет свободой: мой первый день в Лиссабоне",
        date: "2026-03-12",
        preview: "Лиссабон встречает не шумом аэропорта, а запахом соленого океана и жареных...",
        content: "Полный текст статьи...",
        views: 5
    },
    {
        id: 2,
        title: "Дорога как искусство",
        date: "2026-03-25",
        preview: "Главное в путешествии — не количество пройденных миль...",
        content: "Полный текст статьи...",
        views: 12
    },
    {
        id: 3,
        title: "Как найти дешевые билеты: секреты опытного путешественника",
        date: "2026-03-18",
        preview: "Делюсь проверенными способами экономить на перелетах без ущерба для комфорта.",
        content: "Полный текст статьи...",
        views: 3
    },
    {
        id: 4,
        title: "Что попробовать в Токио: гид по уличной еде",
        date: "2026-03-10",
        preview: "От такояки до окономияки — рассказываю, что обязательно нужно съесть в японской столице.",
        content: "Полный текст статьи...",
        views: 8
    },
    {
        id: 5,
        title: "5 ошибок, которые я совершил в первом solo-трипе",
        date: "2026-03-05",
        preview: "На чужих ошибках учатся, но я поделюсь своими, чтобы вы их не повторяли.",
        content: "Полный текст статьи...",
        views: 21
    }
];

// API МАРШРУТЫ
// GET /api/articles — получить статьи с пагинацией
app.get('/api/articles', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginatedArticles = articles.slice(start, end);
    
    res.json({
        articles: paginatedArticles,
        total: articles.length,
        page: page,
        totalPages: Math.ceil(articles.length / limit)
    });
});

// GET /api/articles/:id — получить одну статью по ID
app.get('/api/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);
    
    if (article) {
        res.json(article);
    } else {
        res.status(404).json({ error: '404 Статья не найдена' });
    }
});

// POST /api/articles/:id/views — увеличить просмотры
app.post('/api/articles/:id/views', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);
    
    if (article) {
        article.views += 1;
        res.json({ id: article.id, views: article.views });
    } else {
        res.status(404).json({ error: '404 Статья не найдена' });
    }
});

// POST /api/articles — добавить новую статью (для "Показать еще")
app.post('/api/articles', (req, res) => {
    const { title, date, preview, content } = req.body;
    
    const newId = articles.length + 1;
    const newArticle = {
        id: newId,
        title,
        date,
        preview,
        content: content || preview,
        views: 0
    };
    
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

// Запускаем сервер
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
    console.log(`📋 Статьи доступны по адресу: http://localhost:${port}/api/articles`);
});
