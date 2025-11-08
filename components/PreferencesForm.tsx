import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { DIET_TYPES, PREFERENCES } from '../constants';
import { SparklesIcon } from './Icons';

interface PreferencesFormProps {
  onGenerate: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onGenerate, isLoading }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietType: 'Anything',
    calorieGoal: 2000,
    preference: 'Anything',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: name === 'calorieGoal' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(preferences);
  };

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700 mb-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="flex flex-col">
          <label htmlFor="dietType" className="mb-2 font-semibold text-slate-300">Diet Type</label>
          <select
            id="dietType"
            name="dietType"
            value={preferences.dietType}
            onChange={handleChange}
            className="p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200"
          >
            {DIET_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="preference" className="mb-2 font-semibold text-slate-300">Preference</label>
          <select
            id="preference"
            name="preference"
            value={preferences.preference}
            onChange={handleChange}
            className="p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200"
          >
            {PREFERENCES.map(pref => <option key={pref} value={pref}>{pref}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="calorieGoal" className="mb-2 font-semibold text-slate-300">Daily Calorie Goal</label>
          <input
            type="number"
            id="calorieGoal"
            name="calorieGoal"
            value={preferences.calorieGoal}
            onChange={handleChange}
            min="1000"
            max="5000"
            step="50"
            className="p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center p-3 bg-teal-500 text-slate-900 font-bold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out disabled:bg-teal-800 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2"/>
              Generate Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;