export class SleepUtil {
  /**
   * Sleep miliseconds
   */
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Sleep seconds
   */
  static sleepSeconds(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms * 1000));
  }
}
