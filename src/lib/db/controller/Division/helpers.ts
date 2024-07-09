export const validateDivisionName = (name: string): boolean => {
  if (typeof name !== 'string') {
    throw new Error('\n❌ Division name must be a string');
  }
  if (name.length < 3) {
    throw new Error('\n❌ Division name must be at least 3 characters long');
  }
  return true;
};
