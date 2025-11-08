import { useEffect, useRef } from 'react';
import { NotificationSettings } from '../types';

export const useNotifications = (settings: NotificationSettings | null) => {
    const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        // Clear any previously scheduled notifications
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];

        if (!settings || !settings.enabled || Notification.permission !== 'granted') {
            return;
        }

        const scheduleDailyNotification = (title: string, body: string, timeStr: string) => {
            if (!timeStr) return;

            const [hour, minute] = timeStr.split(':').map(Number);
            
            const schedule = () => {
                const now = new Date();
                let notificationTime = new Date();
                notificationTime.setHours(hour, minute, 0, 0);

                if (notificationTime < now) {
                    notificationTime.setDate(notificationTime.getDate() + 1);
                }

                const delay = notificationTime.getTime() - now.getTime();

                const timeoutId = setTimeout(() => {
                    new Notification(title, { body });
                    // Once the notification fires, schedule it for the next day
                    schedule();
                }, delay);
                
                timeouts.current.push(timeoutId);
            };
            
            schedule();
        };

        const { mealReminders, weightReminder } = settings;

        scheduleDailyNotification('Breakfast Time!', "Time to enjoy your breakfast.", mealReminders.breakfast);
        scheduleDailyNotification('Lunch Time!', "Hope you're hungry! It's time for lunch.", mealReminders.lunch);
        scheduleDailyNotification('Dinner Time!', "Your delicious dinner is waiting.", mealReminders.dinner);
        scheduleDailyNotification('Snack Time!', "A quick snack to keep you going.", mealReminders.snacks);

        if (weightReminder.enabled) {
            scheduleDailyNotification('Weight Log Reminder', "Don't forget to log your weight today!", weightReminder.time);
        }

        return () => {
            timeouts.current.forEach(clearTimeout);
        };
    }, [settings]);
};
