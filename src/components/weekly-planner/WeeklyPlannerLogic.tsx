import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWeeklyPlannerLogic } from "@/hooks/useWeeklyPlannerLogic";
import { useWeeklyPlannerNavigation } from "@/hooks/useWeeklyPlannerNavigation";
import { useWeeklyPlannerModal } from "@/hooks/useWeeklyPlannerModal";
import { useWeeklyPlannerActions } from "@/hooks/useWeeklyPlannerActions";
import WeeklyPlannerNavigation from "./WeeklyPlannerNavigation";
import WeeklyPlannerProgress from "./WeeklyPlannerProgress";
import WeeklyPlannerGrid from "./WeeklyPlannerGrid";
import WeeklyPlannerSkeleton from "./WeeklyPlannerSkeleton";
import ConsolidatedActivityModal from "@/components/modals/ConsolidatedActivityModal";
import ErrorBoundary from "@/components/ui/error-boundary";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface WeeklyPlannerLogicProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerLogic: React.FC<WeeklyPlannerLogicProps> = ({
  onPillarSelect,
}) => {
  const {
    currentWeekStartDate,
    setCurrentWeekStartDate,
    goToNextWeek,
    goToPreviousWeek,
    goToTodayWeek,
    navigateToActivityLibrary,
  } = useWeeklyPlannerNavigation();

  const { selectedActivityModal, openModal, closeModal } =
    useWeeklyPlannerModal();
  const { getActivityDetails, handleToggleCompletion, isRetrying } =
    useWeeklyPlannerActions();

  const { weeklyActivities, getDayCompletionStatus } =
    useWeeklyPlannerLogic(currentWeekStartDate);

  const handleDayCardClick = (dayIndex: number) => {
    const dayActivities = weeklyActivities.filter(
      (activity) => activity.dayOfWeek === dayIndex,
    );
    if (dayActivities.length > 0) {
      const activity = dayActivities[0];
      const activityDetails = getActivityDetails(activity.activityId);
      if (activityDetails) {
        openModal(activityDetails, activity);
      } else {
        console.error(
          "Activity details not found for activityId:",
          activity.activityId,
        );
      }
    } else {
      onPillarSelect("all");
      navigateToActivityLibrary("all");
    }
  };

  const calculateWeekCompletion = (): number => {
    const totalDays = 7;
    let completedDays = 0;
    for (let i = 0; i < totalDays; i++) {
      const { completed } = getDayCompletionStatus(i);
      if (completed) {
        completedDays++;
      }
    }
    return (completedDays / totalDays) * 100;
  };

  const weekCompletion = calculateWeekCompletion();

  return (
    <ErrorBoundary fallback={<WeeklyPlannerSkeleton />}>
      <Card className="col-span-2 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Weekly Plan
          </CardTitle>
          <CardDescription className="text-gray-600">
            Stay on track with your dog's weekly activities.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <WeeklyPlannerNavigation
            onPreviousWeek={goToPreviousWeek}
            onCurrentWeek={goToTodayWeek}
            onNextWeek={goToNextWeek}
          />

          <WeeklyPlannerProgress weekCompletion={weekCompletion} />

          <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
            <WeeklyPlannerGrid
              weeklyActivities={weeklyActivities}
              getDayCompletionStatus={getDayCompletionStatus}
              onDayCardClick={handleDayCardClick}
            />
          </Suspense>

          {isRetrying && (
            <div className="flex items-center justify-center py-2">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-sm text-muted-foreground">
                Updating activity...
              </span>
            </div>
          )}
        </CardContent>

        <ConsolidatedActivityModal
          isOpen={!!selectedActivityModal.activity}
          onClose={closeModal}
          activityDetails={selectedActivityModal.activity}
          scheduledActivity={selectedActivityModal.scheduledActivity}
          onToggleCompletion={handleToggleCompletion}
          mode="scheduled"
        />
      </Card>
    </ErrorBoundary>
  );
};

export default WeeklyPlannerLogic;
