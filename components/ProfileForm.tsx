import React, { useState } from 'react';
import { UserProfile } from '../types';
import { GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS, DIET_PREFERENCE_OPTIONS } from '../constants';

interface ProfileFormProps {
    onSave: (profileData: UserProfile) => void;
    initialProfile: UserProfile | null;
}

const formInputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200";
const formLabelClasses = "block mb-2 font-semibold text-slate-300";

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, initialProfile }) => {
    const [profile, setProfile] = useState<UserProfile>(initialProfile || {
        name: '',
        age: '',
        gender: GENDER_OPTIONS[0],
        height: '',
        weight: '',
        goalWeight: '',
        activityLevel: ACTIVITY_LEVEL_OPTIONS[2],
        dietPreference: DIET_PREFERENCE_OPTIONS[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: (name === 'age' || name === 'height' || name === 'weight' || name === 'goalWeight') && value !== '' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className={formLabelClasses}>Name</label>
                <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className={formInputClasses} required />
            </div>

            <div>
                <label htmlFor="age" className={formLabelClasses}>Age</label>
                <input type="number" id="age" name="age" value={profile.age} onChange={handleChange} className={formInputClasses} required min="1" />
            </div>

            <div>
                <label htmlFor="gender" className={formLabelClasses}>Gender</label>
                <select id="gender" name="gender" value={profile.gender} onChange={handleChange} className={formInputClasses}>
                    {GENDER_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="height" className={formLabelClasses}>Height (cm)</label>
                <input type="number" id="height" name="height" value={profile.height} onChange={handleChange} className={formInputClasses} required min="1" />
            </div>

            <div>
                <label htmlFor="weight" className={formLabelClasses}>Weight (kg)</label>
                <input type="number" id="weight" name="weight" value={profile.weight} onChange={handleChange} className={formInputClasses} required min="1" />
            </div>

            <div>
                <label htmlFor="goalWeight" className={formLabelClasses}>Goal Weight (kg) - Optional</label>
                <input type="number" id="goalWeight" name="goalWeight" value={profile.goalWeight} onChange={handleChange} className={formInputClasses} min="1" />
            </div>

            <div>
                <label htmlFor="activityLevel" className={formLabelClasses}>Activity Level</label>
                <select id="activityLevel" name="activityLevel" value={profile.activityLevel} onChange={handleChange} className={formInputClasses}>
                    {ACTIVITY_LEVEL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="dietPreference" className={formLabelClasses}>Diet Preference</label>
                <select id="dietPreference" name="dietPreference" value={profile.dietPreference} onChange={handleChange} className={formInputClasses}>
                    {DIET_PREFERENCE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-teal-500 text-slate-900 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
                Save Profile
            </button>
        </form>
    );
};

export default ProfileForm;