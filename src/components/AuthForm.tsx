import React, { useState } from 'react';
import authService from '../services/authService';

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (isRegister) {
        await authService.register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        // Optionnel : Basculer automatiquement vers le formulaire de connexion
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        const response = await authService.login({ email, password });
        setMessage('Connexion réussie ! Token : ' + response.token);
        // Ici, vous voudriez généralement rediriger l'utilisateur
        // ou stocker l'état d'authentification (par exemple, dans un contexte React)
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification :', err);
      if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Gérer les erreurs de validation de Laravel
        const errors = Object.values(err.response.data.errors).flat().join(' ');
        setError('Erreur de validation : ' + errors);
      } else {
         setError('Une erreur est survenue lors de l\'authentification.');
      }
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Inscription' : 'Connexion'}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAuth}>
        {isRegister && (
          <div>
            <label>
              Nom:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          </div>
        )}
        <div>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Mot de passe:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
        </div>
        {isRegister && (
          <div>
            <label>
              Confirmer le mot de passe:
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <button type="submit">{isRegister ? 'S\'inscrire' : 'Se connecter'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'J\'ai déjà un compte' : 'Créer un compte'}
      </button>
    </div>
  );
};

export default AuthForm;