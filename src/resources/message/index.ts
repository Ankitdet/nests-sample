import MesssageFormat from 'messageformat'
import ErrorMessage from './error-message.json'
import SuccessMessage from './success-message.json'

export const ErrorMsg = (code: string, json?: any) => {
  const message = new MesssageFormat('en')
  const varMessage = message.compile(ErrorMessage[code])
  return varMessage(json) // 'His name is Jed.'
}

export const SuccessMsg = (code: string, json?: any) => {
  const message = new MesssageFormat('en')
  const varMessage = message.compile(SuccessMessage[code])
  return varMessage(json) // 'His name is Jed.'
}
