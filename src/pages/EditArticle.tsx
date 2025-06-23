
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getArticleById, updateArticle } from '@/lib/articles';
import { Save, X } from 'lucide-react';

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const article = id ? getArticleById(parseInt(id)) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!article) {
      navigate('/');
      return;
    }

    if (user && article.author.id !== user.id) {
      navigate('/');
      toast({
        title: "Accès refusé",
        description: "Vous n'êtes pas autorisé à modifier cet article.",
        variant: "destructive",
      });
      return;
    }

    // Charger les données de l'article
    setTitle(article.title);
    setContent(article.content);
    setExcerpt(article.excerpt);
    setImage(article.image || '');
    setTags(article.tags);
  }, [isAuthenticated, article, user, navigate, toast]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setIsLoading(true);

    try {
      const readTime = Math.ceil(content.split(' ').length / 200);
      
      const updatedArticle = updateArticle(article.id, {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        readTime,
        tags,
        image: image || undefined
      });

      if (updatedArticle) {
        toast({
          title: "Article modifié",
          description: "Votre article a été mis à jour avec succès.",
        });
        navigate(`/article/${article.id}`);
      } else {
        throw new Error('Échec de la mise à jour');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !article) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Modifier l'article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'article</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Un titre accrocheur..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Résumé (optionnel)</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Un court résumé de votre article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de l'image (optionnel)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ajouter un tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu de l'article</Label>
                <Textarea
                  id="content"
                  placeholder="Écrivez votre article ici..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditArticle;
