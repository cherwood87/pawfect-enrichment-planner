
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Target, Trophy } from 'lucide-react';

interface QuickStatsProps {
  activeDays: number;
  completionRate: number;
  currentStreak: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  activeDays, 
  completionRate, 
  currentStreak 
}) => {
  return (
    <div className="grid grid-cols-3 mobile-gap">
      <Card className="text-center">
        <CardContent className="mobile-card">
          <div className="flex flex-col items-center space-y-1">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="text-base sm:text-lg font-bold text-gray-800">{activeDays}</span>
            <span className="text-xs text-gray-600">Days Active</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="mobile-card">
          <div className="flex flex-col items-center space-y-1">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <span className="text-base sm:text-lg font-bold text-gray-800">{completionRate}%</span>
            <span className="text-xs text-gray-600">Goals Met</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="mobile-card">
          <div className="flex flex-col items-center space-y-1">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="text-base sm:text-lg font-bold text-gray-800">{currentStreak}</span>
            <span className="text-xs text-gray-600">Streak</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
