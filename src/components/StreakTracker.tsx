
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';

const StreakTracker = () => {
  const { getStreakData } = useActivity();
  const { currentDog } = useDog();
  const isMobile = useIsMobile();
  
  if (!currentDog) return null;
  
  const streakData = getStreakData();
  const { currentStreak, bestStreak, completionRate, weeklyProgress } = streakData;

  return (
    <Card>
      <CardHeader className="mobile-card">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-gray-800">Weekly Progress</CardTitle>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Flame className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-500`} />
            <span className="font-bold text-orange-600">{currentStreak} days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mobile-space-y mobile-card pt-0">
        {/* Week Calendar */}
        <div className="grid grid-cols-7 mobile-gap">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-1">{day.day}</div>
              <div 
                className={`${isMobile ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'} rounded-full border-2 flex items-center justify-center font-medium touch-target ${
                  day.completed 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                {day.activities}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 mobile-gap pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
              {weeklyProgress.filter(d => d.completed).length}/7
            </div>
            <div className="text-xs text-gray-600">Days This Week</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>{completionRate}%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Flame className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-red-500`} />
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>{bestStreak}</div>
            <div className="text-xs text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Achievement Badge */}
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

        {/* Goal Reminder */}
        {completionRate < 50 && weeklyProgress.filter(d => d.completed).length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg mobile-card text-center">
            <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-blue-800">Keep Going!</p>
            <p className="text-xs text-blue-600">
              {currentDog.quizResults 
                ? `Focus on ${currentDog.quizResults.ranking[0]?.pillar} activities for ${currentDog.name}`
                : `Try adding more activities for ${currentDog.name}`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
