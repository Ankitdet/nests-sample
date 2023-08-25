// All InputName must be end with 'Request'
// for e.g: (type)Request

export enum InputName {
  // Onfido Module
  IdNumberRequest,
  AddressOptional,
  AddressRequest,
  CreateApplicantRequest,
  CreateChecksRequest,
  UpdateIdNumberRequest,
  UpdateAddressOptional,
  UpdateAddressRequest,
  UpdateApplicantRequest,
  WebhookEventInput,
  OnfidoWebhookEventInput,
  OnfidoWorkflowRunResponseInput,

  // RE
  TokenCreateInput,
  GenerateTokenInput,
  ReAddressInput,
  DeedInput,
  ReIdInput,

  // User
  UserPermissionInput,
  UpdateCognitoUserInput,
  UserAttrInput,
  CreateWhiteListAddressInput,

  // Payments
  CreatePaymentInput,
  CreateInvoiceInput,
  CreateOrderInput,
  CreatePaymentIntentInput,
}

export const getInputName = (input: InputName) => {
  return InputName[input]
}
