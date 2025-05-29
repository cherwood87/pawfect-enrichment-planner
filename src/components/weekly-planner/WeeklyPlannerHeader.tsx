
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trophy, Target, Grid3x3, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WeekNavigator from './WeekNavigator';
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
    <CardHeader className="bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 border-b border-purple-200 py-[27px] px-[21px]">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            bg-gradient-to-r from-purple-500 to-cyan-500 p-2.5 rounded-xl shadow-lg
            ${isComplete ? 'from-emerald-500 to-cyan-500' : ''}
          `}>
            {isComplete ? <Trophy className="w-5 h-5 text-white" /> : <Calendar className="w-5 h-5 text-white" />}
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-purple-800 flex items-center space-x-2">
              <span>{viewMode === 'week' ? 'Weekly Plan' : 'Daily Plan'}</span>
              {isComplete && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                  Complete!
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-purple-600">
              {totalActivities > 0 ? `${completedActivities}/${totalActivities} activities completed` : 'No activities planned'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white/60 rounded-lg p-1 border border-white/60">
            <button
              onClick={() => onViewModeChange('day')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'day'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-white/70'
              }`}
            >
              <CalendarDays className="w-3 h-3" />
              <span className={isMobile ? 'hidden' : 'block'}>Day</span>
            </button>
            <button
              onClick={() => onViewModeChange('week')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-white/70'
              }`}
            >
              <Grid3x3 className="w-3 h-3" />
              <span className={isMobile ? 'hidden' : 'block'}>Week</span>
            </button>
          </div>

          {/* Progress Badge */}
          {totalActivities > 0 && (
            <Badge className={`font-bold px-3 py-1.5 rounded-xl ${
              isComplete 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                : 'bg-purple-100 text-purple-700 border border-purple-300'
            }`}>
              {Math.round(progressPercentage)}%
            </Badge>
          )}
          
          {/* Add Activity Button */}
          <button
            onClick={() => navigate('/activity-library')}
            className="
              flex items-center space-x-2 px-4 py-2 rounded-xl
              bg-gradient-to-r from-purple-500 to-cyan-500 text-white 
              shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-cyan-600
              transition-all duration-300 font-medium
            "
          >
            <Plus className="w-4 h-4" />
            <span className={isMobile ? 'hidden' : 'block'}>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalActivities > 0 && (
        <div className="mb-4">
          <div className="w-full bg-white/60 rounded-full h-2 shadow-inner">
            <div 
              className={`h-2 rounded-full transition-all duration-700 ${
                isComplete 
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                  : 'bg-gradient-to-r from-purple-400 to-cyan-400'
              }`} 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        </div>
      )}

      {/* Navigator */}
      {viewMode === 'week' ? (
        <WeekNavigator 
          currentWeek={currentWeek} 
          currentYear={currentYear} 
          onNavigateWeek={onNavigateWeek} 
        />
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
