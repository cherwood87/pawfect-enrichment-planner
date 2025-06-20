import { useState, useCallback, useMemo } from "react";
import { useActivity } from "@/contexts/ActivityContext";
import { useDog } from "@/contexts/DogContext";
import { toast } from "@/hooks/use-toast";
import { ActivityLibraryItem, UserActivity } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { calculateScheduledDate } from "@/components/ActivityModalUtils";

export const useActivityModalState = (
  activityDetails:
    | ActivityLibraryItem
    | UserActivity
    | DiscoveredActivity
    | null,
  onClose: () => void,
) => {
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(1); // Monday
  const [isScheduling, setIsScheduling] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { addScheduledActivity } = useActivity();
  const { currentDog } = useDog();

  // Memoized handlers to prevent re-renders
  const handleNeedHelp = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const handleScheduleActivity = useCallback(async () => {
    if (!activityDetails || !currentDog || isScheduling) return;

    setIsScheduling(true);
    try {
      const dateResult = calculateScheduledDate(selectedDayOfWeek);

      if (!dateResult.isValid) {
        toast({
          title: "Invalid Date",
          description:
            dateResult.error || "Cannot schedule for the selected date",
          variant: "destructive",
        });
        return;
      }

      const scheduledActivityData = {
        dogId: currentDog.id,
        activityId: activityDetails.id,
        scheduledDate: dateResult.date,
        completed: false,
        notes: "",
        completionNotes: "",
        reminderEnabled: false,
        weekNumber: dateResult.weekNumber,
        dayOfWeek: selectedDayOfWeek,
      };

      await addScheduledActivity(scheduledActivityData);

      toast({
        title: "Activity Scheduled!",
        description: `"${activityDetails.title}" has been added to your weekly plan.`,
        variant: "default",
      });

      onClose();
    } catch (error) {
      console.error("Error scheduling activity:", error);
      toast({
        title: "Failed to Schedule",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  }, [
    activityDetails,
    currentDog,
    selectedDayOfWeek,
    isScheduling,
    addScheduledActivity,
    onClose,
  ]);

  const handleAddToFavourites = useCallback(async () => {
    if (!activityDetails || isFavouriting) return;

    setIsFavouriting(true);
    try {
      // TODO: Implement favourites functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Added to Favourites!",
        description: `"${activityDetails.title}" has been added to your favourites.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding to favourites:", error);
      toast({
        title: "Failed to Add to Favourites",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsFavouriting(false);
    }
  }, [activityDetails, isFavouriting]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      selectedDayOfWeek,
      setSelectedDayOfWeek,
      isScheduling,
      isFavouriting,
      isChatOpen,
      setIsChatOpen,
      handleNeedHelp,
      handleScheduleActivity,
      handleAddToFavourites,
    }),
    [
      selectedDayOfWeek,
      isScheduling,
      isFavouriting,
      isChatOpen,
      handleNeedHelp,
      handleScheduleActivity,
      handleAddToFavourites,
    ],
  );
};
