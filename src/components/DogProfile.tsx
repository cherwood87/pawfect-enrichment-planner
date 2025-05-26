
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Brain, Trophy } from 'lucide-react';
import { QuizResults } from '@/types/quiz';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DogProfileQuiz from './DogProfileQuiz';
import QuizResultsComponent from './QuizResults';
import DogAvatarBlock from './DogAvatarBlock';
import { Dog } from '@/types/dog';

interface DogProfileProps {
  onEditDogOpen: (dog: Dog) => void;
}

const DogProfile: React.FC<DogProfileProps> = ({ onEditDogOpen }) => {
  const { currentDog, updateDog } = useDog();
  const { getPillarBalance, getDailyGoals } = useActivity();
  const isMobile = useIsMobile();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!currentDog) {
    return null;
  }

  const handleQuizComplete = (results: QuizResults) => {
    updateDog({
      ...currentDog,
      quizResults: results
    });
    setShowQuiz(false);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setShowQuiz(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  const handleEditClick = () => {
    onEditDogOpen(currentDog);
  };

  const topPillars = currentDog.quizResults?.ranking.slice(0, 2);
  const hasCompletedQuiz = !!currentDog.quizResults;
  const pillarBalance = getPillarBalance();
  const dailyGoals = getDailyGoals();

  // Calculate goal progress
  const totalGoalsToday = Object.values(dailyGoals).reduce((sum, goal) => sum + goal, 0);
  const totalCompletedToday = Object.values(pillarBalance).reduce((sum, completed) => sum + completed, 0);
  const goalProgress = totalGoalsToday > 0 ? (totalCompletedToday / totalGoalsToday) * 100 : 0;

  return (
    <>
      {/* Enhanced Dog Avatar Block */}
      <DogAvatarBlock 
        dog={currentDog}
        onEditClick={handleEditClick}
      />

      {/* Quiz and Goals Section */}
      <Card className="overflow-hidden">
        <CardContent className="mobile-card">
          {/* Quiz Section */}
          {!hasCompletedQuiz ? (
            <div className="mobile-card bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <div className={`flex items-center ${isMobile ? 'flex-col space-y-3 text-center' : 'space-x-3'}`}>
                <Brain className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-purple-600 flex-shrink-0`} />
                <div className={`${isMobile ? 'text-center' : 'flex-1'}`}>
                  <p className="text-sm font-medium text-gray-800">Discover {currentDog.name}'s Personality</p>
                  <p className="text-xs text-gray-600">Take our quiz for personalized recommendations</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowQuiz(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 touch-target flex-shrink-0"
                >
                  Take Quiz
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Personalized Goals */}
              <div className="mobile-card bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500`} />
                  <span className="text-sm font-medium text-gray-800">Today's Goals for {currentDog.name}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Focus on <span className="font-medium">{topPillars?.[0]?.pillar}</span> and <span className="font-medium">{topPillars?.[1]?.pillar}</span> activities
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${Math.min(goalProgress, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0">{totalCompletedToday}/{totalGoalsToday}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(true)}
                  className="text-xs h-auto p-1 text-blue-600 hover:text-blue-700 touch-target"
                >
                  View full results
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Dog Personality Quiz</DialogTitle>
          <DialogDescription className="sr-only">
            Take a quiz to discover your dog's personality and get personalized enrichment recommendations.
          </DialogDescription>
          <div className="modal-scroll-container">
            <DogProfileQuiz 
              dogName={currentDog.name}
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Quiz Results</DialogTitle>
          <DialogDescription className="sr-only">
            View your dog's personality quiz results and enrichment recommendations.
          </DialogDescription>
          <div className="modal-scroll-container">
            {currentDog.quizResults && (
              <QuizResultsComponent 
                results={currentDog.quizResults}
                onRetakeQuiz={handleRetakeQuiz}
                onClose={handleCloseResults}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DogProfile;
