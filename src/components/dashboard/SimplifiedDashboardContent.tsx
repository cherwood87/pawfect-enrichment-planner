import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import EmptyDashboard from '@/components/EmptyDashboard';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import { useFavourites } from '@/hooks/useFavourites';
import { useLoginQuote } from '@/hooks/useLoginQuote';
import { Brain, Zap, Users, TreePine, Target } from 'lucide-react';

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
  const { quote } = useLoginQuote();
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

  const getPillarVisuals = (pillar: string) => {
    switch (pillar) {
      case 'mental':
        return { gradient: 'from-purple-400/90 to-purple-600/90', Icon: Brain };
      case 'physical':
        return { gradient: 'from-emerald-400/90 to-emerald-600/90', Icon: Zap };
      case 'social':
        return { gradient: 'from-cyan-400/90 to-cyan-600/90', Icon: Users };
      case 'environmental':
        return { gradient: 'from-teal-400/90 to-teal-600/90', Icon: TreePine };
      case 'instinctual':
        return { gradient: 'from-amber-400/90 to-amber-600/90', Icon: Target };
      default:
        return { gradient: 'from-purple-400/90 to-cyan-600/90', Icon: Brain };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto mobile-container mobile-space-y">

        {/* Daily Quote - placed under header, above CTA */}
        <section aria-labelledby="daily-quote-heading">
          <h2 id="daily-quote-heading" className="sr-only">Daily Inspiration</h2>
          <p className="text-center italic text-muted-foreground px-4">“{quote.text}”{quote.author && ` — ${quote.author}`}</p>
        </section>

        {/* 2) Primary Call-to-Action */}
        <div className="text-center">
          <Button
            onClick={handleGetTodaysActivities}
            className="w-full sm:w-auto mx-auto px-5 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 hover:from-purple-600 hover:via-cyan-600 hover:to-amber-600 text-primary-foreground"
          >
            {`Get Today's Activities for ${currentDog.name}`}
          </Button>
        </div>

        {/* 3) Suggested Activities (tap to start) */}
        <section aria-labelledby="suggested-heading" className="space-y-3">
          <h2 id="suggested-heading" className="text-lg font-semibold">Suggestions for Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allActivities.slice(0,6).map((act) => {
              const { gradient, Icon } = getPillarVisuals(act.pillar);
              return (
                <button
                  key={act.id}
                  onClick={() => { setSelectedFavDetails(act); setIsActivityModalOpen(true); }}
                  className={`relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02] text-left`}
                  aria-label={`Open ${act.title}`}
                >
                  <Icon className="absolute -right-3 -top-3 w-16 h-16 text-white/30" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <div className="text-white font-semibold leading-tight line-clamp-2">{act.title}</div>
                    <div className="text-white/80 text-xs capitalize">{act.pillar} • {act.duration} min</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4) Your Favorite Activities (horizontal scroll) */}
        {!favouritesLoading && favourites.length > 0 && (
          <section id="favorites" aria-labelledby="favorites-heading" className="space-y-3">
            <h2 id="favorites-heading" className="text-lg font-semibold">Choose an Activity</h2>
            <div className="-mx-4 px-4 pb-2 flex gap-3 overflow-x-auto snap-x">
              {favourites.map((fav) => {
                const { gradient, Icon } = getPillarVisuals(fav.pillar);
                return (
                  <button
                    key={fav.id}
                    onClick={() => handleOpenFavourite(fav)}
                    className={`min-w-[180px] snap-start rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02] relative`}
                    aria-label={`Open ${fav.title}`}
                  >
                    <Icon className="absolute -right-3 -top-3 w-16 h-16 text-white/30" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <div className="text-white font-semibold line-clamp-2 mb-0.5">{fav.title}</div>
                      <div className="text-white/80 text-[10px] capitalize">
                        {fav.pillar} • {fav.difficulty} • {fav.duration} min
                      </div>
                    </div>
                  </button>
                );
              })}
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
