export interface UserProfile {
  name: string;
  age: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  goalWeight: number | '';
  activityLevel: string;
  dietPreference: string;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface UserPreferences {
  dietType: 'Anything' | 'Keto' | 'Vegan' | 'Paleo';
  calorieGoal: number;
  preference: 'Anything' | 'Vegetarian' | 'Non-Vegetarian';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
}

export interface Meal {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snacks: Recipe;
}

export interface MealPlan {
  dailyPlan: Meal;
  totalCalories: number;
}

export interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface NotificationSettings {
  enabled: boolean;
  mealReminders: {
    breakfast: string; // "HH:mm"
    lunch: string;     // "HH:mm"
    dinner: string;    // "HH:mm"
    snacks: string;    // "HH:mm"
  };
  weightReminder: {
    enabled: boolean;
    time: string; // "HH:mm"
  };
}