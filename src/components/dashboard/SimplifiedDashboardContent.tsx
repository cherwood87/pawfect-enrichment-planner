import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import EmptyDashboard from '@/components/EmptyDashboard';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import { useFavourites } from '@/hooks/useFavourites';

interface SimplifiedDashboardContentProps {
  onAddDogOpen?: () => void;
  onChatOpen?: () => void;
}

export const SimplifiedDashboardContent: React.FC<SimplifiedDashboardContentProps> = ({
  onAddDogOpen
}) => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { scheduledActivities, getCombinedActivityLibrary, userActivities, discoveredActivities, getActivityDetails } = useActivity();
  const { favourites, isLoading: favouritesLoading } = useFavourites(currentDog?.id || null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedFavDetails, setSelectedFavDetails] = useState<any | null>(null);

  if (!currentDog) {
    return <EmptyDashboard onAddDogOpen={onAddDogOpen} />;
  }

  const handleGetTodaysActivities = () => {
    navigate('/activity-library');
  };

  const allActivities = useMemo(() => ([
    ...getCombinedActivityLibrary(),
    ...userActivities,
    ...discoveredActivities
  ]), [getCombinedActivityLibrary, userActivities, discoveredActivities]);

  const handleOpenFavourite = (favourite: any) => {
    const details = allActivities.find(a => a.id === favourite.activity_id);
    if (details) {
      setSelectedFavDetails(details);
      setIsActivityModalOpen(true);
    }
  };

  const recentlyCompleted = useMemo(() => {
    return scheduledActivities
      .filter(a => a.completed && a.dogId === currentDog.id)
      .sort((a, b) => {
        const da = new Date(a.completedAt || a.scheduledDate).getTime();
        const db = new Date(b.completedAt || b.scheduledDate).getTime();
        return db - da;
      })
      .slice(0, 3);
  }, [scheduledActivities, currentDog.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto mobile-container mobile-space-y">

        {/* 2) Primary Call-to-Action */}
        <div className="text-center">
          <Button
            onClick={handleGetTodaysActivities}
            className="w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 hover:from-purple-600 hover:via-cyan-600 hover:to-amber-600 text-white font-semibold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] touch-target mx-0 px-[25px]"
          >
            {`Get Today's Activities for ${currentDog.name}`}
          </Button>
        </div>

        {/* 3) Your Favorite Activities (horizontal scroll) */}
        {!favouritesLoading && favourites.length > 0 && (
          <section id="favorites" aria-labelledby="favorites-heading" className="space-y-3">
            <h2 id="favorites-heading" className="text-lg font-semibold">Choose an Activity</h2>
            <div className="-mx-4 px-4 pb-2 flex gap-3 overflow-x-auto snap-x">
              {favourites.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => handleOpenFavourite(fav)}
                  className="min-w-[220px] snap-start rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all p-4 text-left"
                >
                  <div className="font-semibold line-clamp-2 mb-1">{fav.title}</div>
                  <div className="text-xs text-muted-foreground space-x-1">
                    <span className="capitalize">{fav.pillar}</span>
                    <span>•</span>
                    <span>{fav.difficulty}</span>
                    <span>•</span>
                    <span>{fav.duration} min</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 4) Recently Completed */}
        {recentlyCompleted.length > 0 && (
          <section aria-labelledby="recent-heading" className="space-y-3">
            <h2 id="recent-heading" className="text-lg font-semibold">Recently Completed</h2>
            <ul className="space-y-3">
              {recentlyCompleted.map((item) => {
                const details = getActivityDetails(item.activityId);
                const when = new Date(item.completedAt || item.scheduledDate).toLocaleDateString();
                return (
                  <li key={item.id} className="rounded-xl border bg-card text-card-foreground p-4 shadow-sm">
                    <div className="font-medium">{details?.title || 'Activity'}</div>
                    <div className="text-xs text-muted-foreground">{when}</div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Activity Details Modal */}
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
