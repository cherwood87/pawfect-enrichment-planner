import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Calendar } from 'lucide-react';

interface WeeklyProgressSummaryProps {
  completedActivities: number;
  totalPlannedActivities: number;
}

export const WeeklyProgressSummary: React.FC<WeeklyProgressSummaryProps> = ({
  completedActivities,
  totalPlannedActivities
}) => {
  const progressPercentage = totalPlannedActivities > 0 
    ? Math.round((completedActivities / totalPlannedActivities) * 100) 
    : 0;

  return (
    <Card className="modern-card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">This Week's Progress</h3>
              <p className="text-sm text-green-600">Keep up the great work!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">{progressPercentage}%</p>
            <p className="text-xs text-green-600">Complete</p>
          </div>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-3 mb-3"
        />
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>{completedActivities} completed</span>
          </div>
          <span className="text-green-600">
            {totalPlannedActivities} planned
          </span>
        </div>
      </CardContent>
    </Card>
  );
};