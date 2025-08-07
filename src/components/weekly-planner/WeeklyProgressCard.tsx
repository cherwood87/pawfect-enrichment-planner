
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Target } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';

const WeeklyProgressCard: React.FC = () => {
  const { scheduledActivities, getPillarBalance } = useActivity();
  const { currentDog } = useDog();

  if (!currentDog) return null;

  // Get current week's activities
  const getISOWeek = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const currentWeek = getISOWeek(new Date());
  const weekActivities = scheduledActivities.filter(activity => 
    activity.weekNumber === currentWeek && 
    activity.dogId === currentDog.id
  );

  const totalActivities = weekActivities.length;
  const completedActivities = weekActivities.filter(a => a.completed).length;
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  // Get pillar breakdown
  const pillarBalance = getPillarBalance();
  const topPillars = Object.entries(pillarBalance)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  const pillarColors = {
    mental: 'bg-purple-100 text-purple-700',
    physical: 'bg-green-100 text-green-700',
    social: 'bg-blue-100 text-blue-700',
    environmental: 'bg-teal-100 text-teal-700',
    instinctual: 'bg-orange-100 text-orange-700'
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-800">
              This Week's Progress
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Week {currentWeek}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Circular Progress */}
          <div className="flex flex-col items-center space-y-3">
            <CircularProgress value={progressPercentage} size={120}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </CircularProgress>
            
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">
                {completedActivities} of {totalActivities} activities
              </div>
              <div className="text-xs text-gray-500">
                {totalActivities - completedActivities} remaining
              </div>
            </div>
          </div>

          {/* Stats and Achievements */}
          <div className="flex-1 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Trophy className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-700">{completedActivities}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-700">{totalActivities - completedActivities}</div>
                <div className="text-xs text-blue-600">Remaining</div>
              </div>
            </div>

            {/* Top Pillars */}
            {topPillars.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {topPillars.map(([pillar, count]) => (
                    <Badge 
                      key={pillar} 
                      variant="secondary" 
                      className={`text-xs ${pillarColors[pillar as keyof typeof pillarColors] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {pillar.charAt(0).toUpperCase() + pillar.slice(1)} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Motivational Message */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="text-sm font-medium text-blue-800">
                {progressPercentage === 100 ? 
                  "🎉 Amazing work! You've completed all activities this week!" :
                  progressPercentage >= 70 ?
                  "🌟 Great progress! You're almost there!" :
                  progressPercentage >= 30 ?
                  "💪 Keep going! You're making good progress!" :
                  "🚀 Let's get started on some enrichment activities!"
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
