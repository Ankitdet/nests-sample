import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // destructuring metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors))
    }
    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  private formatErrors(errors: any[]): any[] {
    const errorArray: any = []
    errors.forEach(err => {
      const constraints = []
      for (const property in err.constraints) {
        constraints.push(err.constraints[property])
      }
      errorArray.push({
        fieldName: err.property,
        error: constraints,
      })
    })
    return errorArray
  }
}
