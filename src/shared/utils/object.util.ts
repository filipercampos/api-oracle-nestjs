export class ObjectUtil {
  static isEmpty(obj: any): boolean {
    if (
      obj && // 👈 null and undefined check
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    ) {
      return true;
    }
    return false;
  }
}
