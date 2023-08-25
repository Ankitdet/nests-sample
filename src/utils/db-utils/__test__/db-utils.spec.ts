import { Keys } from '@db/core/dynamo-enum'
import * as AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { get, query } from '../db-utils'

AWSMock.setSDKInstance(AWS)

describe('DynamoDb Item Reader', () => {
  let documentClient: any = null
  beforeEach(() => {
    documentClient = {
      query: jest.fn().mockImplementation(async () => ({
        Items: [
          {
            id: 10,
            name_id: 'ankit',
          },
          {
            id: 11,
            name_id: 'foram',
          },
        ],
      })),
      scan: jest.fn().mockImplementation(async () => ({ Items: [] })),
    }
    AWSMock.mock('DynamoDB.DocumentClient', 'query', documentClient.query)
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', documentClient.scan)
  })

  afterEach(() => {
    AWSMock.restore()
  })

  describe('test dbuitls', () => {
    beforeEach(async () => {
      const a: DocumentClient.QueryInput = {
        TableName: 'Misic',
        IndexName: Keys.PK,
      }
      await query(a)
    })
    it('scans DynamoDb', () => {
      expect(documentClient.query).toHaveBeenCalled()
    })
  })
})

// Mocked client object for testing purposes
const clientMock = {
  get: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ Item: { id: '123', name: 'Test Item' } }),
  }),
}

// Mocked input object for testing purposes
const inputMock: DocumentClient.GetItemInput = {
  TableName: 'table-name',
  Key: { pk: '123', sk: 'sk' },
}

describe('get', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the item from DynamoDB', async () => {
    // Arrange
    const isCamelCase = false

    // Act
    const result = await get(inputMock, isCamelCase)

    // Assert
    expect(clientMock.get).toHaveBeenCalledTimes(1)
    expect(clientMock.get).toHaveBeenCalledWith(inputMock)
    expect(result).toEqual({ id: '123', name: 'Test Item' })
  })

  it('should convert the item keys to camel case', async () => {
    // Arrange
    const isCamelCase = true

    // Act
    const result = await get(inputMock, isCamelCase)

    // Assert
    expect(clientMock.get).toHaveBeenCalledTimes(1)
    expect(clientMock.get).toHaveBeenCalledWith(inputMock)
    expect(result).toEqual({ id: '123', name: 'Test Item' }) // Assuming convertObjectToCamelCase returns the same output as input
  })

  it('should throw an error if DynamoDB returns an error', async () => {
    // Arrange
    const isCamelCase = false
    const error = new Error('DynamoDB error')
    clientMock.get.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(error),
    })

    // Act + Assert
    await expect(get(inputMock, isCamelCase)).rejects.toThrow(error)
  })
})

/*
https://github.com/laconiajs/laconia/blob/37e67ad02e50f6ee6e7d396b79416e999e018567/packages/laconia-batch/test/S3ItemReader.spec.js#L19
https://github.com/macaw-email/macaw/blob/41bdae4bc5ee78221f5a1ea2ec7b40a955b0b1c0/packages/storage-s3/tests/index.test.js#L7

*/
