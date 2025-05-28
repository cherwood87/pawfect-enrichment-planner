
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WeekNavigator from './WeekNavigator';

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
      </div>
    </CardHeader>
  );
};

export default WeeklyPlannerHeader;
