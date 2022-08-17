import { EqualOperator } from './equal-operator';
import { FindOperator } from './find-operator';
/**
 * A single property handler for FindOptionsWere.
 */
export declare type FindOptionsWhereProperty<Property> =
  Property extends Promise<infer I>
    ? FindOptionsWhereProperty<NonNullable<I>>
    : Property extends Array<infer I>
    ? FindOptionsWhereProperty<NonNullable<I>>
    : // eslint-disable-next-line @typescript-eslint/ban-types
    Property extends Function
    ? never
    : Property extends Buffer
    ? Property | FindOperator<Property>
    : Property extends Date
    ? Property | FindOperator<Property>
    : Property extends object
    ?
        | FindOptionsWhere<Property>
        | FindOptionsWhere<Property>[]
        | EqualOperator<Property>
        | FindOperator<any>
        | boolean
    : Property | FindOperator<Property>;
/** :
 * Used for find operations.
 */
export declare type FindOptionsWhere<Entity> = {
  [P in keyof Entity]?: FindOptionsWhereProperty<NonNullable<Entity[P]>>;
};
