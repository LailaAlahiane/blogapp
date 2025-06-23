import api from './api';

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ArticleCreate {
  title: string;
  content: string;
}

export interface ArticleUpdate extends ArticleCreate {}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const articleService = {
  async getAll(page: number = 1): Promise<PaginatedResponse<Article>> {
    console.log('Appel de articleService.getAll', page);
    const response = await api.get<PaginatedResponse<Article>>('/api/articles', {
      params: { page }
    });
    return response.data;
  },

  async getById(id: number): Promise<Article> {
    console.log('Appel de articleService.getById', id);
    const response = await api.get<Article>(`/api/articles/${id}`);
    return response.data;
  },

  async create(data: ArticleCreate): Promise<Article> {
    console.log('Appel de articleService.create', data);
    const response = await api.post<Article>('/api/articles', data);
    return response.data;
  },

  async update(id: number, data: ArticleUpdate): Promise<Article> {
    console.log('Appel de articleService.update', id, data);
    const response = await api.put<Article>(`/api/articles/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    console.log('Appel de articleService.delete', id);
    await api.delete(`/api/articles/${id}`);
  }
};

export default articleService; 