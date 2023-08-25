import { plainToInstance } from 'class-transformer'
import { validate, Validate } from 'class-validator'
import { CreateApplicantRequest } from '../../core/inputs/integrations/onfido/create-applicant.input'
import { CustomDateValidator } from './date-validator'

//https://stackoverflow.com/questions/59890671/unt-test-for-jest-custom-validation-class-class-validator-and-its-message

describe('date-validator', () => {
  class MyClass {
    @Validate(CustomDateValidator, { message: 'date of birth must be valid' })
    dob: string
  }

  const model: any = new MyClass()

  model.dob = '2012-10-11'
  model.user_id = '05cee8a7-a4e9-44d1-b76d-c88b2d7beab0'
  it('should return true when date is 0001-01-01', async () => {
    model.dob = '0001-01-01'
    const res = await validate(model)
    const expectedErrorObject = []
    expect(res.length).toBe(0)
    expect(expectedErrorObject).toMatchObject(res)
  })

  it('should return true when date is 9999-12-31', async () => {
    const ofImportDto = plainToInstance(CreateApplicantRequest, model)
    const errors = await validate(ofImportDto)
    expect(errors.length).toBe(0)
  })
})
