/**
 * Configuration utility for password expiry settings
 */

/**
 * Get the password expiry period in days from environment variable
 * @returns Number of days before a password expires (default: 90)
 * @throws Error if the value is not a positive integer
 */
export const getPasswordExpiryDays = (): number => {
  const value = parseInt(process.env.PASSWORD_EXPIRY_DAYS ?? '90', 10);
  
  if (isNaN(value) || value <= 0) {
    console.warn(`Invalid PASSWORD_EXPIRY_DAYS value: ${process.env.PASSWORD_EXPIRY_DAYS}. Using default of 90 days.`);
    return 90;
  }
  
  return value;
};
