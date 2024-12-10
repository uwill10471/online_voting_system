import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewsCard from './NewsCard';
import LinearProgress from '../Loaders/LinearProgress';

function News() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const maxPageNumbers = 5; // Max number of pagination buttons to show at once

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    
   const options = { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 Edg/131.0.0.0',
    'Upgrade': 'h2c' // HTTP/2 over cleartext TCP
    } };
    
    const getNews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/news');
        console.log(response.data)
        setNews(response.data.articles);
       
      } catch (error) {
        console.error("News jsx error:",error.message);
      }
      setIsLoading(false);
    };
    
    getNews();
  }, []);

  // Pagination logic
  const totalArticles = news.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <button key="first" onClick={() => paginate(1)} className="btn btn-outline-primary mx-1">
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis1" className="mx-1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`btn btn-outline-primary mx-1 ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis2" className="mx-1">...</span>);
      }
      pageNumbers.push(
        <button key="last" onClick={() => paginate(totalPages)} className="btn btn-outline-primary mx-1">
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div className="container">
          <h1 className="text-center my-4">Election News</h1>
          <div className="row">
            {currentArticles.map((article, index) => (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <NewsCard article={article} />
              </div>
            ))}
          </div>
          <div className="pagination d-flex justify-content-center mt-4">
            {renderPageNumbers()}
          </div>
        </div>
      )}
    </>
  );
}

export default News;























// import React, { useEffect, useState } from 'react';
// import axios from '../axios';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import NewsCard from './NewsCard';
// import LinearProgress from '../Loaders/LinearProgress';


// function News() {
//   const navigate = useNavigate();
//   const isLoggedIn = useSelector(state => state.login.isLoggedIn);
//   const [isLoading, setIsLoading] = useState(false);
//   const [news, setNews] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const articlesPerPage = 5;

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate('/login');
//     }
//   }, [isLoggedIn, navigate]);

//   useEffect(() => {
//     const apiKey = import.meta.env.VITE_NEWS_API_KEY
//     const apiUri = import.meta.env.VITE_NEWS_API_URI
//     const url = `${apiUri}/everything?q=indian+election&sortBy=publishedAt&apiKey=${apiKey}`;
//     const getNews = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(url);
//         setNews(response.data.articles);
//         console.log(response.data.articles);
//       } catch (error) {
//         console.error("News jsx error:", error);
//       }
//       setIsLoading(false);
//     }
//     getNews();
//   }, []);

//   // Pagination logic
//   const indexOfLastArticle = currentPage * articlesPerPage;
//   const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
//   const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <>
//       {isLoading ? (
//         <LinearProgress />
//       ) : (
//         <>
//           <h1>Election News</h1>
//           {currentArticles.map((article, index) => (
//             <NewsCard key={index} article={article} />
//           ))}
//           <div className="pagination">
//             {[...Array(Math.ceil(news.length / articlesPerPage)).keys()].map(number => (
//               <button key={number + 1} onClick={() => paginate(number + 1)}>
//                 {number + 1}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export default News;
