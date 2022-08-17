export class IServiceLocator {}

/**
 * Service Locator
 *
 */
export class ServiceLocator {
  static _instances = [];

  static register(t: any) {
    ServiceLocator._instances.push(createInstance(t));
  }

  static get<T>(): T {
    const result = ServiceLocator._instances.find(
      (i) => i instanceof IServiceLocator,
    );
    return result;
  }
}

function createInstance<T>(type: { new (): T }): T {
  return new type();
}
