import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool, Users, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Section Héro */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue sur <span className="text-blue-600">BlogApp</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Partagez vos idées, découvrez de nouvelles perspectives et connectez-vous avec une communauté passionnée d'écrivains et de lecteurs.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg">
                <Link to="/register">Commencer à écrire</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir BlogApp ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Écrivez facilement</h3>
              <p className="text-gray-600">
                Une interface intuitive pour rédiger et formater vos articles en toute simplicité.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté active</h3>
              <p className="text-gray-600">
                Rejoignez une communauté dynamique de lecteurs et d'auteurs passionnés.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expérience unique</h3>
              <p className="text-gray-600">
                Profitez d'une expérience de lecture fluide et agréable sur tous vos appareils.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre voyage d'écriture ?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez notre communauté et commencez à partager vos histoires dès aujourd'hui.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Créer un compte gratuitement</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
