
import React, { useEffect, useState } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useAuth } from '@/contexts/AuthContext';
import TodaysEnrichmentSummary from '@/components/dashboard/TodaysEnrichmentSummary';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DashboardContentProps {
  onAddDogOpen?: () => void;
  onEditDogOpen?: (dog: any) => void;
  onPillarSelect?: (pillar: string, mode?: 'daily' | 'weekly') => void;
  onChatOpen?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  onAddDogOpen,
  onEditDogOpen,
  onPillarSelect,
  onChatOpen
}) => {
  const {
    addScheduledActivity
  } = useActivity();
  const {
    currentDog
  } = useDog();
  const {
    user
  } = useAuth();
  const {
    favourites,
    isLoading: favouritesLoading,
    removeFromFavourites
  } = useFavourites(currentDog?.id || null);
  const [showDayPickerFor, setShowDayPickerFor] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const handleRemoveFavourite = async (favouriteId: string) => {
    await removeFromFavourites(favouriteId);
  };

  const handleAddToWeeklyPlan = async (activity: any, dayOfWeek: number) => {
    if (!currentDog?.id) return;

    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay >= 0 ? dayOfWeek - currentDay : 7 - (currentDay - dayOfWeek);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    const getISOWeek = (date: Date): number => {
      const target = new Date(date.valueOf());
      const dayNr = (date.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
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
        reminderEnabled: false
      });
    } catch (error) {
      console.error('Failed to add activity to Weekly Plan:', error);
    }

    setShowDayPickerFor(null);
    setSelectedDay(1);
  };

  if (!currentDog) {
    return <EmptyDashboard onAddDogOpen={onAddDogOpen} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto mobile-container mobile-space-y">
        {/* Main Dashboard Content */}
        <div className="mobile-space-y bg-slate-100">
          {/* Today's Enrichment Summary */}
          <TodaysEnrichmentSummary onChatOpen={onChatOpen} />
        </div>

        {/* Enhanced Favourites Section */}
        <div className="mb-8">
          <div className="modern-card p-6 rounded-sm bg-slate-50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-purple-800">Favourite Activities</h2>
            </div>
            
            {favouritesLoading ? (
              <div className="text-purple-600 text-center py-8 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
                Loading favourites...
              </div>
            ) : favourites.length === 0 ? (
              <div className="text-purple-600 text-center py-8 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200">
                <div className="bg-gradient-to-r from-purple-400 to-cyan-400 p-3 rounded-2xl w-16 h-16 mx-auto mb-4">
                  <svg className="w-10 h-10 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium">No favourites yet!</p>
                <p className="text-sm">Add activities to your favourites from the Activity Library or Chat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favourites.map(favourite => (
                  <div key={favourite.id} className="modern-card p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl transition-all duration-300">
                    <div className="flex-1">
                      <div className="font-semibold text-purple-800 mb-1">{favourite.title}</div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium capitalize">
                          {favourite.pillar}
                        </span>
                        <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium">
                          {favourite.difficulty}
                        </span>
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                          {favourite.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex mt-3 md:mt-0 md:ml-4 space-x-3 items-center">
                      <button className="modern-button-primary text-xs px-4 py-2" onClick={() => setShowDayPickerFor(favourite.id)}>
                        Add to Weekly Plan
                      </button>
                      {showDayPickerFor === favourite.id && (
                        <div className="flex items-center space-x-2 ml-2">
                          <select className="border-2 border-purple-300 rounded-xl px-3 py-2 text-xs bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200" value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))}>
                            {daysOfWeek.map((day, idx) => (
                              <option key={idx} value={idx}>{day}</option>
                            ))}
                          </select>
                          <button className="modern-button-secondary text-xs px-3 py-2" onClick={() => handleAddToWeeklyPlan(favourite, selectedDay)}>
                            Confirm
                          </button>
                          <button className="modern-button-outline text-xs px-3 py-2" onClick={() => setShowDayPickerFor(null)}>
                            Cancel
                          </button>
                        </div>
                      )}
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 border border-red-200" onClick={() => handleRemoveFavourite(favourite.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Journal Section */}
        <ReflectionJournal />
      </div>
    </div>
  );
};

export default DashboardContent;
