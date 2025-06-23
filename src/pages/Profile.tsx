import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getArticles } from '@/lib/articles';
import { User, Edit, BookOpen, Calendar } from 'lucide-react';
import { Article } from '@/services/articleService';

interface UserWithCreatedAt {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await getArticles();
        const userArticles = response.data.filter(article => article.user_id === user?.id);
        setArticles(userArticles);
      } catch (err) {
        setError('Impossible de charger les articles');
        console.error('Erreur lors du chargement des articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [isAuthenticated, navigate, user?.id]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>Chargement du profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const userWithCreatedAt = user as UserWithCreatedAt;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil utilisateur */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.email ? `https://www.gravatar.com/avatar/${user.email}?d=mp` : undefined} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <p className="text-gray-600">{user.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span>Articles publiés</span>
                  </div>
                  <span className="font-semibold">{articles.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Membre depuis</span>
                  </div>
                  <span className="font-semibold">{formatDate(userWithCreatedAt.created_at)}</span>
                </div>

                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Articles de l'utilisateur */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes articles</h2>
              <p className="text-gray-600">
                Gérez et consultez tous vos articles publiés
              </p>
            </div>

            {articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <div key={article.id} className="relative">
                    <ArticleCard article={article} />
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={`/edit-article/${article.id}`}>
                          <Edit className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun article publié
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez à écrire votre premier article pour le partager avec la communauté.
                  </p>
                  <Button asChild>
                    <a href="/create-article">Écrire un article</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
