export class EnumUtil {
  static findByValue(o: Record<string, any>, value: any) {
    //   /**
    //    ```
    //     // ✅ For NUMERIC Enums
    //     enum NumericEnum {
    //       Small,
    //       Medium,
    //       Large,
    //     }
    //    ```
    //    */
    //   const values = Object.values(o).filter((v) => !isNaN(Number(v)));
    //   // log(values); // 👉️ ['0', '1', '2']
    //   return values.find((i) => i === value);
    // }
    return o[value];
  }

  static findByKey(o: Record<string, any>, key: any) {
    //   /**
    //    *  //  For STRING Enums
    //    *  enum StringEnum {
    //    *    Small = 'S',
    //    *    Medium = 'M',
    //    *    Large = 'L',
    //    *  }
    //    */
    //   const keys = Object.keys(o).filter((v) => isNaN(Number(v)));
    //   //keys 👉️ ['Small', 'Medium', 'Large']
    //   //values 👉️ ['0', '1', '2']
    //   return keys.find((i) => i === key);
    // }
    return o[key];
  }

  static getFromOther(
    o: Record<string, unknown>,
    oDesc: Record<string, unknown>,
  ) {
    const keys = Object.keys(o);
    return keys.find((i) => i === oDesc[i]);
  }

  static toEnumerator<T>(o: Record<string, unknown>) {
    const classKeys = Reflect.ownKeys(o);
    const properties = [];
    for (const key of classKeys) {
      if (key != 'length' && key != 'prototype' && key != 'name') {
        const enumObj = Reflect.get(o, key) as T;
        if (enumObj) {
          properties.push(enumObj);
        }
      }
    }
    return properties;
  }
}
