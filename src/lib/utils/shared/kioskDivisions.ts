// Client-safe division metadata for the per-line-of-business kiosk pages/routes.
// Kept separate from lib/db/models (which wires up a live DB connection on import)
// so this can be imported from client-side code without pulling that in.
export type KioskDivisionSlug = 'public-parking' | 'employee-parking' | 'ground-transportation';

export type KioskDivision = {
  slug: KioskDivisionSlug;
  // Must match a Division.name value in the database (see DefaultDivisions).
  name: string;
};

export const kioskDivisions: KioskDivision[] = [
  {slug: 'public-parking', name: 'Public Parking'},
  {slug: 'employee-parking', name: 'Employee Parking'},
  {slug: 'ground-transportation', name: 'Ground Transportation'}
];

export const getKioskDivisionBySlug = (slug: string): KioskDivision | undefined =>
  kioskDivisions.find(division => division.slug === slug);
