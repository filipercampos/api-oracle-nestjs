/**
 * Property to custom mapper
 */
export type IMapperProperty = {
  fromJson: (data: any) => any | any[];
};

/**
 * Mapper interface
 */
export interface IMapper {
  /**
   * Parse data from map to T
   */
  fromJson(data: any): any;
}

/**
 * Base mapper
 */
export abstract class BaseMapper<T> implements IMapper {
  /**
   * Parse data from map to T
   */
  abstract fromJson(data: any): T;

  /**
   * Parse entity from map
   */
  toPost(data: any): any {
    return data;
  }
  /**
   * Parse entity from map
   */
  toUpdate(data: any): any {
    return data;
  }
  /**
   * Parse array of entity
   */
  toArray(data: any): any {
    return data;
  }
}

/**
 * Mapper builder
 */
export class Mappper {
  /**
   * Create instance mapper from type
   */
  static create<T extends IMapperProperty>(type: { new (): T }): T {
    return new type();
  }

  /**
   * Parse data to E or Array
   *
   * If data is object parse to Object
   *
   * If data is Array parse to Array
   *
   * @returns {E | null} E or nulll
   */
  static mapper<E, T extends IMapperProperty>(
    type: { new (): T },
    data: any,
  ): E[] {
    if (!data) return null;
    const parse = new type();
    if (Array.isArray(data)) {
      return data.map((i: any) => parse.fromJson(i));
    }
    return parse.fromJson(data);
  }

  /**
   * Parse data to T of array
   *
   * @returns {E | null} E or nulll
   */
  static toArray<E, T extends IMapperProperty>(
    type: { new (): T },
    data: any,
  ): E[] {
    if (!data) return [];
    const parse = new type();
    return data.map((i: any) => parse.fromJson(i));
  }

  /**
   * Parse data to object
   */
  static mapperTo<T>(
    data: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    mapper: Function | BaseMapper<T>,
  ): T {
    if (!data) {
      return null;
    }
    if ('fromJson' in mapper) {
      return mapper.fromJson(data);
    }
    return mapper(data);
  }

  /**
   * Parse data to array
   */
  static mapperArray<T>(
    results: any[],
    // eslint-disable-next-line @typescript-eslint/ban-types
    mapper: Function | BaseMapper<T>,
  ): T[] {
    if (!results) {
      return [];
    }
    if ('fromJson' in mapper) {
      return results.map((i: any) => mapper.fromJson(i));
    }
    return results.map((i: any) => mapper(i));
  }
}
