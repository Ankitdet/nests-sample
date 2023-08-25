import { BadRequestException } from '@nestjs/common/exceptions'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import 'reflect-metadata'

export function ValidateArgs(target: any, key: string, descriptor: PropertyDescriptor) {
  const targetMethod = descriptor.value
  const types = Reflect.getMetadata('design:paramtypes', target, key)

  descriptor.value = function (...args: any) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      const argType = types[i]

      const transformedArg = plainToInstance(argType, arg)
      Object.assign(arg, transformedArg)

      const validationErrors = validateSync(transformedArg)

      if (validationErrors.length) {
        const errorMessages = validationErrors.map(e => e.toString())
        throw new BadRequestException(errorMessages)
      }
    }
    return targetMethod.apply(this, args)
  }

  return descriptor
}
