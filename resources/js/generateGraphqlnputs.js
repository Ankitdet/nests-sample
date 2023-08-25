// Copy here json file which shared by UI guys.

const { Logger } = require('@nestjs/common')

const data = {
  firstName: 'dan',
  lastName: 'Dano',
  address: {
    line1: 'First street',
    line2: 'Second street',
    postcode: 'CCCC',
    state: 'GEORGIA',
    town: 'Tampa',
    country: 'IND',
  },
}

Logger.log(JSON.stringify(data).replace(/"(\w+)"\s*:/g, '$1:'))
