import React, { useEffect, useState } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import DailyPlannerCard from '@/components/DailyPlannerCard';
import WeeklyPlannerCard from '@/components/WeeklyPlannerCard';
import QuickStats from './QuickStats';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';

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
  const { getTodaysActivities, getStreakData } = useActivity();
  const { currentDog } = useDog();

  // ----- FAVOURITES SECTION STATE -----
  const [favourites, setFavourites] = useState<any[]>([]);
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

  // Add to Weekly Plan
  const handleAddToWeeklyPlan = (activity: any) => {
    const plan = JSON.parse(localStorage.getItem('weeklyPlan') || '[]');
    // Prevent duplicate add
    if (!plan.find((a: any) => a.title === activity.title)) {
      plan.push(activity);
      localStorage.setItem('weeklyPlan', JSON.stringify(plan));
      alert(`Added "${activity.title}" to Weekly Plan!`);
    } else {
      alert(`"${activity.title}" is already in your Weekly Plan!`);
    }
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
                <div className="flex mt-2 md:mt-0 md:ml-4 space-x-2">
                  <button
                    className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
                    onClick={() => handleAddToWeeklyPlan(activity)}
                  >
                    Add to Weekly Plan
                  </button>
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