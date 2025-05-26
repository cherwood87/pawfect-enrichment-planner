
// Time conversion utilities for handling 12-hour and 24-hour formats

export const convertTo24Hour = (time12h: string): string => {
  console.log('Converting to 24-hour format:', time12h);
  
  if (!time12h || typeof time12h !== 'string') {
    console.warn('Invalid time input:', time12h);
    return '12:00';
  }

  // If already in 24-hour format (HH:MM), return as is
  if (/^\d{1,2}:\d{2}$/.test(time12h)) {
    console.log('Time already in 24-hour format:', time12h);
    return time12h;
  }

  // Handle 12-hour format (H:MM AM/PM or HH:MM AM/PM)
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    console.warn('Invalid time format:', time12h);
    return '12:00';
  }

  let [, hours, minutes, period] = match;
  let hour24 = parseInt(hours, 10);

  if (period.toUpperCase() === 'AM') {
    if (hour24 === 12) hour24 = 0;
  } else {
    if (hour24 !== 12) hour24 += 12;
  }

  const result = `${hour24.toString().padStart(2, '0')}:${minutes}`;
  console.log('Converted to 24-hour:', result);
  return result;
};

export const convertTo12Hour = (time24h: string): string => {
  console.log('Converting to 12-hour format:', time24h);
  
  if (!time24h || typeof time24h !== 'string') {
    console.warn('Invalid time input:', time24h);
    return '12:00 PM';
  }

  // If already in 12-hour format, return as is
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time24h)) {
    console.log('Time already in 12-hour format:', time24h);
    return time24h;
  }

  const match = time24h.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    console.warn('Invalid time format:', time24h);
    return '12:00 PM';
  }

  const [, hours, minutes] = match;
  let hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  const result = `${hour}:${minutes} ${period}`;
  console.log('Converted to 12-hour:', result);
  return result;
};

export const validateTimeFormat = (time: string): boolean => {
  // Check if it's valid 24-hour format (HH:MM)
  const is24Hour = /^\d{1,2}:\d{2}$/.test(time);
  // Check if it's valid 12-hour format (H:MM AM/PM)
  const is12Hour = /^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time);
  
  return is24Hour || is12Hour;
};
