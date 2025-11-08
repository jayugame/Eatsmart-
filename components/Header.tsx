import React from 'react';
import { HeartIcon } from './Icons';

type View = 'home' | 'scan' | 'profile' | 'favorites';

interface HeaderProps {
    currentView: View;
    onShowFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onShowFavorites }) => {
    return (
        <header className="relative flex items-center justify-center p-4 bg-slate-800 border-b border-slate-700">
            <h1 className="text-lg font-bold text-slate-100">
                EatSmart
            </h1>
            {currentView !== 'favorites' && (
                <button
                    onClick={onShowFavorites}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                    aria-label="Show favorites"
                >
                    <HeartIcon />
                </button>
            )}
        </header>
    );
};

export default Header;