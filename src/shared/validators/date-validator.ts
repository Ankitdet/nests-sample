// eslint-disable-next-line @typescript-eslint/no-unused-expressions
import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator'
export class CustomDateValidator implements ValidatorConstraintInterface {
  validate(date: string, _args?: ValidationArguments): boolean | Promise<boolean> {
    if (date === '0001-01-01' || date === '9999-12-31') {
      return true
    }

    if (new Date() < new Date(date)) {
      return false
    }
    throw new Error('Method not implemented.')
  }
  defaultMessage?(_validationArguments?: ValidationArguments): string {
    throw new Error('Method not implemented.')
  }
}
