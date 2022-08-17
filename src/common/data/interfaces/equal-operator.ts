import { FindOperator } from './find-operator';
export declare class EqualOperator<T> extends FindOperator<T> {
  readonly '@instanceof': symbol;
  constructor(value: T | FindOperator<T>);
}
