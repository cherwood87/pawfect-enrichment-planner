
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import PersonalizedRecommendations from '@/components/recommendations/PersonalizedRecommendations';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { toast } from '@/hooks/use-toast';

const SmartRecommendationsCard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { addScheduledActivity } = useActivity();
  const { currentDog } = useDog();

  const handleActivitySelect = async (activityId: string) => {
    if (!currentDog) return;

    try {
      // Schedule the activity for today
      const today = new Date();
      await addScheduledActivity({
        dogId: currentDog.id,
        activityId,
        scheduledDate: today.toISOString().split('T')[0],
        completed: false,
        notes: 'Added from personalized recommendations',
        completionNotes: '',
        reminderEnabled: false
      });

      toast({
        title: "Activity Added!",
        description: "The recommended activity has been added to your schedule.",
      });
    } catch (error) {
      console.error('Failed to add recommended activity:', error);
      toast({
        title: "Error",
        description: "Failed to add activity to schedule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>Smart Recommendations</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          AI-powered activity suggestions tailored to your dog's preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PersonalizedRecommendations 
          key={refreshKey}
          type="daily"
          limit={3}
          onActivitySelect={handleActivitySelect}
        />
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsCard;
