
import React, { useEffect, useState } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import QuickStats from './QuickStats';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';

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
  const { getTodaysActivities, getStreakData, addScheduledActivity } = useActivity();
  const { currentDog } = useDog();

  // ----- FAVOURITES SECTION STATE -----
  const [favourites, setFavourites] = useState<any[]>([]);
  const [showDayPickerFor, setShowDayPickerFor] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Monday

  useEffect(() => {
    // Load favourites from localStorage on mount
    const saved = JSON.parse(localStorage.getItem('favouriteActivities') || '[]');
    setFavourites(saved);
  }, []);

  // Remove a favourite
  const handleRemoveFavourite = (activity: any) => {
    const updated = favourites.filter((a) => a.title !== activity.title);
    setFavourites(updated);
    localStorage.setItem('favouriteActivities', JSON.stringify(updated));
  };

  // Add to Weekly Plan using context, with day selection
  const handleAddToWeeklyPlan = (activity: any, dayOfWeek: number) => {
    // Calculate the next date for the selected day
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay >= 0
      ? dayOfWeek - currentDay
      : 7 - (currentDay - dayOfWeek);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    // Calculate ISO week number
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

    addScheduledActivity({
      activityId: activity.id,
      scheduledDate: targetDate.toISOString().split('T')[0],
      weekNumber,
      dayOfWeek,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false,
      // Remove dogId from here as it's handled by the context
    });

    setShowDayPickerFor(null);
    setSelectedDay(1);
  };

  const todaysActivities = getTodaysActivities();
  const streakData = getStreakData();

  if (!currentDog) {
    return <EmptyDashboard onAddDogOpen={onAddDogOpen} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Quick Stats */}
      <QuickStats
        activeDays={streakData.activeDays}
        completionRate={streakData.completionRate}
        currentStreak={streakData.currentStreak}
      />

      {/* Planning Cards - Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyPlannerCard />
        <WeeklyPlannerCard />
      </div>

      {/* Favourites Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Favourite Activities</h2>
        {favourites.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No favourites yet!</div>
        ) : (
          <ul className="space-y-3">
            {favourites.map((activity, i) => (
              <li
                key={i}
                className="border rounded p-3 bg-white flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{activity.title}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {activity.pillar} • {activity.difficulty} • {activity.duration} min
                  </div>
                </div>
                <div className="flex mt-2 md:mt-0 md:ml-4 space-x-2 items-center">
                  <button
                    className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
                    onClick={() => setShowDayPickerFor(activity.title)}
                  >
                    Add to Weekly Plan
                  </button>
                  {showDayPickerFor === activity.title && (
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
                        onClick={() => handleAddToWeeklyPlan(activity, selectedDay)}
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
                    onClick={() => handleRemoveFavourite(activity)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reflection Journal */}
      <ReflectionJournal />
    </div>
  );
};

export default DashboardContent;
