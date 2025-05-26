
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Calendar, Target, Trophy, Settings, Home, Library, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import DogSelector from '@/components/DogSelector';
import DogProfile from '@/components/DogProfile';
import EnrichmentPillars from '@/components/EnrichmentPillars';
import TodaySchedule from '@/components/TodaySchedule';
import StreakTracker from '@/components/StreakTracker';
import ActivityModal from '@/components/ActivityModal';
import ChatModal from '@/components/chat/ChatModal';
import CoachButton from '@/components/chat/CoachButton';

const Index = () => {
  const { currentDog } = useDog();
  const { getStreakData, getPillarBalance } = useActivity();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user preferences from current dog's quiz results
  const userPreferences = currentDog?.quizResults?.ranking;
  
  // Get real data for stats
  const streakData = currentDog ? getStreakData() : null;
  const pillarBalance = currentDog ? getPillarBalance() : {};
  const activeDays = streakData?.weeklyProgress.filter(d => d.completed).length || 0;
  const totalActivitiesToday = Object.values(pillarBalance).reduce((sum, count) => sum + count, 0);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/app')}
                    className={isCurrentPage('/app') ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/activity-library')}
                    className={isCurrentPage('/activity-library') ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    <Library className="mr-2 h-4 w-4" />
                    <span>Activity Library</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsChatModalOpen(true)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Enrichment Coach</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                    <span className="ml-auto text-xs text-gray-400">Coming Soon</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

            {/* Floating Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
              <CoachButton onClick={() => setIsChatModalOpen(true)} />
              <Button 
                onClick={() => setIsActivityModalOpen(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </Button>
            </div>

            {/* Modals */}
            <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
              <DialogContent className="p-0 max-w-4xl max-h-[90vh]">
                <DialogTitle className="sr-only">Add Activity</DialogTitle>
                <DialogDescription className="sr-only">
                  Browse and add enrichment activities for your dog.
                </DialogDescription>
                <ActivityModal 
                  isOpen={isActivityModalOpen}
                  onClose={() => {
                    setIsActivityModalOpen(false);
                    setSelectedPillar(null);
                  }}
                  selectedPillar={selectedPillar}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
              <DialogContent className="p-0 max-w-4xl max-h-[90vh]">
                <DialogTitle className="sr-only">Enrichment Coach</DialogTitle>
                <DialogDescription className="sr-only">
                  Chat with your AI enrichment coach for personalized advice and recommendations.
                </DialogDescription>
                <ChatModal 
                  isOpen={isChatModalOpen}
                  onClose={() => setIsChatModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
