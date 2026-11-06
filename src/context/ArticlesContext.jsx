
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const { user } = useAuth();

  // Load saved articles from localStorage
  const [savedArticlesByUser, setSavedArticlesByUser] = useState(() => {
    try {
      const saved = localStorage.getItem('newsreader_articles');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save articles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'newsreader_articles',
      JSON.stringify(savedArticlesByUser)
    );
  }, [savedArticlesByUser]);

  // Get articles belonging to the logged-in user
  const getUserSavedArticles = () => {
    if (!user) return [];

    return savedArticlesByUser[user.username] || [];
  };

  // Save an article for the logged-in user
  const saveArticle = (article) => {
    if (!user) return;

    setSavedArticlesByUser(prev => {
      const userArticles = prev[user.username] || [];

      // Prevent duplicate saved articles
      if (userArticles.some(a => a.url === article.url)) {
        return prev;
      }

      return {
        ...prev,
        [user.username]: [...userArticles, article]
      };
    });
  };

  // Remove an article belonging to the logged-in user
  const removeArticle = (url) => {
    if (!user) return;

    setSavedArticlesByUser(prev => ({
      ...prev,
      [user.username]: (prev[user.username] || [])
        .filter(article => article.url !== url)
    }));
  };

  // Check whether the logged-in user saved an article
  const isArticleSaved = (url) => {
    return getUserSavedArticles().some(
      article => article.url === url
    );
  };

  // Get all users' articles for the Admin Dashboard
  const getAllUserArticles = () => {
    return savedArticlesByUser;
  };

  return (
    <ArticlesContext.Provider
      value={{
        savedArticles: getUserSavedArticles(),
        savedArticlesByUser,
        saveArticle,
        removeArticle,
        isArticleSaved,
        getUserSavedArticles,
        getAllUserArticles
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);

  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }

  return context;
}
