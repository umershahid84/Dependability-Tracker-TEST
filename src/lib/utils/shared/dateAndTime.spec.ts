import {
  formatTime_hh_mm_ss_TZ,
  formatTimeNoSeconds_TZ,
  getTime,
  getTimeNoSeconds,
  formatTimeWithAmPm
} from './dateAndTime';

describe('dateAndTime - Military Time Format', () => {
  describe('formatTime_hh_mm_ss_TZ', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      const result = formatTime_hh_mm_ss_TZ(date, 'UTC');
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(result).not.toContain('AM');
      expect(result).not.toContain('PM');
    });

    it('should handle afternoon times correctly', () => {
      const date = new Date('2024-01-15T15:45:30Z');
      const result = formatTime_hh_mm_ss_TZ(date, 'UTC');
      expect(result).toMatch(/^(1[5-9]|2[0-3]):\d{2}:\d{2}$/);
    });

    it('should handle morning times correctly', () => {
      const date = new Date('2024-01-15T09:15:20Z');
      const result = formatTime_hh_mm_ss_TZ(date, 'UTC');
      expect(result).toMatch(/^09:\d{2}:\d{2}$/);
    });
  });

  describe('formatTimeNoSeconds_TZ', () => {
    it('should format time in 24-hour format without seconds', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      const result = formatTimeNoSeconds_TZ(date, 'UTC');
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result).not.toContain('AM');
      expect(result).not.toContain('PM');
    });
  });

  describe('getTime', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      const result = getTime(date);
      expect(result).not.toContain('AM');
      expect(result).not.toContain('PM');
    });
  });

  describe('getTimeNoSeconds', () => {
    it('should format time in 24-hour format without seconds', () => {
      const date = new Date('2024-01-15T14:30:45Z');
      const result = getTimeNoSeconds(date);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
      expect(result).not.toContain('AM');
      expect(result).not.toContain('PM');
    });
  });

  describe('formatTimeWithAmPm', () => {
    it('should convert time string to military format with zero padding', () => {
      const result = formatTimeWithAmPm('9:30');
      expect(result).toBe('09:30');
    });

    it('should handle already padded hours', () => {
      const result = formatTimeWithAmPm('14:45');
      expect(result).toBe('14:45');
    });
  });
});
