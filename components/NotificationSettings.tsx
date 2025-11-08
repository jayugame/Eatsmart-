import React, { useState, useEffect } from 'react';
import { NotificationSettings } from '../types';
import { BellIcon } from './Icons';

interface NotificationSettingsProps {
    settings: NotificationSettings;
    onSave: (newSettings: NotificationSettings) => void;
}

const formInputClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200";

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-teal-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
    </label>
);

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({ settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleMasterToggle = async (enabled: boolean) => {
        if (enabled) {
            if (Notification.permission === 'default') {
                const requestedPermission = await Notification.requestPermission();
                setPermission(requestedPermission);
                if (requestedPermission === 'granted') {
                    updateAndSave({ ...localSettings, enabled: true });
                }
            } else if (Notification.permission === 'granted') {
                 updateAndSave({ ...localSettings, enabled: true });
            } else {
                 setPermission('denied');
            }
        } else {
            updateAndSave({ ...localSettings, enabled: false });
        }
    };
    
    const updateAndSave = (newSettings: NotificationSettings) => {
        setLocalSettings(newSettings);
        onSave(newSettings);
    };

    const handleMealTimeChange = (meal: keyof NotificationSettings['mealReminders'], time: string) => {
        const newSettings = { ...localSettings, mealReminders: { ...localSettings.mealReminders, [meal]: time } };
        updateAndSave(newSettings);
    };

    const handleWeightReminderToggle = (enabled: boolean) => {
        const newSettings = { ...localSettings, weightReminder: { ...localSettings.weightReminder, enabled } };
        updateAndSave(newSettings);
    };
    
    const handleWeightTimeChange = (time: string) => {
        const newSettings = { ...localSettings, weightReminder: { ...localSettings.weightReminder, time } };
        updateAndSave(newSettings);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
                <BellIcon className="w-6 h-6 mr-3 text-teal-400" />
                Reminders & Notifications
            </h3>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                <label className="font-semibold text-slate-300">Enable Reminders</label>
                <ToggleSwitch checked={localSettings.enabled && permission === 'granted'} onChange={handleMasterToggle} />
            </div>

            {permission === 'denied' && (
                <div className="text-center p-3 mb-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
                    <p><b>Notifications Blocked.</b> To receive reminders, please enable notifications for this site in your browser settings.</p>
                </div>
            )}

            {localSettings.enabled && permission === 'granted' && (
                <div className="space-y-4 animate-fade-in-up">
                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2">Meal Times</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Breakfast</label>
                                <input type="time" value={localSettings.mealReminders.breakfast} onChange={(e) => handleMealTimeChange('breakfast', e.target.value)} className={formInputClasses}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Lunch</label>
                                <input type="time" value={localSettings.mealReminders.lunch} onChange={(e) => handleMealTimeChange('lunch', e.target.value)} className={formInputClasses}/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Dinner</label>
                                <input type="time" value={localSettings.mealReminders.dinner} onChange={(e) => handleMealTimeChange('dinner', e.target.value)} className={formInputClasses}/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Snacks</label>
                                <input type="time" value={localSettings.mealReminders.snacks} onChange={(e) => handleMealTimeChange('snacks', e.target.value)} className={formInputClasses}/>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <h4 className="font-semibold text-slate-300 mb-2">Weight Logging</h4>
                        <div className="flex items-center justify-between">
                             <label className="block text-sm font-medium text-slate-400">Daily Reminder</label>
                             <ToggleSwitch checked={localSettings.weightReminder.enabled} onChange={handleWeightReminderToggle}/>
                        </div>
                         {localSettings.weightReminder.enabled && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reminder Time</label>
                                <input type="time" value={localSettings.weightReminder.time} onChange={(e) => handleWeightTimeChange(e.target.value)} className={formInputClasses}/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationSettingsComponent;