// Shuttle assignment options for Employee Parking employees. Client-safe (no DB import)
// so it can back both the admin employee form and the callout/kiosk display.
export const shuttleNumberOptions: string[] = [
  ...Array.from({length: 15}, (_, i) => `Shuttle ${i + 1}`),
  'Lunch Relief',
  'Fueler',
  'Express Shuttle'
];
