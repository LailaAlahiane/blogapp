import React, { useEffect, useState } from 'react';
import articleService, { Article } from '../services/articleService';
import authService from '../services/authService';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    const fetchArticles = async () => {
      try {
        const response = await articleService.getAll();
        setArticles(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des articles :', err);
        setError('Erreur lors du chargement des articles.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchArticles();

    // Optionnel : Ajouter un écouteur pour réagir aux changements d'authentification
    // window.addEventListener('storage', checkAuth); // Écoute les changements de localStorage
    // return () => { window.removeEventListener('storage', checkAuth); };

  }, []);

  if (loading) {
    return <div>Chargement des articles...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <h1>Liste des Articles</h1>
      {isAuthenticated && <CreateArticleForm onArticleCreated={() => fetchArticles()} />}
      {articles.length === 0 ? (
        <p>Aucun article trouvé.</p>
      ) : (
        articles.map(article => (
          <div key={article.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <p>Par: {article.user?.name || 'Auteur inconnu'}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Un composant simple pour le formulaire de création d'article
interface CreateArticleFormProps {
    onArticleCreated: () => void;
}

const CreateArticleForm: React.FC<CreateArticleFormProps> = ({ onArticleCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        setError(null);

        try {
            await articleService.create({ title, content });
            setMessage('Article créé avec succès !');
            setTitle('');
            setContent('');
            onArticleCreated(); // Appeler la fonction de rappel pour rafraîchir la liste
        } catch (err: any) {
            console.error('Erreur lors de la création de l\'article :', err);
             if (err.response && err.response.data && err.response.data.errors) {
                 const errors = Object.values(err.response.data.errors).flat().join(' ');
                 setError('Erreur de validation : ' + errors);
             } else if (err.response && err.response.data && err.response.data.message) {
                 setError('Erreur : ' + err.response.data.message);
             } else {
                 setError('Une erreur est survenue lors de la création de l\'article.');
             }
        }
    };

    return (
        <div style={{ border: '1px solid #eee', padding: '15px', margin: '15px 0' }}>
            <h3>Créer un nouvel Article</h3>
             {message && <p style={{ color: 'green' }}>{message}</p>}
             {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Titre:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Contenu:
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                    </label>
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Créer Article</button>
            </form>
        </div>
    );
};

export default ArticleList; 