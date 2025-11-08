import React, { useState } from 'react';
import { Recipe } from '../types';
import { HeartIcon, CheckCircleIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  mealType: string;
  icon: React.ReactNode;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  isCompleted?: boolean;
  onToggleCompleted?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, mealType, icon, isFavorite, onToggleFavorite, isCompleted = false, onToggleCompleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-xl hover:border-teal-500 ${isCompleted ? 'border-teal-500' : ''}`}>
      <div className="relative">
        {/* Ad placeholder: This container is ready for an AdMob banner or image ad. */}
        <div 
          className={`w-full h-48 bg-slate-700 ${isCompleted ? 'opacity-50' : ''}`} 
          aria-label="Advertisement placeholder"
        >
        </div>

        {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30" aria-hidden="true">
                <CheckCircleIcon className="w-16 h-16 text-teal-400 bg-slate-800/80 rounded-full p-1" />
            </div>
        )}
        <div className="absolute top-0 left-0 bg-teal-500 text-slate-900 px-4 py-2 rounded-br-2xl font-bold capitalize flex items-center gap-2">
            {icon}
            {mealType}
        </div>
        <button
          onClick={() => onToggleFavorite(recipe)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'bg-red-900/50 text-red-400' : 'bg-slate-700/70 text-slate-300 hover:text-red-400 hover:bg-slate-600'}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon isFilled={isFavorite} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-100 mb-2">{recipe.name}</h3>
        <p className="text-slate-400 text-sm mb-4">{recipe.description}</p>
        
        <div className="flex justify-around text-center text-sm mb-4 bg-slate-700 p-2 rounded-lg">
          <div>
            <p className="font-bold text-teal-400">{recipe.calories}</p>
            <p className="text-slate-400">Calories</p>
          </div>
          <div>
            <p className="font-bold text-teal-400">{recipe.protein}g</p>
            <p className="text-slate-400">Protein</p>
          </div>
          <div>
            <p className="font-bold text-teal-400">{recipe.carbs}g</p>
            <p className="text-slate-400">Carbs</p>
          </div>
          <div>
            <p className="font-bold text-teal-400">{recipe.fat}g</p>
            <p className="text-slate-400">Fat</p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 mt-4 flex items-center justify-between">
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-teal-400 font-semibold hover:underline">
                {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
            {onToggleCompleted && (
              <button 
                onClick={() => onToggleCompleted(recipe.id)}
                className={`flex items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${isCompleted ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isCompleted ? 'Completed!' : 'Mark as Eaten'}
              </button>
            )}
        </div>

        {isExpanded && (
          <div className="mt-4 animate-fade-in">
            <h4 className="font-bold text-md text-slate-200 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-slate-400 space-y-1 mb-4">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>

            <h4 className="font-bold text-md text-slate-200 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside text-slate-400 space-y-2">
              {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;