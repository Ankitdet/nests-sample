import { Logger } from '@nestjs/common'
import {
  extractUUIDFromString,
  getDateDiffInMonths,
  LogInfo,
  skipNullAttributes,
  validaAndFormatDateString,
} from '..'

describe('extract uuid from string', () => {
  describe('uuid generate - positive', () => {
    const expected = 'fdb26620-3675-4c4a-8648-4aab0d72766b'
    it('should get uuid from string', async () => {
      const str = await extractUUIDFromString(
        '#REID#fdb26620-3675-4c4a-8648-4aab0d72766b',
      )
      expect(str).toBe(expected)
    })

    it('should have uuid in middle of string', async () => {
      const str = await extractUUIDFromString(
        '#REID#fdb26620-3675-4c4a-8648-4aab0d72766b#RRRREEREE#R',
      )
      expect(str).toBe(expected)
    })

    it('should have starting of string', async () => {
      const str = await extractUUIDFromString(
        'fdb26620-3675-4c4a-8648-4aab0d72766b#REID',
      )
      expect(str).toBe(expected)
    })
  })

  describe('uuid generate - negative', () => {
    it('should get uuid from string', async () => {
      try {
        await extractUUIDFromString('#REID#f126620-3675-4c4a-8648-4aab0d72766b')
      } catch (e) {
        expect(e.message).toBe(`Cannot read property '0' of null`)
      }
    })
  })

  describe('string to date formate', () => {
    it('should return proper date format string', async () => {
      let str = '2014-02-27T10:00:00'
      try {
        str = validaAndFormatDateString(str)
      } catch (e) {
        expect(e.message).toBe(`Cannot read property '0' of null`)
      }
    })

    it('should not return proper date format string- return invalid date', async () => {
      let str = '2014-02-27T10:00:0092288'
      try {
        str = validaAndFormatDateString(str)
      } catch (e) {
        expect(e.message).toBe(`Provided date is not valid format ${str}`)
      }
    })
  })

  describe('date differenc is 6 month', () => {
    it('should return true if date diff is less than 6 month', async () => {
      let str = '05-23-2022 13:44:55'
      let b
      try {
        b = getDateDiffInMonths(str)
        if (b > 6) {
          expect(b).toBeFalsy()
        } else {
          expect(b).toBeTruthy()
        }
      } catch (e) {
        expect(e.message).toBe(`Cannot read property '0' of null`)
      }
    })

    it('should return false if date diff is more than than 6 month', async () => {
      let str = '02-23-2022 13:44:55'
      let b
      try {
        b = getDateDiffInMonths(str)
        if (b > 6) {
          expect(b).toBeFalsy()
        }
      } catch (e) {
        expect(e.message).toBe(`Provided date is not valid format ${str}`)
      }
    })
  })
  describe('skip null atrributes', () => {
    it('should return skipped attributes', async () => {
      let b
      try {
        b = skipNullAttributes({
          ankit: 'null',
          detroja: 'ankit detroja',
        })
        expect(b).toStrictEqual({
          detroja: '',
        })
      } catch (e) {
        expect(e.message).toBe(`Cannot read property '0' of null`)
      }
    })
  })

  describe('log events', () => {
    it('should return strigify string', async () => {
      let b
      try {
        b = LogInfo(
          'asdkjsahdjkashdn',
          {
            applicant_id: 'c797e9fc-b162-4384-8d33-a27862cad8d9',
            config: {
              custom_output: {
                additionalProperties: false,
                properties: {},
                required: [],
                type: 'object',
              },
              standard_output: {
                additionalProperties: true,
                properties: {},
                required: [],
                type: 'object',
              },
              timeout: 7200,
            },
            created_at: '2022-10-21T13:11:31Z',
            error: 'Error performing workflow task',
            finished: true,
            id: '9c10f672-0c51-4e24-8954-a6898aee6cc3',
            profile_data: {},
            state: 'cancelled',
            status: 'error',
            task_def_id: 'start',
            task_id: 'start',
            task_type: 'SYNC',
            updated_at: '2022-10-21T13:11:31Z',
            version_id: 6,
            workflow_id: 'a1d3bda0-7de0-4026-85fe-07076edaabc6',
          },
          [
            {
              applicant_id: 'c797e9fc-b162-4384-8d33-a27862cad8d9',
              config: {
                custom_output: {
                  additionalProperties: false,
                  properties: {},
                  required: [],
                  type: 'object',
                },
                standard_output: {
                  additionalProperties: true,
                  properties: {},
                  required: [],
                  type: 'object',
                },
                timeout: 7200,
              },
              created_at: '2022-10-21T13:11:31Z',
              error: 'Error performing workflow task',
              finished: true,
              id: '9c10f672-0c51-4e24-8954-a6898aee6cc3',
              profile_data: {},
              state: 'cancelled',
              status: 'error',
              task_def_id: 'start',
              task_id: 'start',
              task_type: 'SYNC',
              updated_at: '2022-10-21T13:11:31Z',
              version_id: 6,
              workflow_id: 'a1d3bda0-7de0-4026-85fe-07076edaabc6',
            },
          ],
        )
        Logger.log(b)
        expect(b).toStrictEqual({
          detroja: '',
        })
      } catch (e) {
        expect(e.message).toBe(`Cannot read property '0' of null`)
      }
    })
  })
})
