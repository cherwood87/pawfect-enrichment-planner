
import { SchedulingValidator } from '@/utils/schedulingValidation';
import { WeekUtils } from '@/utils/weekUtils';

// Enhanced date calculation with validation and proper week scheduling
export function calculateScheduledDate(selectedDayOfWeek: number): { date: string; isValid: boolean; error?: string; weekNumber: number } {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  
  console.log('🗓️ [ActivityModal] Calculating scheduled date:', {
    today: today.toDateString(),
    currentDayOfWeek,
    selectedDayOfWeek,
    todayDate: today.getDate()
  });
  
  // Calculate days until the selected day
  let daysUntilSelectedDay = selectedDayOfWeek - currentDayOfWeek;
  
  // If the selected day is today or earlier in the week, schedule for next week
  // This ensures we don't schedule activities in the past
  if (daysUntilSelectedDay <= 0) {
    daysUntilSelectedDay += 7;
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilSelectedDay);
  targetDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const scheduledDateString = targetDate.toISOString().split('T')[0];
  const weekNumber = WeekUtils.getISOWeek(targetDate);
  
  console.log('🗓️ [ActivityModal] Calculated target date:', {
    daysUntilSelectedDay,
    targetDate: targetDate.toDateString(),
    scheduledDateString,
    weekNumber,
    isNextWeek: daysUntilSelectedDay > 0
  });
  
  // Validate the calculated date
  const validation = SchedulingValidator.validateScheduledDate(scheduledDateString);
  
  return {
    date: scheduledDateString,
    isValid: validation.isValid,
    error: validation.errors[0],
    weekNumber
  };
}

// Export for backward compatibility
export const getISOWeek = WeekUtils.getISOWeek;
