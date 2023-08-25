import { AgreementDocTimestamp } from '@utils/index'
import moment from 'moment'
import { uuid } from 'uuidv4'
import winston from 'winston'
const { combine, timestamp, printf } = winston.format

const prettyJson = printf(info => {
  if (typeof info.message === 'object') {
    info.message = JSON.stringify(info?.message)
  }
  return `${info.timestamp} [${info.level}] : ${info.message}`
})

export const logger = winston.createLogger({
  defaultMeta: { requestId: uuid() },
  format: combine(
    winston.format(info => {
      info.requestId = uuid()
      return info
    })(),
    timestamp({
      format: moment(new Date()).format(AgreementDocTimestamp),
    }),
    winston.format.json({ space: 2 }),
    prettyJson,
    winston.format.errors({ stack: true }),
  ),
  transports: [new winston.transports.Console()],
})
