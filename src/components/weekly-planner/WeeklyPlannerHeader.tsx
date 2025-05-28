
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WeekNavigator from './WeekNavigator';
import { Progress } from '@/components/ui/progress';

interface WeeklyPlannerHeaderProps {
  completedActivities: number;
  totalActivities: number;
  currentWeek: number;
  currentYear: number;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
}

const WeeklyPlannerHeader: React.FC<WeeklyPlannerHeaderProps> = ({
  completedActivities,
  totalActivities,
  currentWeek,
  currentYear,
  onNavigateWeek
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <CardHeader className="mobile-card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100">
      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg shadow-lg">
              <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            </div>
            <div>
              <CardTitle className="font-bold text-gray-800 flex items-center space-x-2">
                <span>Weekly Plan</span>
                {progressPercentage === 100 && (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Your dog's enrichment journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant="secondary" 
              className={`font-semibold px-3 py-1 ${
                completedActivities === totalActivities 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200' 
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200'
              }`}
            >
              {completedActivities}/{totalActivities}
            </Badge>
            <button
              onClick={() => navigate('/activity-library')}
              aria-label="Add activity"
              className="
                w-10 h-10 flex items-center justify-center
                rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600
                active:scale-95 transition-all duration-200
                border-2 border-white
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week Navigator */}
        <WeekNavigator 
          currentWeek={currentWeek}
          currentYear={currentYear}
          onNavigateWeek={onNavigateWeek}
        />

        {/* Enhanced Progress Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Weekly Progress
            </span>
            <span className="text-sm font-bold text-gray-800">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gray-200"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Started</span>
            <span className={progressPercentage === 100 ? 'text-green-600 font-semibold' : ''}>
              {progressPercentage === 100 ? 'Complete! 🎉' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default WeeklyPlannerHeader;
