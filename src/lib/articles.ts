import articleService, { Article, PaginatedResponse, ArticleCreate, ArticleUpdate } from '../services/articleService';

// Supprimez ou commentez les données simulées si vous n'en avez plus besoin
// const mockArticles: Article[] = [ ... ];

export const getArticles = async (page: number = 1): Promise<PaginatedResponse<Article>> => {
  console.log('Appel de getArticles (via articleService)', page);
  return articleService.getAll(page);
};

export const getArticleById = async (id: number): Promise<Article> => {
  console.log('Appel de getArticleById (via articleService)', id);
  try {
    const article = await articleService.getById(id);
    if (!article) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }
    return article;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ${id} :`, error);
    throw error;
  }
};

export const saveArticle = async (articleData: ArticleCreate): Promise<Article> => {
   console.log('Appel de saveArticle (via articleService)', articleData);
  return articleService.create(articleData);
};

export const updateArticle = async (id: number, articleData: ArticleUpdate): Promise<Article | null> => {
   console.log('Appel de updateArticle (via articleService)', id, articleData);
  try {
      return await articleService.update(id, articleData);
  } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'article ${id} :`, error);
      return null;
  }
};

export const deleteArticle = async (id: number): Promise<boolean> => {
   console.log('Appel de deleteArticle (via articleService)', id);
  try {
      await articleService.delete(id);
      return true;
  } catch (error) {
       console.error(`Erreur lors de la suppression de l'article ${id} :`, error);
       return false;
  }
};

// Vous pouvez supprimer les fonctions getArticleById, saveArticle, updateArticle, deleteArticle 
// basées sur localStorage si vous avez remplacé toute leur logique par des appels API.
