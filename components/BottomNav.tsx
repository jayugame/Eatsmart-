import React from 'react';
import { HomeIcon, ProfileIcon, ScanIcon } from './Icons';

type View = 'home' | 'scan' | 'profile' | 'favorites';

interface BottomNavProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const NavButton = ({ 
  label, 
  icon, 
  isActive, 
  onClick 
}: { 
  label: string, 
  icon: React.ReactNode, 
  isActive: boolean, 
  onClick: () => void 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${isActive ? 'text-slate-100' : 'text-slate-400 hover:text-slate-100'}`}
      aria-label={label}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
      {isActive && <div className="absolute bottom-1 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-800 border-t border-slate-700 z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <NavButton
          label="Home"
          icon={<HomeIcon className="w-6 h-6" />}
          isActive={activeView === 'home' || activeView === 'favorites'}
          onClick={() => onViewChange('home')}
        />
        <NavButton
          label="Scan"
          icon={<ScanIcon className="w-6 h-6" />}
          isActive={activeView === 'scan'}
          onClick={() => onViewChange('scan')}
        />
        <NavButton
          label="Profile"
          icon={<ProfileIcon className="w-6 h-6" />}
          isActive={activeView === 'profile'}
          onClick={() => onViewChange('profile')}
        />
      </div>
    </div>
  );
};

export default BottomNav;