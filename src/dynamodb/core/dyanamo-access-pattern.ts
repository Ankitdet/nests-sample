export const ValueFor = {
  userId: `<userId>`,
  reId: `<reId>`,
  code: `<code>`,
  applicantId: `<applicantId>`,
  wf_run_id: `<wf_run_id>`,
  order_id: `<order_id>`,
  addressfieldindb: `<addressfieldindb>`,
  transactionHash: `<transactionHash>`,
  subId: '<subId>',
  zillowId: '<zillowId>',
}

export const StartsWith = {
  RE: '#RE',
  USER: '#USER',
  ORDER: '#ORDER',
  APPLICANT: '#APPLICANT',
  WF_RUN_ID: '#WF_RUN_ID',
  RPOP: '#PROP',
  ADDRESS: '#ADD#CITY#STATE#ZIP',
  SUB: '#SUBSCRIPTION',
  REFERRAL_CODE: '#REFERRAL_CODE',
  REFERRER_CODE: '#REFERRER_USER',
  DIGITAL_RE: '#DRE#',
  DIGITAL_DEBT: '#DEBT#',
  DIGITAL_BONDS: '#BONDS#',
  DIGITAL_ARTS: '#ARTS#',
  ZILLOW_DIGITAL_RE: '#ZILLOW_RE',
  COMPANY_SOCIALS: '#COMPANY#',
}

export const AccessPatternMatrix = () => {
  return {
    real_estate_info: {
      // Example : #RE#uuid
      pk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example : #USER#uuid
      sk: `${StartsWith.RPOP}`,
      // Example : #USER#uuid
      gsi1_pk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example : #USER#uuid
      gsi1_sk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example : #USER#uuid
      gsi2_pk: `${StartsWith.ADDRESS}`,
    },
    real_estate_users: {
      pk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example : #USER#uuid
      sk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example : #USER#uuid
      gsi1_pk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example : #USER#uuid
      gsi1_sk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example : #USER#uuid
      gsi2_pk: `${StartsWith.ADDRESS}`,
    },
    // order checkout
    real_estate_order: {
      // Example : #RE#uuid
      pk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example : #USER#uuid
      sk: `${StartsWith.ORDER}#${ValueFor.order_id}`,
      // Example : #USER#uuid
      gsi1_pk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example: #RE#uuid
      gsi1_sk: `${StartsWith.RE}#${ValueFor.reId}`,
      // Example: #ORDER#id
      gsi2_pk: `${StartsWith.ORDER}#${ValueFor.order_id}`,
    },
    // user
    user: {
      // Example : #RE#uuid
      pk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example : #USER#uuid
      sk: `${StartsWith.USER}#${ValueFor.userId}`,
      // ReferrerCode (Person who referred ME)
      gsi1_pk: `${StartsWith.REFERRAL_CODE}#${ValueFor.code}`,
      gsi1_sk: `${ValueFor.code}`,
      // ReferrerUserID
      gsi2_pk: `${StartsWith.REFERRER_CODE}#${ValueFor.userId}`,
      gsi2_sk: `${ValueFor.userId}`,
      // Example : #RE#uuid
    },
    user_ppm_operating_agreement: {
      pk: `${StartsWith.USER}#${ValueFor.userId}`,
      sk: `${StartsWith.RE}#${ValueFor.reId}`,
    },
    user_subscription_agreement: {
      pk: `${StartsWith.USER}#${ValueFor.userId}`,
      sk: `${StartsWith.SUB}#${ValueFor.subId}`,
      gsi1_pk: `${StartsWith.RE}#${ValueFor.reId}`,
      gsi1_sk: `${StartsWith.USER}#${ValueFor.userId}`,
    },
    user_applicants: {
      // Example : #RE#uuid
      pk: `${StartsWith.USER}#${ValueFor.userId}`,
      // Example : #USER#uuid
      sk: `${StartsWith.APPLICANT}#${ValueFor.applicantId}`,
      // Example : #RE#uuid
      gsi1_pk: `${StartsWith.WF_RUN_ID}#${ValueFor.wf_run_id}`,
    },
    cumulative: {
      pk: '#REI#00000001',
      sk: '#USER#3Blocks-LLC',
    },
    contractDetails: {
      pk: `${StartsWith.RE}#${ValueFor.reId}`,
      sk: `${StartsWith.ORDER}#${ValueFor.order_id}`,
    },
    contractAddressDetails: {
      pk: `${StartsWith.USER}#${ValueFor.userId}`,
      sk: `#SCADDRESS#${ValueFor.addressfieldindb}`,
    },
    zillowDigitalRE: {
      pk: `${StartsWith.ZILLOW_DIGITAL_RE}#${ValueFor.zillowId}`,
      sk: `#ZILLOW_RE`,
    },
    companySocials: {
      pk: `${StartsWith.COMPANY_SOCIALS}`,
      sk: '#COMPANY',
    },
  }
}
