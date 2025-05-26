
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar, Target } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WeeklyPlannerCard = () => {
  const { getStreakData, getDailyGoals, getPillarBalance } = useActivity();
  const { currentDog } = useDog();
  const isMobile = useIsMobile();
  
  if (!currentDog) return null;
  
  const streakData = getStreakData();
  const { currentStreak, bestStreak, completionRate, weeklyProgress } = streakData;
  const dailyGoals = getDailyGoals();
  const pillarBalance = getPillarBalance();

  // Calculate this week's goal progress
  const totalWeeklyGoals = Object.values(dailyGoals).reduce((sum, goal) => sum + goal, 0) * 7;
  const completedThisWeek = weeklyProgress.reduce((sum, day) => sum + day.activities, 0);
  const weeklyGoalProgress = totalWeeklyGoals > 0 ? (completedThisWeek / totalWeeklyGoals) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
            <CardTitle className="font-bold text-gray-800">Weekly Planner</CardTitle>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Flame className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-500`} />
            <span className="font-bold text-orange-600">{currentStreak} days</span>
          </div>
        </div>
        
        {/* Weekly Goal Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Weekly Goal Progress</span>
            <span className="text-sm font-medium text-gray-800">
              {completedThisWeek}/{totalWeeklyGoals}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
              style={{width: `${Math.min(weeklyGoalProgress, 100)}%`}}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mobile-space-y mobile-card pt-4">
        {/* Week Calendar */}
        <div className="grid grid-cols-7 mobile-gap">
          {weeklyProgress.map((day, index) => {
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                <div 
                  className={`${isMobile ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'} rounded-full border-2 flex items-center justify-center font-medium touch-target relative ${
                    day.completed 
                      ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 text-white' 
                      : isToday
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                >
                  {day.activities}
                  {isToday && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-3 mobile-gap pt-4 border-t border-gray-100">
          <div className="text-center p-2 rounded-lg bg-blue-50">
            <div className="flex justify-center mb-1">
              <Target className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
              {Math.round(weeklyGoalProgress)}%
            </div>
            <div className="text-xs text-gray-600">Goal Progress</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-orange-50">
            <div className="flex justify-center mb-1">
              <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>{bestStreak}</div>
            <div className="text-xs text-gray-600">Best Streak</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-green-50">
            <div className="flex justify-center mb-1">
              <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
              {weeklyProgress.filter(d => d.completed).length}/7
            </div>
            <div className="text-xs text-gray-600">Days Active</div>
          </div>
        </div>

        {/* Personalized Achievement Messages */}
        {currentStreak >= 3 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg mobile-card text-center">
            <Trophy className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-orange-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-orange-800">
              {currentStreak >= 7 ? 'Weekly Champion!' : 'Great Streak!'}
            </p>
            <p className="text-xs text-orange-600">
              {currentStreak >= 7 
                ? `${currentDog.name} is crushing enrichment goals!` 
                : `${currentDog.name} is building great habits!`
              }
            </p>
          </div>
        )}

        {/* Weekly Planning Encouragement */}
        {weeklyGoalProgress < 50 && weeklyProgress.filter(d => d.completed).length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg mobile-card text-center">
            <Target className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-blue-800">Keep Building Momentum!</p>
            <p className="text-xs text-blue-600">
              {currentDog.quizResults 
                ? `Focus on ${currentDog.quizResults.ranking[0]?.pillar} activities this week`
                : `Plan ahead to reach your weekly goals for ${currentDog.name}`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyPlannerCard;
