import { useState } from 'react'
import './App.css'
import Article from './components/Article'

function App() {
  const [articles, setArticles] = useState([
    { id: 1, title: "Лиссабон", preview: "Красивый город на холмах", views: 5 },
    { id: 2, title: "Токио", preview: "Город будущего", views: 8 }
  ])

  // Функция увеличения просмотров
  const incrementViews = (id) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === id
          ? { ...article, views: article.views + 1 }
          : article
      )
    )
  }

  return (
    <div>
      <h1>Мой блог о путешествиях</h1>
      
      {articles.map(article => (
        <Article
          key={article.id}
          title={article.title}
          preview={article.preview}
          views={article.views}
          onReadMore={() => incrementViews(article.id)}
        />
      ))}
    </div>
  )
}

export default App