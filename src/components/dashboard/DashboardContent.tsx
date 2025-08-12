
import React, { useEffect, useState } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useAuth } from '@/contexts/AuthContext';
import TodaysEnrichmentSummary from '@/components/dashboard/TodaysEnrichmentSummary';
import ReflectionJournal from '@/components/ReflectionJournal';
import EmptyDashboard from '@/components/EmptyDashboard';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import { QuizPromptCard } from '@/components/QuizPromptCard';
import { QuizCompletionCard } from '@/components/dashboard/QuizCompletionCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DashboardContentProps {
  onAddDogOpen?: () => void;
  onEditDogOpen?: (dog: any) => void;
  onPillarSelect?: (pillar: string, mode?: 'daily' | 'weekly') => void;
  onChatOpen?: () => void;
  onTakeQuiz?: () => void;
  onViewQuizResults?: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  onAddDogOpen,
  onEditDogOpen,
  onPillarSelect,
  onChatOpen,
  onTakeQuiz,
  onViewQuizResults
}) => {
  const navigate = useNavigate();
  const {
    getCombinedActivityLibrary,
    userActivities,
    discoveredActivities
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
  const [selectedFavDetails, setSelectedFavDetails] = useState<any | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const handleRemoveFavourite = async (favouriteId: string) => {
    await removeFromFavourites(favouriteId);
  };

  const handleOpenFavourite = (favourite: any) => {
    const allActivities = [
      ...getCombinedActivityLibrary(),
      ...userActivities,
      ...discoveredActivities
    ];
    const details = allActivities.find(a => a.id === favourite.activity_id);
    if (details) {
      setSelectedFavDetails(details);
      setIsActivityModalOpen(true);
    }
  };

  if (!currentDog) {
    return <EmptyDashboard onAddDogOpen={onAddDogOpen} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto mobile-container mobile-space-y">
        {/* Main Dashboard Content */}
        <div className="mobile-space-y bg-slate-100">
          {/* Quiz Status Card */}
          {currentDog && !currentDog.quizResults && (
            <QuizPromptCard currentDog={currentDog} onTakeQuiz={onTakeQuiz || (() => {})} />
          )}
          
          {/* Quiz Completion Card */}
          {currentDog && currentDog.quizResults && (
            <QuizCompletionCard currentDog={currentDog} onViewResults={onViewQuizResults || (() => {})} />
          )}
          
          {/* Today's Enrichment Summary */}
          <TodaysEnrichmentSummary onChatOpen={onChatOpen} />
        </div>

        {/* Enhanced Favourites Section */}
        <div id="favorites" className="mb-8">
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
<div className="mt-3 flex justify-center">
  <Button
    onClick={() => navigate('/activity-library')}
    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    Add favourites
  </Button>
</div>
              </div>
            ) : (
              <div className="space-y-4">
                {favourites.map(favourite => (
                  <div 
                    key={favourite.id} 
                    className="modern-card p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleOpenFavourite(favourite)}
                  >
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
                      <button 
                        className="bg-red-100 hover:bg-red-200 text-red-600 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 border border-red-200"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFavourite(favourite.id); }}
                      >
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

        {selectedFavDetails && (
          <ConsolidatedActivityModal
            isOpen={isActivityModalOpen}
            onClose={() => { setIsActivityModalOpen(false); setSelectedFavDetails(null); }}
            activityDetails={selectedFavDetails}
            mode="library"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
