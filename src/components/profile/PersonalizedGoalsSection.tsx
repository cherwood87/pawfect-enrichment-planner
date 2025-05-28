
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { QuizResults } from '@/types/quiz';
import { useIsMobile } from '@/hooks/use-mobile';

interface PersonalizedGoalsSectionProps {
  currentDog: { name: string; quizResults?: QuizResults };
  goalProgress: number;
  totalCompletedToday: number;
  totalGoalsToday: number;
  topPillars?: Array<{ pillar: string }>;
  onViewResults: () => void;
}

const PersonalizedGoalsSection: React.FC<PersonalizedGoalsSectionProps> = memo(({
  currentDog,
  goalProgress,
  totalCompletedToday,
  totalGoalsToday,
  topPillars,
  onViewResults
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="mobile-card bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500`} />
        <span className="text-sm font-medium text-gray-800">Today's Goals for {currentDog.name}</span>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        Focus on <span className="font-medium">{topPillars?.[0]?.pillar}</span> and <span className="font-medium">{topPillars?.[1]?.pillar}</span> activities
      </p>
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-1 bg-white rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300" 
            style={{width: `${Math.min(goalProgress, 100)}%`}}
          ></div>
        </div>
        <span className="text-xs text-gray-600 flex-shrink-0">{totalCompletedToday}/{totalGoalsToday}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onViewResults}
        className="text-xs h-auto p-1 text-blue-600 hover:text-blue-700 touch-target"
      >
        View full results
      </Button>
    </div>
  );
});

PersonalizedGoalsSection.displayName = 'PersonalizedGoalsSection';

export default PersonalizedGoalsSection;
