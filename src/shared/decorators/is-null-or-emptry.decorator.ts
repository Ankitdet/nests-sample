import { ValidateIf, ValidationOptions } from 'class-validator'

export function IsNullOrEmpty(options?: ValidationOptions): PropertyDecorator {
  return function IsNullOrEmptryDecorator(
    prototype: Object,
    propertyKey: string | symbol,
  ) {
    ValidateIf(
      obj =>
        obj[propertyKey] !== '' &&
        obj[propertyKey] !== null &&
        obj[propertyKey] !== undefined,
      options,
    )(prototype, propertyKey)
  }
}
