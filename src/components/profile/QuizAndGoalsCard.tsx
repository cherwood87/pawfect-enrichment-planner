import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuizResults } from "@/types/quiz";
import { useActivity } from "@/contexts/ActivityContext";
import PersonalizedGoalsSection from "./PersonalizedGoalsSection";
import AddActivitiesSection from "./AddActivitiesSection";

interface QuizAndGoalsCardProps {
  currentDog: { name: string; quizResults?: QuizResults };
  onViewResults: () => void;
  onAddActivities: () => void;
}

const QuizAndGoalsCard: React.FC<QuizAndGoalsCardProps> = ({
  currentDog,
  onViewResults,
  onAddActivities,
}) => {
  const { getPillarBalance, getDailyGoals } = useActivity();

  const hasCompletedQuiz = !!currentDog.quizResults;

  // Memoize expensive calculations
  const {
    pillarBalance,
    dailyGoals,
    goalProgress,
    totalCompletedToday,
    totalGoalsToday,
    topPillars,
  } = useMemo(() => {
    const pillarBalance = getPillarBalance();
    const dailyGoals = getDailyGoals();

    // Calculate goal progress
    const totalGoalsToday = Object.values(dailyGoals).reduce(
      (sum, goal) => sum + goal,
      0,
    );
    const totalCompletedToday = Object.values(pillarBalance).reduce(
      (sum, completed) => sum + completed,
      0,
    );
    const goalProgress =
      totalGoalsToday > 0 ? (totalCompletedToday / totalGoalsToday) * 100 : 0;

    const topPillars = currentDog.quizResults?.ranking.slice(0, 2);

    return {
      pillarBalance,
      dailyGoals,
      goalProgress,
      totalCompletedToday,
      totalGoalsToday,
      topPillars,
    };
  }, [getPillarBalance, getDailyGoals, currentDog.quizResults?.ranking]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="mobile-card">
        {!hasCompletedQuiz ? (
          <AddActivitiesSection
            currentDog={currentDog}
            onAddActivities={onAddActivities}
          />
        ) : (
          <PersonalizedGoalsSection
            currentDog={currentDog}
            goalProgress={goalProgress}
            totalCompletedToday={totalCompletedToday}
            totalGoalsToday={totalGoalsToday}
            topPillars={topPillars}
            onViewResults={onViewResults}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuizAndGoalsCard;
