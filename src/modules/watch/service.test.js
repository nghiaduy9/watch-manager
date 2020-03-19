const { Mongol } = require('@albert-team/mongol')
const WatchService = require('./service')

// MONGO_URL is just an ENV variable set by @shelf/jest-mongodb, not the actual one used in production
const { MONGO_URL } = process.env

describe('test suite for WatchService', () => {
  const mongol = new Mongol(MONGO_URL, 'testdb')
  let db
  let service

  beforeAll(async () => {
    await mongol.connect()
    db = mongol.database
  })

  beforeEach(async () => {
    await db.dropDatabase()
    service = new WatchService(mongol)
  })

  afterAll(async () => {
    await mongol.disconnect()
  })

  describe('test suite for WatchService.create()', () => {
    test('useless test', () => {
      expect(service).toBeTruthy()
    })
  })
})
