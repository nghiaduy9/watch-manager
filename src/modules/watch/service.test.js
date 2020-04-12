const { ObjectID } = require('mongodb')
const { Mongol } = require('@albert-team/mongol')
const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')

const WatchService = require('./service')

// MONGO_URL is just an ENV variable set by @shelf/jest-mongodb, not the actual one used in production
const { MONGO_URL } = process.env

describe('test suite for WatchService', () => {
  const mongol = new Mongol(MONGO_URL, 'testdb')
  let db
  let service
  let watch
  const objectID = new ObjectID()

  beforeAll(async () => {
    await mongol.connect()
    db = mongol.database
  })

  beforeEach(async () => {
    const mockWatch = {
      userID: objectID,
      url: 'http://abc.com',
      interval: 1000,
      targets: [
        {
          name: 'name1',
          cssSelector: 'h1',
          type: 'string',
        },
        {
          name: 'name2',
          cssSelector: 'h2',
          type: 'string',
        },
      ],
    }

    const mockWatch1 = {
      userID: objectID,
      url: 'http://def.com.vn',
      interval: 1000,
      targets: [
        {
          name: 'name11',
          cssSelector: 'h1',
          type: 'string',
        },
        {
          name: 'name22',
          cssSelector: 'h2',
          type: 'string',
        },
      ],
    }

    await db.dropDatabase()
    service = new WatchService(mongol)
    const watchCollection = mongol.collection('watches').attachHook(createTimestampHook())
    const { ops } = await watchCollection.insertOne(mockWatch)
    await watchCollection.insertOne(mockWatch1)
    watch = ops[0]
  })

  afterAll(async () => {
    await mongol.disconnect()
  })

  describe('test suite for WatchService.getByID()', () => {
    test('get watch by ID', async () => {
      const watchResponse = await service.getByID(watch._id)
      expect(watchResponse).toStrictEqual(watch)
    })
  })

  describe('test suite for WatchService.getByUserID()', () => {
    test('get watches by userID', async () => {
      const watchesResponse = await service.getByUserID(objectID)
      watchesResponse.map((watchResponse) => {
        expect(watchResponse.userID).toStrictEqual(watch.userID)
      })
    })
  })

  describe('test suite for WatchService.updateTargetData()', () => {
    test('update target data', async () => {
      await service.updateTargetData(watch.targets._id, null)
      const checkedAt = await service.updateCheckedAt(watch._id)
      expect(checkedAt).not.toBe(watch.checkedAt)
    })
  })

  describe('test suite for WatchService.updateCheckedAt()', () => {
    test('update checkedAt', async () => {
      const checkedAt = await service.updateCheckedAt(watch._id)
      expect(checkedAt).not.toBe(watch.checkedAt)
    })
  })
})
