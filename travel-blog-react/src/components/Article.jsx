function Article ({title, preview, views, onReadMore}) {
  return (
    <article>
      <h2>{title}</h2>
      <div className='article-meta'>
        <span>👁️ {views} просмотров</span>
      </div>
      <p>{preview}</p>
      <button onClick={onReadMore}>Читать дальше</button>
    </article>
  )
}

export default Article