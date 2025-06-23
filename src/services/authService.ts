import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string;
}

const TOKEN_KEY = 'auth_token';

const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('Appel de authService.register', data);
    const response = await api.post<AuthResponse>('/api/register', data);
    console.log('Réponse register:', response.data);
    if (response.data.token) {
      this.setToken(response.data.token);
    } else {
      console.error('Pas de token dans la réponse register');
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('Appel de authService.login', data);
    const response = await api.post<AuthResponse>('/api/login', data);
    console.log('Réponse login:', response.data);
    if (response.data.token) {
      this.setToken(response.data.token);
    } else {
      console.error('Pas de token dans la réponse login');
    }
    return response.data;
  },

  async logout(): Promise<void> {
    console.log('Appel de authService.logout');
    this.removeToken();
    
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token stocké');
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Token récupéré:', token ? 'Présent' : 'Absent');
    return token;
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    console.log('Token supprimé');
  },

  isAuthenticated(): boolean {
    const isAuth = !!this.getToken();
    console.log('Utilisateur authentifié:', isAuth);
    return isAuth;
  },

  async getUser(): Promise<AuthResponse['user']> {
    console.log('Appel de authService.getUser');
    const response = await api.get<AuthResponse['user']>('/api/user');
    console.log('Réponse getUser:', response.data);
    return response.data;
  }
};

export default authService; 