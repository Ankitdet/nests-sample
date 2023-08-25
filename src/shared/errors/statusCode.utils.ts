export const errorMessages = {
  success: {
    'EVT-001': 'Event created successfully',
    'EVT-002': 'Event Fetched successfully',
  },
  error: {
    'EVT-001': 'Error occurred in events',
    'FNF-001': 'Only image files are allowed in request.',
    'S3-001': 'Max 20 images allowed to get presigned url.',
    'ONFIDO-001': 'Onfido applicant id is already created.',
    RE: {
      'RE-001': 'Token Id not found for the real estate having id :',
      'RE-002': 'Real Estate not found for the id: ',
      'RE-003': 'You haven\'t created financial data for given property ',
    },
    USER: {
      'USER-001': 'User not found for given user_id: ',
      'USER-002': 'Ethereum address or kyc not found for user:',
    },
  },
  '422': `The request coundn't be understood by the server due to malformed syntax`,
  '400':
    'The request was malformed, the data sent by the client to server didn`t follow the rules.',
  '404': `Sorry !! we counldn't find request resource`,
  '409': 'Request resource already exists',
  '500':
    'Please contact the server administrator and inform them of the time this error occurred, and actions you performed just before this error',
}

export const commonStatusMessages = {
  '400': 'Bad Request',
  '409': 'Conflict',
  '404': 'Not Found',
  '500': 'Internal Server Error',
  '422': 'Unprocessable Entity',
}
