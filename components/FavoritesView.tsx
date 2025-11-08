import React from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { HeartIcon } from './Icons';

interface FavoritesViewProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onToggleFavorite }) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
        <HeartIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">No Favorites Yet</h2>
        <p className="text-slate-400">
          Click the heart icon on any recipe in your meal plan to save it here for later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            mealType="Favorite"
            icon={<HeartIcon className="w-5 h-5" />}
            isFavorite={true} // It's always a favorite in this view
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;