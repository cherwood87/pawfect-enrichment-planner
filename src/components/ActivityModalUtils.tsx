
import { SchedulingValidator } from '@/utils/schedulingValidation';

// Enhanced ISO week calculation
export function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

// Enhanced date calculation with validation
export function calculateScheduledDate(selectedDayOfWeek: number): { date: string; isValid: boolean; error?: string } {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  
  console.log('🗓️ [ActivityModal] Calculating scheduled date:', {
    today: today.toDateString(),
    currentDayOfWeek,
    selectedDayOfWeek,
    todayDate: today.getDate()
  });
  
  let daysUntilSelectedDay = selectedDayOfWeek - currentDayOfWeek;
  
  // If the selected day is today or in the past this week, schedule for next week
  if (daysUntilSelectedDay <= 0) {
    daysUntilSelectedDay += 7;
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilSelectedDay);
  
  const scheduledDateString = targetDate.toISOString().split('T')[0];
  
  console.log('🗓️ [ActivityModal] Calculated target date:', {
    daysUntilSelectedDay,
    targetDate: targetDate.toDateString(),
    scheduledDateString,
    targetWeekNumber: getISOWeek(targetDate)
  });
  
  // Validate the calculated date
  const validation = SchedulingValidator.validateScheduledDate(scheduledDateString);
  
  return {
    date: scheduledDateString,
    isValid: validation.isValid,
    error: validation.errors[0]
  };
}
