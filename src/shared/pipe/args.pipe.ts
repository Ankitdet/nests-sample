import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { isUuid } from 'uuidv4'
import { BaseError } from '../errors'

@Injectable()
export class ArgsValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!value) {
      throw new BaseError(HttpStatus.BAD_REQUEST, 'null or emptry not allowed here')
    }
    Logger.log(metatype.name)
    return value
  }
}

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  async transform(value: any, { data }: ArgumentMetadata) {
    if (!isUuid(value)) {
      throw new BaseError(HttpStatus.BAD_REQUEST, `${data} is not valid.`)
    }
    return value
  }
}
