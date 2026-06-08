/**
 * Credential storage utility with encryption
 * Provides methods to securely save and retrieve login credentials from localStorage
 */

// NOTE: This is basic encryption suitable for localStorage.
// For production, consider using a more robust encryption library like TweetNaCl.js or libsodium.js
// The key should ideally come from an environment variable or be derived from user input

const ENCRYPTION_KEY = 'credentialStorage_2024'; // Should be in environment variables in production

/**
 * Simple encryption function (XOR based - suitable for localStorage only)
 * For production, use a proper encryption library
 */
function encryptCredential(credential: string): string {
  let encrypted = '';
  for (let i = 0; i < credential.length; i++) {
    encrypted += String.fromCharCode(
      credential.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(encrypted); // Base64 encode
}

/**
 * Simple decryption function (XOR based)
 */
function decryptCredential(encryptedCredential: string): string {
  try {
    const encrypted = atob(encryptedCredential); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt credential:', error);
    return '';
  }
}

export const credentialStorage = {
  /**
   * Save both email and password to localStorage
   */
  saveCredentials: (email: string, password: string): void => {
    if (typeof window !== 'undefined') {
      try {
        const encryptedEmail = encryptCredential(email);
        const encryptedPassword = encryptCredential(password);

        localStorage.setItem('savedCredentials_email', encryptedEmail);
        localStorage.setItem('savedCredentials_password', encryptedPassword);
        localStorage.setItem('saveCredentials', 'true');
      } catch (error) {
        console.error('Failed to save credentials:', error);
      }
    }
  },

  /**
   * Retrieve saved credentials from localStorage
   */
  getCredentials: (): {email: string; password: string} | null => {
    if (typeof window !== 'undefined') {
      try {
        const saveCredentials = localStorage.getItem('saveCredentials') === 'true';
        if (!saveCredentials) {
          return null;
        }

        const encryptedEmail = localStorage.getItem('savedCredentials_email');
        const encryptedPassword = localStorage.getItem('savedCredentials_password');

        if (!encryptedEmail || !encryptedPassword) {
          return null;
        }

        return {
          email: decryptCredential(encryptedEmail),
          password: decryptCredential(encryptedPassword)
        };
      } catch (error) {
        console.error('Failed to retrieve credentials:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Check if credentials are saved
   */
  hasCredentials: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saveCredentials') === 'true';
    }
    return false;
  },

  /**
   * Clear saved credentials from localStorage
   */
  clearCredentials: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedCredentials_email');
      localStorage.removeItem('savedCredentials_password');
      localStorage.removeItem('saveCredentials');
    }
  }
};
