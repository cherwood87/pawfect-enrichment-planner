
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScheduledActivity, UserActivity, ActivityLibraryItem } from '@/types/activity';
import { activityLibrary, getActivityById } from '@/data/activityLibrary';

interface ActivityContextType {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  addScheduledActivity: (activity: Omit<ScheduledActivity, 'id'>) => void;
  toggleActivityCompletion: (activityId: string) => void;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'createdAt'>) => void;
  getTodaysActivities: () => ScheduledActivity[];
  getActivityDetails: (activityId: string) => ActivityLibraryItem | UserActivity | undefined;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedScheduled = localStorage.getItem('scheduledActivities');
    const savedUser = localStorage.getItem('userActivities');
    
    if (savedScheduled) {
      setScheduledActivities(JSON.parse(savedScheduled));
    } else {
      // Initialize with some default activities for demo
      const defaultActivities: ScheduledActivity[] = [
        {
          id: 'scheduled-1',
          activityId: 'physical-morning-walk',
          scheduledTime: '8:00 AM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: 'scheduled-2',
          activityId: 'mental-puzzle-feeder',
          scheduledTime: '12:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: 'scheduled-3',
          activityId: 'environmental-new-route',
          scheduledTime: '3:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: 'scheduled-4',
          activityId: 'instinctual-digging-box',
          scheduledTime: '6:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        }
      ];
      setScheduledActivities(defaultActivities);
    }
    
    if (savedUser) {
      setUserActivities(JSON.parse(savedUser));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('scheduledActivities', JSON.stringify(scheduledActivities));
  }, [scheduledActivities]);

  useEffect(() => {
    localStorage.setItem('userActivities', JSON.stringify(userActivities));
  }, [userActivities]);

  const addScheduledActivity = (activity: Omit<ScheduledActivity, 'id'>) => {
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setScheduledActivities(prev => [...prev, newActivity]);
  };

  const toggleActivityCompletion = (activityId: string) => {
    setScheduledActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              completed: !activity.completed,
              completedAt: !activity.completed ? new Date().toISOString() : undefined
            }
          : activity
      )
    );
  };

  const addUserActivity = (activity: Omit<UserActivity, 'id' | 'createdAt'>) => {
    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setUserActivities(prev => [...prev, newActivity]);
  };

  const getTodaysActivities = (): ScheduledActivity[] => {
    const today = new Date().toISOString().split('T')[0];
    return scheduledActivities.filter(activity => activity.scheduledDate === today);
  };

  const getActivityDetails = (activityId: string): ActivityLibraryItem | UserActivity | undefined => {
    // First check library activities
    const libraryActivity = getActivityById(activityId);
    if (libraryActivity) return libraryActivity;
    
    // Then check user activities
    return userActivities.find(activity => activity.id === activityId);
  };

  return (
    <ActivityContext.Provider
      value={{
        scheduledActivities,
        userActivities,
        addScheduledActivity,
        toggleActivityCompletion,
        addUserActivity,
        getTodaysActivities,
        getActivityDetails
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
