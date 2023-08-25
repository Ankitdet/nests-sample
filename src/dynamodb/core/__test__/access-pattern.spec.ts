import { AccessPatternMatrix } from '../dyanamo-access-pattern'

describe('access pattern', () => {
  it('should define access patten', () => {
    expect(AccessPatternMatrix()).toStrictEqual({
      realEstate: {
        pk: '#REI#<reId>',
        sk: '#USER#<userId>',
        gsi1_pk: '#USER#<userId>',
        gsi1_sk: '#REI#<reId>',
        gsi2_pk: '#ADD#CITY#STATE#ZIP',
      },
      // User Module
      user: {
        pk: '#REI#<reId>',
        sk: '#USER#<userId>',
        gsi1_sk: '#REI#<reId>',
        gsi1_pk: '#USER#<userId>',
      },
      // User-Onfio
      user_onfido: {
        pk: '#USER#<userId>',
        sk: `#ONFIDO#<applicantId>`,
      },
    })
  })
})
