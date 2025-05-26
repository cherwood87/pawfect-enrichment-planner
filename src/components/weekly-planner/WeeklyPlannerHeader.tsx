
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WeekNavigator from './WeekNavigator';
import WeeklyProgressBar from './WeeklyProgressBar';

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

  return (
    <CardHeader className="mobile-card bg-gradient-to-r from-green-50 to-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
          <CardTitle className="font-bold text-gray-800">Weekly Plan</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="secondary" 
            className={`${
              completedActivities === totalActivities 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {completedActivities}/{totalActivities}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/activity-library')}
            className="text-green-600 hover:text-green-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <WeekNavigator 
        currentWeek={currentWeek}
        currentYear={currentYear}
        onNavigateWeek={onNavigateWeek}
      />

      <WeeklyProgressBar 
        completedActivities={completedActivities}
        totalActivities={totalActivities}
      />
    </CardHeader>
  );
};

export default WeeklyPlannerHeader;
