import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function NewsCard({ article }) {
  return (
    <div className="news-card card h-100 shadow-sm rounded-lg overflow-hidden">
      {article.urlToImage && (
        <img src={article.urlToImage} className="card-img-top" alt={article.title} />
      )}
      <div className="card-body p-4">
        <h2 className="card-title text-xl font-bold mb-2">{article.title}</h2>
        <p className="card-text text-gray-700">{article.description}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Read more
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
