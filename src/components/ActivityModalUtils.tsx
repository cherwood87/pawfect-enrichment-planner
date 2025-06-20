import { SchedulingValidator } from "@/utils/schedulingValidation";
import { WeekUtils } from "@/utils/weekUtils";

// Enhanced date calculation with validation and proper week scheduling
export function calculateScheduledDate(selectedDayOfWeek: number): {
  date: string;
  isValid: boolean;
  error?: string;
  weekNumber: number;
} {
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  console.log("🗓️ [ActivityModal] Calculating scheduled date:", {
    today: today.toDateString(),
    currentDayOfWeek,
    selectedDayOfWeek,
    todayDate: today.getDate(),
  });

  // Calculate days until the selected day
  let daysUntilSelectedDay = selectedDayOfWeek - currentDayOfWeek;

  // If the selected day is today or has already passed this week, schedule for next week
  // This ensures we don't schedule activities in the past or for today (since it might be late)
  if (daysUntilSelectedDay <= 0) {
    daysUntilSelectedDay += 7;
  }

  // Create target date by adding the calculated days to today
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilSelectedDay);
  targetDate.setHours(0, 0, 0, 0); // Reset time to start of day

  const scheduledDateString = targetDate.toISOString().split("T")[0];
  const weekNumber = WeekUtils.getISOWeek(targetDate);

  console.log("🗓️ [ActivityModal] Calculated target date:", {
    daysUntilSelectedDay,
    targetDate: targetDate.toDateString(),
    scheduledDateString,
    weekNumber,
    isNextWeek: daysUntilSelectedDay > 0,
    targetDayOfWeek: targetDate.getDay(),
  });

  // Validate that the calculated date actually falls on the selected day of week
  if (targetDate.getDay() !== selectedDayOfWeek) {
    console.error(
      "❌ [ActivityModal] Date calculation error: target day mismatch",
      {
        expectedDay: selectedDayOfWeek,
        actualDay: targetDate.getDay(),
        targetDate: targetDate.toDateString(),
      },
    );

    return {
      date: scheduledDateString,
      isValid: false,
      error: `Date calculation error: expected ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDayOfWeek]} but got ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][targetDate.getDay()]}`,
      weekNumber,
    };
  }

  // Validate the calculated date using existing validation
  const validation =
    SchedulingValidator.validateScheduledDate(scheduledDateString);

  return {
    date: scheduledDateString,
    isValid: validation.isValid,
    error: validation.errors[0],
    weekNumber,
  };
}

// Export for backward compatibility
export const getISOWeek = WeekUtils.getISOWeek;
