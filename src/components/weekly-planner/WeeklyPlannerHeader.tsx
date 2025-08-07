
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trophy, Target, Grid3x3, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import DayNavigator from './DayNavigator';

interface WeeklyPlannerHeaderProps {
  completedActivities: number;
  totalActivities: number;
  currentWeek: number;
  currentYear: number;
  currentDate?: Date;
  viewMode: 'week' | 'day';
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onNavigateDay?: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: 'week' | 'day') => void;
}

const WeeklyPlannerHeader: React.FC<WeeklyPlannerHeaderProps> = ({
  completedActivities,
  totalActivities,
  currentWeek,
  currentYear,
  currentDate,
  viewMode,
  onNavigateWeek,
  onNavigateDay,
  onViewModeChange
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const progressPercentage = totalActivities > 0 ? completedActivities / totalActivities * 100 : 0;
  const isComplete = completedActivities === totalActivities && totalActivities > 0;

  return (
    <CardHeader className="bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 border-b border-purple-200 py-6 px-6">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`
            bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl shadow-lg
            ${isComplete ? 'from-emerald-500 to-cyan-500' : ''}
          `}>
            {isComplete ? <Trophy className="w-6 h-6 text-white" /> : <Calendar className="w-6 h-6 text-white" />}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-purple-800 flex items-center space-x-3">
              <span>{viewMode === 'week' ? 'Weekly Planner' : 'Daily Focus'}</span>
              {isComplete && (
                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                  Complete!
                </span>
              )}
            </CardTitle>
            <p className="text-purple-600 mt-1">
              {totalActivities > 0 ? `${completedActivities}/${totalActivities} activities completed` : 'No activities planned'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced View Toggle */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl p-1 border-2 border-purple-200 shadow-sm">
            <button
              onClick={() => onViewModeChange('day')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'day'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              {!isMobile && <span>Day</span>}
            </button>
            <button
              onClick={() => onViewModeChange('week')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'week'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              {!isMobile && <span>Week</span>}
            </button>
          </div>

          {/* Progress Badge */}
          {totalActivities > 0 && (
            <Badge className={`font-bold px-4 py-2 rounded-xl text-base ${
              isComplete 
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                : 'bg-purple-100 text-purple-700 border-2 border-purple-300'
            }`}>
              {Math.round(progressPercentage)}%
            </Badge>
          )}
          
          {/* Add Activity Button */}
          <button
            onClick={() => navigate('/activity-library')}
            className="
              flex items-center space-x-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-purple-500 to-cyan-500 text-white 
              shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-cyan-600
              transition-all duration-300 font-semibold
            "
          >
            <Plus className="w-5 h-5" />
            {!isMobile && <span>Add Activity</span>}
          </button>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      {totalActivities > 0 && (
        <div className="mb-6">
          <div className="w-full bg-white/80 backdrop-blur-sm rounded-full h-3 shadow-inner border border-purple-200">
            <div 
              className={`h-3 rounded-full transition-all duration-700 ${
                isComplete 
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                  : 'bg-gradient-to-r from-purple-400 to-cyan-400'
              }`} 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        </div>
      )}

      {/* Week indicator for week view (no navigation) or Day Navigator for day view */}
      {viewMode === 'week' ? (
        <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="text-center">
              <span className="text-lg font-bold text-purple-800 block">
                This Week (Week {currentWeek}, {currentYear})
              </span>
            </div>
          </div>
        </div>
      ) : (
        currentDate && onNavigateDay && (
          <DayNavigator 
            currentDate={currentDate} 
            onNavigateDay={onNavigateDay} 
          />
        )
      )}
    </CardHeader>
  );
};

export default WeeklyPlannerHeader;
