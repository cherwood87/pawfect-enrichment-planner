
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart, Edit, Brain, Trophy, Settings } from 'lucide-react';
import { QuizResults } from '@/types/quiz';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import DogProfileQuiz from './DogProfileQuiz';
import QuizResultsComponent from './QuizResults';
import EditDogForm from './EditDogForm';

const DogProfile = () => {
  const { currentDog, updateDog } = useDog();
  const { getPillarBalance, getDailyGoals } = useActivity();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

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
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
                {currentDog.image ? (
                  <img 
                    src={currentDog.image} 
                    alt={currentDog.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🐕</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">{currentDog.name}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEditForm(true)}
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{currentDog.breed} • {currentDog.age} years</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Active</Badge>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Social</Badge>
                {hasCompletedQuiz && currentDog.quizResults && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    {currentDog.quizResults.personality}
                  </Badge>
                )}
                {currentDog.mobilityIssues.length > 0 && !currentDog.mobilityIssues.includes('None') && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                    Special Needs
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Quiz Section */}
          {!hasCompletedQuiz ? (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Discover {currentDog.name}'s Personality</p>
                  <p className="text-xs text-gray-600">Take our quiz for personalized recommendations</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowQuiz(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Take Quiz
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Personalized Goals */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-800">Today's Goals for {currentDog.name}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Focus on <span className="font-medium">{topPillars?.[0]?.pillar}</span> and <span className="font-medium">{topPillars?.[1]?.pillar}</span> activities
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${Math.min(goalProgress, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{totalCompletedToday}/{totalGoalsToday}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(true)}
                  className="mt-2 text-xs h-auto p-1 text-blue-600 hover:text-blue-700"
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
        <DialogContent className="p-0 max-w-lg">
          <DogProfileQuiz 
            dogName={currentDog.name}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="p-0 max-w-lg">
          {currentDog.quizResults && (
            <QuizResultsComponent 
              results={currentDog.quizResults}
              onRetakeQuiz={handleRetakeQuiz}
              onClose={handleCloseResults}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dog Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="p-0 max-w-lg">
          <EditDogForm 
            dog={currentDog}
            onClose={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DogProfile;
