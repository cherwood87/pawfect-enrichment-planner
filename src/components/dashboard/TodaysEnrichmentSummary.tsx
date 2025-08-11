import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Target, CheckCircle, MessageCircle, Eye, Quote, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import ChatModal from '@/components/chat/ChatModal';
import { ActivityHelpContext } from '@/types/activityContext';
import { useDailyQuote } from '@/hooks/useDailyQuote';
interface TodaysEnrichmentSummaryProps {
  onChatOpen?: () => void;
}
const TodaysEnrichmentSummary: React.FC<TodaysEnrichmentSummaryProps> = ({
  onChatOpen
}) => {
  const navigate = useNavigate();
  const {
    currentDog
  } = useDog();
  const {
    scheduledActivities,
    getCombinedActivityLibrary,
    userActivities,
    discoveredActivities,
    updateScheduledActivity
  } = useActivity();
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ActivityHelpContext | null>(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter activities for today and current dog
  const todaysActivities = scheduledActivities.filter(activity => activity.dogId === currentDog?.id && activity.scheduledDate === today);
  const getActivityDetails = useCallback((activityId: string) => {
    const allActivities = [...getCombinedActivityLibrary(), ...userActivities, ...discoveredActivities];
    return allActivities.find(activity => activity.id === activityId);
  }, [getCombinedActivityLibrary, userActivities, discoveredActivities]);

  // Daily rotating quote for empty state
  const { quote, shuffleNow } = useDailyQuote();

  const handleToggleCompletion = useCallback(async (activityId: string, completionNotes?: string) => {
    const activity = todaysActivities.find(a => a.id === activityId);
    if (!activity) return;
    try {
      await updateScheduledActivity(activityId, {
        completed: !activity.completed,
        completionNotes: completionNotes || '',
        completedAt: !activity.completed ? new Date().toISOString() : undefined
      });
    } catch (error) {
      console.error('Error toggling activity completion:', error);
    }
  }, [todaysActivities, updateScheduledActivity]);
  const handleViewDetails = useCallback((activity: ScheduledActivity) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  }, []);
  const handleNeedHelp = useCallback((activity: ScheduledActivity, activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity) => {
    const context: ActivityHelpContext = {
      type: 'activity-help',
      activityName: activityDetails.title,
      activityPillar: activityDetails.pillar,
      activityDifficulty: activityDetails.difficulty,
      activityDuration: activityDetails.duration
    };
    setChatContext(context);
    setIsChatModalOpen(true);
  }, []);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'mental':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'physical':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'social':
        return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      case 'environmental':
        return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'instinctual':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  if (!currentDog) {
    return null;
  }
  return <>
      <div className="modern-card p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-800">Today's Enrichment Summary</h2>
            <p className="text-sm text-purple-600">
              {todaysActivities.length === 0 ? "No activities scheduled for today" : `${todaysActivities.filter(a => a.completed).length} of ${todaysActivities.length} activities completed`}
            </p>
          </div>
        </div>

        {todaysActivities.length === 0 ? (
            <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200">
              <div className="bg-gradient-to-r from-purple-400 to-cyan-400 p-3 rounded-2xl w-16 h-16 mx-auto mb-4">
                <Quote className="w-10 h-10 text-white mx-auto" />
              </div>

              <figure className="max-w-prose mx-auto">
                <blockquote className="text-base md:text-lg text-purple-700 italic">“{quote.text}”</blockquote>
                {quote.author && (
                  <figcaption className="mt-2 text-sm text-purple-600">— {quote.author}</figcaption>
                )}
              </figure>

              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={shuffleNow}
                  className="rounded-2xl border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Shuffle className="w-4 h-4 mr-2" /> New quote
                </Button>
                <Button
                  onClick={() => navigate('/activity-library')}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Browse Activity Library
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
            {todaysActivities.map(activity => {
          const activityDetails = getActivityDetails(activity.activityId);
          if (!activityDetails) return null;
          return <div key={activity.id} className={`modern-card p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${activity.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-white border-2 border-purple-200 hover:border-purple-300'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-800 mb-2 ${activity.completed ? 'line-through opacity-70' : ''}`}>
                        {activityDetails.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={`text-xs border font-semibold ${getPillarColor(activityDetails.pillar)}`}>
                          {activityDetails.pillar}
                        </Badge>
                        <Badge className={`text-xs border font-semibold ${getDifficultyColor(activityDetails.difficulty)}`}>
                          {activityDetails.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{activityDetails.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Star className="w-3 h-3" />
                          <span>{activityDetails.energyLevel}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleToggleCompletion(activity.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${activity.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 hover:border-green-400'}`} aria-label={activity.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                      {activity.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-3 border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700 mb-1">Emotional goals:</p>
                      <p className="text-xs text-purple-600">
                        {activityDetails.emotionalGoals.slice(0, 2).join(', ')}
                        {activityDetails.emotionalGoals.length > 2 ? '...' : ''}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-50 to-amber-50 rounded-xl p-3 border border-cyan-200">
                      <p className="text-xs font-semibold text-cyan-700 mb-1">Materials needed:</p>
                      <p className="text-xs text-cyan-600">
                        {activityDetails.materials.slice(0, 2).join(', ')}
                        {activityDetails.materials.length > 2 ? '...' : ''}
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(activity)} className="flex-1 rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleNeedHelp(activity, activityDetails)} className="flex-1 rounded-xl border-cyan-300 text-cyan-700 hover:bg-cyan-50">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Need Help?
                      </Button>
                    </div>
                  </div>

                  {activity.completed && activity.completionNotes && <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700">
                        <strong>Completion notes:</strong> {activity.completionNotes}
                      </p>
                    </div>}
                </div>;
        })}
          </div>)}

        <div className="mt-6 pt-4 border-t border-purple-200">
          <Button onClick={() => navigate('/app#favorites')} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Calendar className="w-4 h-4 mr-2" />
            View Favorites
          </Button>
        </div>
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && <ConsolidatedActivityModal isOpen={isActivityModalOpen} onClose={() => {
      setIsActivityModalOpen(false);
      setSelectedActivity(null);
    }} activityDetails={getActivityDetails(selectedActivity.activityId)} scheduledActivity={selectedActivity} onToggleCompletion={handleToggleCompletion} mode="scheduled" />}

      {/* Chat Modal */}
      <ChatModal isOpen={isChatModalOpen} onClose={() => {
      setIsChatModalOpen(false);
      setChatContext(null);
    }} chatContext={chatContext} />
    </>;
};
export default TodaysEnrichmentSummary;