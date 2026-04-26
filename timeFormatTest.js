// Test file to verify time formatting
// Run this in browser console to test

const formatTime12Hour = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    console.warn('Invalid time string:', timeString);
    return 'N/A';
  }

  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      console.warn('Invalid hours or minutes:', hours, minutes);
      return 'N/A';
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    
    const formatted = `${displayHour}:${paddedMinutes} ${ampm}`;
    console.log(`Time conversion: ${timeString} → ${formatted}`);
    
    return formatted;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
};

// Test cases
console.log('=== TIME FORMATTING TEST ===');
console.log('Test 1:', formatTime12Hour('14:30')); // Should be 2:30 PM
console.log('Test 2:', formatTime12Hour('09:15')); // Should be 9:15 AM
console.log('Test 3:', formatTime12Hour('00:00')); // Should be 12:00 AM
console.log('Test 4:', formatTime12Hour('12:00')); // Should be 12:00 PM
console.log('Test 5:', formatTime12Hour('17:30')); // Should be 5:30 PM
console.log('Test 6:', formatTime12Hour('23:59')); // Should be 11:59 PM
console.log('Test 7:', formatTime12Hour('invalid')); // Should be N/A
console.log('Test 8:', formatTime12Hour(null)); // Should be N/A
console.log('=== TEST COMPLETE ===');
