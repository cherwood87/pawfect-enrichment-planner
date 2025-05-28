
import React, { useEffect, useState } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useAuth } from '@/contexts/AuthContext';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import WeeklyProgressCard from '@/components/weekly-planner/WeeklyProgressCard';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';
import AuthenticatedHeader from './AuthenticatedHeader';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

interface DashboardContentProps {
  onAddDogOpen?: () => void;
  onEditDogOpen?: (dog: any) => void;
  onPillarSelect?: (pillar: string, mode?: 'daily' | 'weekly') => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  onAddDogOpen,
  onEditDogOpen,
  onPillarSelect
}) => {
  const { addScheduledActivity } = useActivity();
  const { currentDog } = useDog();
  const { user } = useAuth();
  const { favourites, isLoading: favouritesLoading, removeFromFavourites } = useFavourites(currentDog?.id || null);

  const [showDayPickerFor, setShowDayPickerFor] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const handleRemoveFavourite = async (favouriteId: string) => {
    await removeFromFavourites(favouriteId);
  };

  const handleAddToWeeklyPlan = async (activity: any, dayOfWeek: number) => {
    if (!currentDog?.id) return;
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay >= 0
      ? dayOfWeek - currentDay
      : 7 - (currentDay - dayOfWeek);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    const getISOWeek = (date: Date): number => {
      const target = new Date(date.valueOf());
      const dayNr = (date.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
      }
      return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    };
    const weekNumber = getISOWeek(targetDate);

    try {
      await addScheduledActivity({
        dogId: currentDog.id,
        activityId: activity.activity_id,
        scheduledDate: targetDate.toISOString().split('T')[0],
        scheduledTime: '',
        weekNumber,
        dayOfWeek,
        completed: false,
        notes: '',
        completionNotes: '',
        reminderEnabled: false,
      });
    } catch (error) {
      console.error('Failed to add activity to Weekly Plan:', error);
    }
    setShowDayPickerFor(null);
    setSelectedDay(1);
  };

  if (!currentDog) {
    return (
      <div>
        <AuthenticatedHeader />
        <EmptyDashboard onAddDogOpen={onAddDogOpen} />
      </div>
    );
  }

  return (
    <div>
      <AuthenticatedHeader />
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Main Dashboard Content - Full Width */}
        <div className="space-y-6">
          {/* Weekly Progress Card */}
          <WeeklyProgressCard />
          
          {/* Weekly Planner */}
          <WeeklyPlannerCard onPillarSelect={onPillarSelect} />
        </div>

        {/* Favourites Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Favourite Activities</h2>
          {favouritesLoading ? (
            <div className="text-gray-400 text-center py-4">Loading favourites...</div>
          ) : favourites.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              No favourites yet! Add activities to your favourites from the Activity Library or Chat.
            </div>
          ) : (
            <ul className="space-y-3">
              {favourites.map((favourite) => (
                <li
                  key={favourite.id}
                  className="border rounded p-3 bg-white flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold">{favourite.title}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {favourite.pillar} • {favourite.difficulty} • {favourite.duration} min
                    </div>
                  </div>
                  <div className="flex mt-2 md:mt-0 md:ml-4 space-x-2 items-center">
                    <button
                      className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
                      onClick={() => setShowDayPickerFor(favourite.id)}
                    >
                      Add to Weekly Plan
                    </button>
                    {showDayPickerFor === favourite.id && (
                      <div className="flex items-center space-x-1 ml-2">
                        <select
                          className="border rounded px-2 py-1 text-xs"
                          value={selectedDay}
                          onChange={e => setSelectedDay(Number(e.target.value))}
                        >
                          {daysOfWeek.map((day, idx) => (
                            <option key={idx} value={idx}>{day}</option>
                          ))}
                        </select>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          onClick={() => handleAddToWeeklyPlan(favourite, selectedDay)}
                        >
                          Confirm
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                          onClick={() => setShowDayPickerFor(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-600 text-xs hover:bg-red-200"
                      onClick={() => handleRemoveFavourite(favourite.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Journal Section */}
        <ReflectionJournal />
      </div>
    </div>
  );
};

export default DashboardContent;
