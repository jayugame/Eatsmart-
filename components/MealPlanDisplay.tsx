import React from 'react';
import { Meal, Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { BreakfastIcon, DinnerIcon, LunchIcon, SnackIcon } from './Icons';

interface MealPlanDisplayProps {
  mealPlan: Meal;
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  completedMeals: string[];
  onToggleCompleted: (recipeId: string) => void;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ 
    mealPlan, 
    favorites, 
    onToggleFavorite,
    completedMeals,
    onToggleCompleted,
}) => {

  const meals = [
    { type: 'breakfast', recipe: mealPlan.breakfast, icon: <BreakfastIcon className="w-5 h-5"/> },
    { type: 'lunch', recipe: mealPlan.lunch, icon: <LunchIcon className="w-5 h-5"/> },
    { type: 'dinner', recipe: mealPlan.dinner, icon: <DinnerIcon className="w-5 h-5"/> },
    { type: 'snacks', recipe: mealPlan.snacks, icon: <SnackIcon className="w-5 h-5"/> },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {meals.map(({ type, recipe, icon }) => (
          recipe && (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              mealType={type}
              icon={icon}
              isFavorite={favorites.some(fav => fav.id === recipe.id)}
              onToggleFavorite={onToggleFavorite}
              isCompleted={completedMeals.includes(recipe.id)}
              onToggleCompleted={onToggleCompleted}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default MealPlanDisplay;
