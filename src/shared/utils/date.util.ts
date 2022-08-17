import { addDays, format, parse } from 'date-fns';
export class DateUtil {
  /**
   * Convert string to date
   * @param dateStr Date yyyy-MM-dd
   */
  static toDate(dateStr: string): Date {
    try {
      return parse(dateStr, 'yyyy-MM-dd', new Date());
    } catch (err) {
      return null;
    }
  }

  static formatIso(date: number | Date) {
    return format(date, 'yyyy-MM-dd');
  }

  static addDaysDate(date: Date, days: number): Date {
    return addDays(date, days);
  }
  /**
   * Date.now() GMT-3
   * @returns Date
   */
  static getDateGMT3Plus(): Date {
    try {
      const date = new Date();
      return new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    } catch (err) {
      return null;
    }
  }
  /**
   * Date GMT-3
   * @returns Date
   */
  static fromDateGMT3Offset(date: Date): Date {
    try {
      return new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    } catch (err) {
      return null;
    }
  }
}
