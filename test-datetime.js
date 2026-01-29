// Test the new date/time functions manually
// Run with: TZ='America/Los_Angeles' node test-datetime.js

console.log('=== Testing Simplified Date/Time Logic ===\n');

// Simulate APP_TZ
const APP_TZ = () => 'America/Los_Angeles';

// Test formatDate
function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TZ(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

// Test formatTime24
function formatTime24(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TZ(),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
}

// Test formatTime12
function formatTime12(date, includeSeconds = false) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    timeZone: APP_TZ(),
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  if (includeSeconds) {
    options.second = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d);
}

// Test parseDateInput
function parseDateInput(dateString) {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const [year, month, day] = parts.map(Number);
  
  // Validate
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (year < 1900 || year > 2200) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  
  // Create date at midnight in local timezone
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  // Validate the date is valid
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  
  return date;
}

// Test parseTimeInput
function parseTimeInput(timeString) {
  if (!timeString) return null;
  
  const parts = timeString.split(':');
  if (parts.length < 2) return null;
  
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = parts.length > 2 ? Number(parts[2]) : 0;
  
  // Validate
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;
  
  return { hours, minutes, seconds };
}

// Run tests
console.log('Test 1: User in PST creates callout at Jan 28, 2026 11:59 PM');
const testDate = new Date('2026-01-29T07:59:00.000Z'); // This is Jan 28 11:59 PM PST in UTC
console.log('  UTC timestamp:', testDate.toISOString());
console.log('  formatDate():', formatDate(testDate));
console.log('  Expected: 2026-01-28');
console.log('  Match:', formatDate(testDate) === '2026-01-28' ? '✓' : '✗');
console.log();

console.log('Test 2: Display time from same timestamp');
console.log('  formatTime24():', formatTime24(testDate));
console.log('  Expected: 23:59:00');
console.log('  Match:', formatTime24(testDate) === '23:59:00' ? '✓' : '✗');
console.log();

console.log('Test 3: Display 12-hour time');
console.log('  formatTime12():', formatTime12(testDate));
console.log('  Expected: 11:59 PM');
console.log('  Match:', formatTime12(testDate) === '11:59 PM' ? '✓' : '✗');
console.log();

console.log('Test 4: Parse date input');
const parsed = parseDateInput('2026-01-28');
console.log('  Input: "2026-01-28"');
console.log('  Parsed:', parsed);
console.log('  Is valid date:', parsed instanceof Date && !isNaN(parsed.getTime()) ? '✓' : '✗');
console.log('  Date components:', `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}`);
console.log();

console.log('Test 5: Parse time input');
const parsedTime = parseTimeInput('23:59:00');
console.log('  Input: "23:59:00"');
console.log('  Parsed:', parsedTime);
console.log('  Is valid:', parsedTime && parsedTime.hours === 23 && parsedTime.minutes === 59 ? '✓' : '✗');
console.log();

console.log('Test 6: Combine date and time');
const date = parseDateInput('2026-01-28');
const time = parseTimeInput('23:59:00');
if (date && time) {
  date.setHours(time.hours, time.minutes, time.seconds, 0);
  console.log('  Combined local:', date.toString());
  console.log('  As UTC:', date.toISOString());
  console.log('  Expected UTC: 2026-01-29T07:59:00.000Z');
  console.log('  Match:', date.toISOString() === '2026-01-29T07:59:00.000Z' ? '✓' : '✗');
}
console.log();

console.log('Test 7: Shift time at 12:10 AM');
const shiftDate = new Date('2026-01-29T08:10:00.000Z'); // 12:10 AM PST on Jan 29
console.log('  UTC timestamp:', shiftDate.toISOString());
console.log('  formatDate():', formatDate(shiftDate));
console.log('  formatTime12():', formatTime12(shiftDate));
console.log('  Expected: 2026-01-29 @ 12:10 AM');
console.log('  Match:', formatDate(shiftDate) === '2026-01-29' && formatTime12(shiftDate) === '12:10 AM' ? '✓' : '✗');
console.log();

console.log('=== All Tests Complete ===');
