import React from 'react';

const InterstitialAd: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="bg-slate-800 p-8 rounded-lg text-center shadow-2xl">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-100">Loading Ad...</h2>
                <p className="text-slate-400 mt-2">Please wait a moment.</p>
            </div>
        </div>
    );
};

export default InterstitialAd;