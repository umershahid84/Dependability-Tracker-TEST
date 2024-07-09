export const validateLeaveTypeReason = (reason: string): boolean => {
  if (!reason) {
    throw new Error('Reason is required');
  }
  if (typeof reason !== 'string') {
    throw new Error('Reason must be a string');
  }
  if (reason.length < 5 || reason.length > 100) {
    throw new Error('Reason must be between 5 and 100 characters');
  }

  return true;
};
