import React from 'react';

interface WelcomeProps {
    onCreateProfile: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onCreateProfile }) => {
    return (
        <div className="bg-slate-800 p-6 md:p-10 rounded-2xl shadow-lg border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome! 👋</h2>
            <p className="text-slate-400 mb-6">Let's set up your profile to get personalized calorie goals.</p>
            <button
                onClick={onCreateProfile}
                className="bg-teal-500 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
            >
                Create Profile
            </button>
        </div>
    );
};

export default Welcome;