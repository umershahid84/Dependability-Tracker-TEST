/**
 * Configuration utility for password expiry settings
 */

/**
 * Get the password expiry period in days from environment variable
 * @returns Number of days before a password expires (default: 90)
 */
export const getPasswordExpiryDays = (): number => {
  return parseInt(process.env.PASSWORD_EXPIRY_DAYS ?? '90', 10);
};
