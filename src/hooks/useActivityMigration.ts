
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { ActivityService } from '@/services/activityService';
import { Dog } from '@/types/dog';

export const useActivityMigration = (
  currentDog: Dog | null,
  setScheduledActivities: (activities: ScheduledActivity[]) => void,
  setUserActivities: (activities: UserActivity[]) => void,
  migrateScheduledActivity: (activity: any) => ScheduledActivity
) => {
  const loadAndMigrateScheduledActivities = async () => {
    if (!currentDog) return;

    const savedScheduled = localStorage.getItem(`scheduledActivities-${currentDog.id}`);
    if (savedScheduled) {
      const parsedActivities = JSON.parse(savedScheduled);
      const migratedActivities = parsedActivities.map(migrateScheduledActivity);
      setScheduledActivities(migratedActivities);
      
      // Migrate to Supabase in background
      try {
        await ActivityService.migrateScheduledActivitiesFromLocalStorage(currentDog.id);
        console.log('Scheduled activities migrated to Supabase');
      } catch (error) {
        console.error('Failed to migrate scheduled activities:', error);
      }
    } else {
      // Initialize with default activities for new dogs
      const defaultActivities: ScheduledActivity[] = [
        {
          id: 'scheduled-1',
          dogId: currentDog.id,
          activityId: 'physical-morning-walk',
          scheduledTime: '8:00 AM',
          userSelectedTime: '8:00 AM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        },
        {
          id: 'scheduled-2',
          dogId: currentDog.id,
          activityId: 'mental-puzzle-feeder',
          scheduledTime: '12:00 PM',
          userSelectedTime: '12:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        },
        {
          id: 'scheduled-3',
          dogId: currentDog.id,
          activityId: 'environmental-new-route',
          scheduledTime: '3:00 PM',
          userSelectedTime: '3:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false,
          notes: '',
          completionNotes: '',
          reminderEnabled: false
        }
      ];
      setScheduledActivities(defaultActivities);
    }
  };

  const loadAndMigrateUserActivities = async () => {
    if (!currentDog) return;

    const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
    if (savedUser) {
      const parsedActivities = JSON.parse(savedUser);
      setUserActivities(parsedActivities);
      
      // Migrate to Supabase in background
      try {
        await ActivityService.migrateUserActivitiesFromLocalStorage(currentDog.id);
        console.log('User activities migrated to Supabase');
      } catch (error) {
        console.error('Failed to migrate user activities:', error);
      }
    } else {
      setUserActivities([]);
    }
  };

  return {
    loadAndMigrateScheduledActivities,
    loadAndMigrateUserActivities
  };
};
