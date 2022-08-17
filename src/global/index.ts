import { UnprocessableEntityException } from '@nestjs/common';

/**
 * Handle business rule
 */
export function handleEntity(message: string, result?: any) {
  if (!result) {
    throw new UnprocessableEntityException([message]);
  }
}

interface IActivatable {
  key: string;
  value: any;
}

export function activator<T extends IActivatable>(type: { new (): T }): T {
  return new type();
}
