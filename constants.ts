import { UserPreferences } from './types';

export const DIET_TYPES: UserPreferences['dietType'][] = ['Anything', 'Keto', 'Vegan', 'Paleo'];
export const PREFERENCES: UserPreferences['preference'][] = ['Anything', 'Vegetarian', 'Non-Vegetarian'];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const ACTIVITY_LEVEL_OPTIONS = [
    'Sedentary (little to no exercise)',
    'Light (1-3 days/week)',
    'Moderate (3-5 days/week)',
    'Active (6-7 days/week)',
    'Very Active (hard exercise or physical job)',
];

export const DIET_PREFERENCE_OPTIONS = [
    'Vegetarian',
    'Anything',
    'Vegan',
    'Pescatarian',
    'Gluten-Free',
    'Keto',
    'Paleo',
];