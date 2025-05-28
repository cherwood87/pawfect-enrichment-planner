
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Sparkles, Trophy } from 'lucide-react';
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
    <CardHeader className="mobile-card bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 border-b-2 border-purple-200">
      <div className="space-y-6">
        {/* Enhanced Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
            </div>
            <div>
              <CardTitle className="font-bold text-purple-800 flex items-center space-x-2">
                <span>Weekly Plan</span>
                {progressPercentage === 100 && (
                  <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-1 rounded-lg">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                )}
              </CardTitle>
              <p className="text-purple-600 font-medium">
                Your dog's enrichment journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              className={`font-bold px-4 py-2 rounded-2xl text-base ${
                completedActivities === totalActivities 
                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-2 border-emerald-300' 
                  : 'bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 border-2 border-purple-300'
              }`}
            >
              {completedActivities}/{totalActivities}
            </Badge>
            <button
              onClick={() => navigate('/activity-library')}
              aria-label="Add activity"
              className="
                w-12 h-12 flex items-center justify-center
                rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white 
                shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-cyan-600
                active:scale-95 transition-all duration-300
                border-2 border-white
                focus:outline-none focus:ring-4 focus:ring-purple-200
              "
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Week Navigator */}
        <WeekNavigator 
          currentWeek={currentWeek}
          currentYear={currentYear}
          onNavigateWeek={onNavigateWeek}
        />

        {/* Enhanced Progress Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-purple-800 flex items-center space-x-2">
              <span>Weekly Progress</span>
              {progressPercentage === 100 && (
                <Sparkles className="w-5 h-5 text-amber-500" />
              )}
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-4 bg-purple-100 rounded-full border border-purple-200"
            />
            {/* Gradient overlay for progress bar */}
            <div 
              className="absolute top-0 left-0 h-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 ease-out overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
            </div>
          </div>
          
          <div className="flex justify-between text-sm font-medium mt-2">
            <span className="text-purple-600">Weekly Goal</span>
            <span className={`${progressPercentage === 100 ? 'text-emerald-600 font-bold' : 'text-purple-600'}`}>
              {progressPercentage === 100 ? 'Complete! 🎉' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default WeeklyPlannerHeader;
