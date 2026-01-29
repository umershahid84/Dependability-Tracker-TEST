// Test GMT-8 timezone handling
console.log('=== Testing Fixed GMT-8 Timezone ===\n');

const APP_TZ = () => 'Etc/GMT+8';

// Test 1: Format date with GMT-8
console.log('Test 1: Date formatting with GMT-8');
const testDate = new Date('2026-01-29T07:59:00.000Z'); // 11:59 PM previous day in GMT-8
console.log('UTC timestamp:', testDate.toISOString());

const formattedDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TZ(),
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(testDate);
console.log('Formatted date (GMT-8):', formattedDate);
console.log('Expected: 2026-01-28');
console.log('Match:', formattedDate === '2026-01-28' ? '✓' : '✗');
console.log();

// Test 2: Format time with GMT-8
console.log('Test 2: Time formatting with GMT-8');
const formattedTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: APP_TZ(),
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}).format(testDate);
console.log('Formatted time (GMT-8):', formattedTime);
console.log('Expected: 23:59:00');
console.log('Match:', formattedTime === '23:59:00' ? '✓' : '✗');
console.log();

// Test 3: Format time 12-hour with GMT-8
console.log('Test 3: 12-hour time with GMT-8');
const formattedTime12 = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TZ(),
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}).format(testDate);
console.log('Formatted time (12h GMT-8):', formattedTime12);
console.log('Expected: 11:59 PM');
console.log('Match:', formattedTime12 === '11:59 PM' ? '✓' : '✗');
console.log();

// Test 4: Creating a date in local time and converting to UTC
console.log('Test 4: Local to UTC conversion');
const localDate = new Date(2026, 0, 28, 23, 59, 0); // Jan 28, 2026 11:59 PM in system time
console.log('Local date:', localDate.toString());
console.log('As UTC:', localDate.toISOString());
console.log();

// Test 5: Current time
console.log('Test 5: Current time in GMT-8');
const now = new Date();
console.log('Current UTC:', now.toISOString());
const nowGMT8 = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TZ(),
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}).format(now);
console.log('Current GMT-8:', nowGMT8);
console.log();

console.log('=== All Tests Complete ===');
