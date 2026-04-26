/**
 * Utility functions for time formatting
 * Converts 24-hour format (HH:mm) to 12-hour format (h:mm AM/PM)
 */

/**
 * Format time from 24-hour format to 12-hour format with AM/PM
 * @param {string} timeString - Time in 24-hour format (HH:mm)
 * @returns {string} Time in 12-hour format (h:mm AM/PM)
 * @example
 * formatTime24to12('14:30') => '2:30 PM'
 * formatTime24to12('09:15') => '9:15 AM'
 * formatTime24to12('00:00') => '12:00 AM'
 */
const formatTime24to12 = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return 'N/A';
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 'N/A';
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${displayHour}:${paddedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
};

/**
 * Format time using Intl API with Indian locale
 * @param {string} timeString - Time in 24-hour format (HH:mm)
 * @returns {string} Formatted time in Indian locale
 */
const formatTimeWithLocale = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return 'N/A';
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 'N/A';
    }

    // Create a date object (using today's date as reference)
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);

    // Format using en-IN locale
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time with locale:', error);
    return 'N/A';
  }
};

/**
 * Format time range (e.g., "9:30 AM - 1:00 PM")
 * @param {string} startTime - Start time in 24-hour format (HH:mm)
 * @param {string} endTime - End time in 24-hour format (HH:mm)
 * @returns {string} Formatted time range
 */
const formatTimeRange = (startTime, endTime) => {
  const start = formatTime24to12(startTime);
  const end = formatTime24to12(endTime);
  
  if (start === 'N/A' || end === 'N/A') {
    return 'Time not available';
  }

  return `${start} - ${end}`;
};

/**
 * Get time period label
 * @param {string} timeString - Time in 24-hour format (HH:mm)
 * @returns {string} Period (Morning, Afternoon, Evening, Night)
 */
const getTimePeriod = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return 'Unknown';
  }

  try {
    const [hours] = timeString.split(':').map(Number);
    
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 17) return 'Afternoon';
    if (hours >= 17 && hours < 21) return 'Evening';
    return 'Night';
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Check if time is within working hours
 * @param {string} timeString - Time to check in 24-hour format (HH:mm)
 * @param {string} startTime - Working hours start in 24-hour format (HH:mm)
 * @param {string} endTime - Working hours end in 24-hour format (HH:mm)
 * @returns {boolean} True if time is within working hours
 */
const isWithinWorkingHours = (timeString, startTime, endTime) => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const timeInMinutes = hours * 60 + minutes;
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  } catch (error) {
    return false;
  }
};

export {
  formatTime24to12,
  formatTimeWithLocale,
  formatTimeRange,
  getTimePeriod,
  isWithinWorkingHours
};
