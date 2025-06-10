
/**
 * Centralized week calculation utilities to ensure consistency across the application
 */

export class WeekUtils {
  /**
   * Calculate ISO week number for a given date
   * This is the single source of truth for week calculations
   */
  static getISOWeek(date: Date): number {
    console.log('📅 [WeekUtils] Calculating ISO week for date:', date.toDateString());
    
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    
    console.log('📅 [WeekUtils] Calculated ISO week number:', weekNumber);
    return weekNumber;
  }

  /**
   * Get the start date of the week for a given date (Monday as start of week)
   */
  static getWeekStartDate(date: Date): Date {
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so we go back 6 days
    startDate.setDate(startDate.getDate() + diff);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  /**
   * Check if two dates are in the same ISO week
   */
  static isSameWeek(date1: Date, date2: Date): boolean {
    return this.getISOWeek(date1) === this.getISOWeek(date2) && 
           date1.getFullYear() === date2.getFullYear();
  }
}
