
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Target, Trophy, Settings } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import DogSelector from '@/components/DogSelector';
import DogProfile from '@/components/DogProfile';
import EnrichmentPillars from '@/components/EnrichmentPillars';
import TodaySchedule from '@/components/TodaySchedule';
import StreakTracker from '@/components/StreakTracker';
import ActivityModal from '@/components/ActivityModal';

const Index = () => {
  const { currentDog } = useDog();
  const { getStreakData, getPillarBalance } = useActivity();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Get user preferences from current dog's quiz results
  const userPreferences = currentDog?.quizResults?.ranking;
  
  // Get real data for stats
  const streakData = currentDog ? getStreakData() : null;
  const pillarBalance = currentDog ? getPillarBalance() : {};
  const activeDays = streakData?.weeklyProgress.filter(d => d.completed).length || 0;
  const totalActivitiesToday = Object.values(pillarBalance).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-screen-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐕</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Beyond Busy Dog Enrichment Planner</h1>
              <h1 className="text-lg font-bold text-gray-800 sm:hidden">Dog Enrichment</h1>
            </div>
            <div className="flex items-center space-x-2">
              <DogSelector />
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Show dog profile only if there's a current dog */}
        {currentDog && (
          <>
            {/* Dog Profile Section */}
            <DogProfile />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center">
                <CardContent className="pt-4 pb-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-bold text-gray-800">{activeDays}</span>
                    <span className="text-xs text-gray-600">Days Active</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4 pb-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="text-lg font-bold text-gray-800">{streakData?.completionRate || 0}%</span>
                    <span className="text-xs text-gray-600">Goals Met</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-4 pb-3">
                  <div className="flex flex-col items-center space-y-1">
                    <Trophy className="w-5 h-5 text-orange-500" />
                    <span className="text-lg font-bold text-gray-800">{streakData?.currentStreak || 0}</span>
                    <span className="text-xs text-gray-600">Streak</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <TodaySchedule />

            {/* Enrichment Pillars */}
            <EnrichmentPillars 
              onPillarSelect={(pillar) => {
                setSelectedPillar(pillar);
                setIsActivityModalOpen(true);
              }}
              userPreferences={userPreferences}
            />

            {/* Streak Tracker */}
            <StreakTracker />

            {/* Quick Add Button */}
            <div className="fixed bottom-6 right-6">
              <Button 
                onClick={() => setIsActivityModalOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </Button>
            </div>

            {/* Activity Modal */}
            <ActivityModal 
              isOpen={isActivityModalOpen}
              onClose={() => {
                setIsActivityModalOpen(false);
                setSelectedPillar(null);
              }}
              selectedPillar={selectedPillar}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
