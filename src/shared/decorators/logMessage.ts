import { applyDecorators, Logger } from '@nestjs/common'

const LogMessage1 = (cmd: string) => {
  const logger = new Logger('MessageLogger')
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const targetFunc = descriptor.value
    descriptor.value = function (...args: any[]) {
      logger.log(`Entering into Service: ${cmd}`)
      targetFunc.apply(this, args)
    }
    return descriptor
  }
}

export const LogMessage = (cmd: string) => {
  return applyDecorators(LogMessage1(cmd))
}
