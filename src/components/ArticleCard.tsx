import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { Article } from '@/services/articleService';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculer le temps de lecture approximatif (200 mots par minute)
  const calculateReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/article/${article.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.user?.avatar || (article.user?.email ? `https://www.gravatar.com/avatar/${article.user.email}?d=mp` : undefined)} alt={article.user?.name || 'Auteur'} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{article.user?.name || 'Auteur inconnu'}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-3">{article.content.substring(0, 150)}...</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateReadTime(article.content)} min</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleCard;
