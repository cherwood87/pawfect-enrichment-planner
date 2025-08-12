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
  const progressPercentage = totalPlannedActivities > 0 ? Math.round(completedActivities / totalPlannedActivities * 100) : 0;
  return <Card className="modern-card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      
    </Card>;
};