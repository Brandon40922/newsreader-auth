
import ArticleCard from '../components/ArticleCard';
import { useArticles } from '../context/ArticlesContext';

function SavedArticlesPage() {
  const { getUserSavedArticles } = useArticles();

  const savedArticles = getUserSavedArticles();

  return (
    <div>
      <h2 className="page-heading">Saved Articles</h2>

      {savedArticles.length === 0 ? (
        <div className="message">
          No saved articles yet. Browse articles and click the bookmark icon to save them!
        </div>
      ) : (
        <div className="articles-grid">
          {savedArticles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedArticlesPage;
