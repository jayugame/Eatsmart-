import React from 'react';
import ProfileForm from './ProfileForm';
import WeeklyProgress from './WeeklyProgress';
import WeightLogger from './WeightLogger';
import NotificationSettingsComponent from './NotificationSettings';
import { UserProfile, WeightEntry, NotificationSettings } from '../types';

interface ProfileViewProps {
  onSaveProfile: (profileData: UserProfile) => void;
  initialProfile: UserProfile | null;
  weightHistory: WeightEntry[];
  onLogWeight: (weight: number) => void;
  notificationSettings: NotificationSettings | null;
  onSaveNotificationSettings: (settings: NotificationSettings) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  onSaveProfile, 
  initialProfile, 
  weightHistory, 
  onLogWeight,
  notificationSettings,
  onSaveNotificationSettings
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-900 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-slate-100 mb-6 text-center">Your Profile</h1>
        
        {initialProfile && (
          <div className="space-y-8 mb-8">
            {notificationSettings && (
                <NotificationSettingsComponent 
                    settings={notificationSettings}
                    onSave={onSaveNotificationSettings}
                />
            )}
            <WeeklyProgress weightHistory={weightHistory} />
            <WeightLogger 
              onLogWeight={onLogWeight}
              currentWeight={initialProfile.weight || ''}
            />
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-slate-100 mb-4">{initialProfile ? "Edit Details" : "Create Your Profile"}</h2>
        <ProfileForm onSave={onSaveProfile} initialProfile={initialProfile} />
      </div>
    </div>
  );
};

export default ProfileView;