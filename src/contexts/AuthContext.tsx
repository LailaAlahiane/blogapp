import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Importez le service d'authentification

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  // Ajoutez d'autres fonctions si nécessaire, par exemple pour rafraîchir l'utilisateur
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Charger l'utilisateur lors du montage du composant si un token existe
  useEffect(() => {
    const token = authService.getToken();
    if (token && !user) {
      fetchUser();
    }
  }, []);

  // Fonction pour récupérer les informations de l'utilisateur connecté
  const fetchUser = async () => {
      try {
          const userData = await authService.getUser();
          setUser(userData);
          // Optionnel: Stocker l'utilisateur dans localStorage si authService ne le fait pas
          // localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur :', error);
          setUser(null);
          authService.logout(); // Déconnecter si la récupération de l'utilisateur échoue (token invalide/expiré)
      }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      // authService.login stocke déjà le token, nous pouvons maintenant récupérer l'utilisateur
      await fetchUser();
      return true; // Indique que la connexion a réussi
    } catch (error) {
      console.error('Erreur lors de la connexion via contexte :', error);
      setUser(null);
      authService.logout(); // Assurez-vous que le token est effacé en cas d'erreur
      return false; // Indique que la connexion a échoué
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await authService.register({ name, email, password, password_confirmation: password }); // Assurez-vous que password_confirmation correspond
      // Après l'inscription, vous pourriez vouloir connecter automatiquement l'utilisateur ou le rediriger vers la page de connexion.
      // Pour l'instant, nous indiquons simplement le succès.
      return true; // Indique que l'inscription a réussi
    } catch (error) {
       console.error('Erreur lors de l\'inscription via contexte :', error);
       return false; // Indique que l'inscription a échoué
    }
  };

  const logout = () => {
    console.log('Déconnexion via contexte');
    authService.logout(); // Supprime le token
    setUser(null); // Efface l'utilisateur du state du contexte
    // Optionnel: Supprimer l'utilisateur de localStorage si vous l'y stockiez
    // localStorage.removeItem('user');
  };

  // Vérifie l'état d'authentification en se basant sur la présence du token
  const isAuthenticated = !!authService.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        fetchUser, // Exposez fetchUser si vous en avez besoin ailleurs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
