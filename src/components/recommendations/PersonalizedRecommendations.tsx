
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ThumbsUp, ThumbsDown, Clock, Star } from 'lucide-react';
import { SmartRecommendation } from '@/types/learning';
import { useLearningSystem } from '@/hooks/useLearningSystem';
import { useActivity } from '@/contexts/ActivityContext';
import { RecommendationService } from '@/services/learning/RecommendationService';
import { useAuth } from '@/contexts/AuthContext';
import { useDog } from '@/contexts/DogContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PersonalizedRecommendationsProps {
  type?: 'daily' | 'weekly' | 'weather_based' | 'mood_based' | 'discovery';
  limit?: number;
  onActivitySelect?: (activityId: string) => void;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  type = 'daily',
  limit = 3,
  onActivitySelect
}) => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [userActions, setUserActions] = useState<Record<string, 'accepted' | 'rejected'>>({});
  const { getRecommendations, isLoading } = useLearningSystem();
  const { getCombinedActivityLibrary, userActivities, discoveredActivities } = useActivity();
  const { user } = useAuth();
  const { currentDog } = useDog();

  // Load recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      const recs = await getRecommendations(type, limit);
      setRecommendations(recs);
    };

    loadRecommendations();
  }, [getRecommendations, type, limit]);

  // Get activity details
  const getActivityDetails = (activityId: string) => {
    const allActivities = [...getCombinedActivityLibrary(), ...userActivities, ...discoveredActivities];
    return allActivities.find(activity => activity.id === activityId);
  };

  // Handle user feedback on recommendations
  const handleRecommendationAction = async (
    activityId: string,
    action: 'accepted' | 'rejected'
  ) => {
    if (!user || !currentDog) return;

    setUserActions(prev => ({ ...prev, [activityId]: action }));

    try {
      await RecommendationService.updateRecommendationAction(
        user.id,
        currentDog.id,
        [activityId],
        action
      );

      if (action === 'accepted' && onActivitySelect) {
        onActivitySelect(activityId);
      }
    } catch (error) {
      console.error('Failed to update recommendation action:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-2">Loading personalized recommendations...</span>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            We're learning your preferences! Complete a few activities to get personalized recommendations.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Activities tailored specifically for you and your dog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const activity = getActivityDetails(rec.activityId);
          const userAction = userActions[rec.activityId];

          if (!activity) return null;

          return (
            <div
              key={rec.activityId}
              className={`p-4 border rounded-lg transition-all ${
                userAction === 'accepted' 
                  ? 'border-green-200 bg-green-50' 
                  : userAction === 'rejected'
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{activity.title}</h4>
                    <Badge variant="outline" className="capitalize">
                      {activity.pillar}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {(rec.recommendationScore * 100).toFixed(0)}% match
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {activity.duration} min
                    </div>
                    <Badge variant="secondary" size="sm">
                      {activity.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {!userAction && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleRecommendationAction(rec.activityId, 'accepted')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Try This
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecommendationAction(rec.activityId, 'rejected')}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not Now
                      </Button>
                    </>
                  )}
                  {userAction === 'accepted' && (
                    <Badge className="bg-green-600">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Added
                    </Badge>
                  )}
                  {userAction === 'rejected' && (
                    <Badge variant="secondary">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Dismissed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
