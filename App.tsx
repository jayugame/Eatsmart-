import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MealPlan, UserPreferences, Recipe, UserProfile, WeightEntry, NotificationSettings } from './types';
import PreferencesForm from './components/PreferencesForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import GroceryList from './components/GroceryList';
import BottomNav from './components/BottomNav';
import ScanView from './components/ScanView';
import SummaryCard from './components/SummaryCard';
import DatePicker from './components/DatePicker';
import Header from './components/Header';
import Welcome from './components/Welcome';
import ProfileView from './components/ProfileView';
import { generateMealPlan } from './services/geminiService';
import { useNotifications } from './hooks/useNotifications';
import FavoritesView from './components/FavoritesView';
import InterstitialAd from './components/InterstitialAd';
import BannerAdPlaceholder from './components/BannerAdPlaceholder';
import CountdownTimer from './components/CountdownTimer';

type Tab = 'plan' | 'grocery' | 'favorites';
type View = 'home' | 'scan' | 'profile' | 'favorites';

const App: React.FC = () => {
  const [profileCreated, setProfileCreated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [isShowingInterstitial, setIsShowingInterstitial] = useState<boolean>(false);
  const [mealPlanDate, setMealPlanDate] = useState<string | null>(null);


  useNotifications(notificationSettings);

  useEffect(() => {
    try {
      // Load non-daily data first
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setProfileCreated(true);
      }
      const savedWeightHistory = localStorage.getItem('weightHistory');
      if (savedWeightHistory) {
        setWeightHistory(JSON.parse(savedWeightHistory));
      }
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      const savedPreferences = localStorage.getItem('currentPreferences');
      if (savedPreferences) {
          setCurrentPreferences(JSON.parse(savedPreferences));
      }
       const savedSettings = localStorage.getItem('notificationSettings');
       if (savedSettings) {
           setNotificationSettings(JSON.parse(savedSettings));
       } else {
           setNotificationSettings({
               enabled: false,
               mealReminders: { breakfast: '08:00', lunch: '12:30', dinner: '18:30', snacks: '15:30' },
               weightReminder: { enabled: false, time: '07:30' },
           });
       }

      // Check if meal plan is for today
      const savedMealPlanDate = localStorage.getItem('mealPlanDate');
      const today = new Date().toISOString().split('T')[0];

      if (savedMealPlanDate && savedMealPlanDate === today) {
        // It's the same day, so load the plan
        const savedMealPlan = localStorage.getItem('mealPlan');
        if (savedMealPlan) {
            setMealPlan(JSON.parse(savedMealPlan));
        }
        const savedCompletedMeals = localStorage.getItem('completedMeals');
        if (savedCompletedMeals) {
            setCompletedMeals(JSON.parse(savedCompletedMeals));
        }
        setMealPlanDate(savedMealPlanDate);
      } else {
        // It's a new day, clear the old plan data from storage
        localStorage.removeItem('mealPlan');
        localStorage.removeItem('completedMeals');
        localStorage.removeItem('mealPlanDate');
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (mealPlan) {
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    } else {
        localStorage.removeItem('mealPlan');
    }
  }, [mealPlan]);
  
  useEffect(() => {
    if (mealPlanDate) {
        localStorage.setItem('mealPlanDate', mealPlanDate);
    }
  }, [mealPlanDate]);

  useEffect(() => {
    if (currentPreferences) {
        localStorage.setItem('currentPreferences', JSON.stringify(currentPreferences));
    } else {
        localStorage.removeItem('currentPreferences');
    }
  }, [currentPreferences]);

  useEffect(() => {
    localStorage.setItem('completedMeals', JSON.stringify(completedMeals));
  }, [completedMeals]);

  useEffect(() => {
    if (notificationSettings) {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }
  }, [notificationSettings]);

  const handleNavigate = (targetView: View) => {
    // Don't show interstitial when returning home or navigating to favorites
    if (currentView === 'home' && (targetView === 'scan' || targetView === 'profile')) {
      setIsShowingInterstitial(true);
      setTimeout(() => {
        setIsShowingInterstitial(false);
        setCurrentView(targetView);
      }, 1500); // Simulate ad loading time
    } else {
      setCurrentView(targetView);
    }
  };


  const handleGeneratePlan = useCallback(async (preferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    setCompletedMeals([]); 
    setCurrentPreferences(preferences);
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlan(plan);
      const today = new Date().toISOString().split('T')[0];
      setMealPlanDate(today);
      setActiveTab('plan');
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSaveProfile = useCallback((profileData: UserProfile) => {
    setUserProfile(profileData);
    setProfileCreated(true);
    handleNavigate('home');
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    // If weight has changed, add a new entry to history
    if (profileData.weight && (weightHistory.length === 0 || weightHistory[weightHistory.length - 1].weight !== profileData.weight)) {
      handleLogWeight(Number(profileData.weight));
    }

  }, [weightHistory]);

  const handleLogWeight = useCallback((newWeight: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...weightHistory];
    const todayEntryIndex = newHistory.findIndex(entry => entry.date === today);

    if (todayEntryIndex > -1) {
        // Update today's entry
        newHistory[todayEntryIndex].weight = newWeight;
    } else {
        // Add a new entry
        newHistory.push({ date: today, weight: newWeight });
    }
    
    setWeightHistory(newHistory);
    localStorage.setItem('weightHistory', JSON.stringify(newHistory));
    
    // Also update the current weight in the main profile
    if(userProfile && userProfile.weight !== newWeight) {
        const updatedProfile = { ...userProfile, weight: newWeight };
        setUserProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  }, [userProfile, weightHistory]);

  const handleToggleFavorite = useCallback((recipe: Recipe) => {
    setFavorites(prev =>
      prev.some(fav => fav.id === recipe.id)
        ? prev.filter(fav => fav.id !== recipe.id)
        : [...prev, recipe]
    );
  }, []);

  const handleToggleCompleted = useCallback((recipeId: string) => {
    setCompletedMeals(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  }, []);

  const handleSaveNotificationSettings = useCallback((settings: NotificationSettings) => {
    setNotificationSettings(settings);
  }, []);
  
  const consumedStats = useMemo(() => {
    if (!mealPlan) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const allMeals: Recipe[] = Object.values(mealPlan.dailyPlan);
    const eatenMeals = allMeals.filter(meal => completedMeals.includes(meal.id));

    return eatenMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  }, [mealPlan, completedMeals]);

  const groceryList = useMemo(() => {
    if (!mealPlan) return [];
    const allIngredients = [
      ...mealPlan.dailyPlan.breakfast.ingredients,
      ...mealPlan.dailyPlan.lunch.ingredients,
      ...mealPlan.dailyPlan.dinner.ingredients,
      ...mealPlan.dailyPlan.snacks.ingredients,
    ];
    return [...new Set(allIngredients)].sort();
  }, [mealPlan]);

  const countdownExpiryTimestamp = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }, []);

  const renderHomeView = () => {
    if (!profileCreated) {
      return <Welcome onCreateProfile={() => handleNavigate('profile')} />;
    }
    
    return (
      <>
        {!mealPlan && !isLoading && (
            <PreferencesForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
        )}

        {isLoading && (
            <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="mt-4 text-slate-400 font-semibold">Generating your personalized meal plan...</p>
            </div>
        )}

        {error && (
            <div className="text-center p-8 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <h3 className="font-bold">Oops! Something went wrong.</h3>
                <p>{error}</p>
            </div>
        )}

        {mealPlan && !isLoading && (
          <div className="mt-2 space-y-8">
            <div className="space-y-6">
                <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
                
                <CountdownTimer expiryTimestamp={countdownExpiryTimestamp} />
                
                <SummaryCard 
                    consumedStats={consumedStats} 
                    calorieGoal={currentPreferences?.calorieGoal || 2000} 
                />
            </div>

            <div>
                <div className="flex justify-start items-center border-b border-slate-700 mb-6">
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'plan' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-slate-400 hover:text-teal-400'}`}
                    >
                        Today's Meals
                    </button>
                    <button
                        onClick={() => setActiveTab('grocery')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'grocery' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-slate-400 hover:text-teal-400'}`}
                    >
                        Grocery List ({groceryList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'favorites' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-slate-400 hover:text-teal-400'}`}
                    >
                        Favorites ({favorites.length})
                    </button>
                </div>
                
                {activeTab === 'plan' && (
                <MealPlanDisplay 
                    mealPlan={mealPlan.dailyPlan}
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavorite}
                    completedMeals={completedMeals}
                    onToggleCompleted={handleToggleCompleted}
                />
                )}
                {activeTab === 'grocery' && (
                <GroceryList ingredients={groceryList} />
                )}
                {activeTab === 'favorites' && (
                <FavoritesView 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavorite}
                />
                )}
            </div>
            
            <BannerAdPlaceholder />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {isShowingInterstitial && <InterstitialAd />}
      <Header currentView={currentView} onShowFavorites={() => handleNavigate('favorites')} />
      <main className="mx-auto p-4">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'scan' && <ScanView />}
        {currentView === 'profile' && 
            <ProfileView 
                onSaveProfile={handleSaveProfile} 
                initialProfile={userProfile} 
                weightHistory={weightHistory}
                onLogWeight={handleLogWeight}
                notificationSettings={notificationSettings}
                onSaveNotificationSettings={handleSaveNotificationSettings}
            />}
        {currentView === 'favorites' && (
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-6 text-center">Your Favorites</h1>
                <FavoritesView 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavorite}
                />
            </div>
        )}
      </main>
      
      <BottomNav 
        activeView={currentView} 
        onViewChange={handleNavigate} 
      />
    </div>
  );
};

export default App;