import { isPasswordExpired } from './helpers';

describe('LoginCredential Helpers', () => {
  describe('isPasswordExpired', () => {
    it('should return true if password was changed more than PASSWORD_EXPIRY_DAYS ago', () => {
      const oldPasswordDate = new Date();
      oldPasswordDate.setDate(oldPasswordDate.getDate() - 91); // 91 days ago (default is 90)
      
      expect(isPasswordExpired(oldPasswordDate)).toBe(true);
    });

    it('should return false if password was changed within PASSWORD_EXPIRY_DAYS', () => {
      const recentPasswordDate = new Date();
      recentPasswordDate.setDate(recentPasswordDate.getDate() - 30); // 30 days ago
      
      expect(isPasswordExpired(recentPasswordDate)).toBe(false);
    });

    it('should return false if password was just changed', () => {
      const justNowDate = new Date();
      
      expect(isPasswordExpired(justNowDate)).toBe(false);
    });

    it('should return true for passwords changed exactly PASSWORD_EXPIRY_DAYS + 1 ago', () => {
      const expiryDays = parseInt(process.env.PASSWORD_EXPIRY_DAYS ?? '90', 10);
      const exactlyExpiredDate = new Date();
      exactlyExpiredDate.setDate(exactlyExpiredDate.getDate() - (expiryDays + 1));
      
      expect(isPasswordExpired(exactlyExpiredDate)).toBe(true);
    });
  });
});
