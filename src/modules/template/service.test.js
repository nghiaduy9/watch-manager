const { Mongol } = require('@albert-team/mongol')
const TemplateService = require('./service')
const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const { ObjectID } = require("mongodb")

// MONGO_URL is just an ENV variable set by @shelf/jest-mongodb, not the actual one used in production
const { MONGO_URL } = process.env

describe('test suite for TemplateService', () => {
  const mongol = new Mongol(MONGO_URL, 'testdb')
  let db
  let service

  beforeAll(async () => {
    await mongol.connect()
    db = mongol.database
  })

  beforeEach(async () => {
    await db.dropDatabase()
    service = new TemplateService(mongol)
  })

  afterAll(async () => {
    await mongol.disconnect()
  })

  describe('test suite for TemplateService.create()', () => {
    test('create template', async () => {
      const mockTemplate = {
        name: 'test1',
        urlPattern: 'http://*.com',
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
      const template = await service.create(mockTemplate)
      expect(template._id).toBeDefined()
      expect(template).toMatchObject(mockTemplate)
    })
  })

  describe('test suite for TemplateService.get()', () => {
    const mockTemplate1 = {
      name: 'test1',
      urlPattern: 'http://*.com',
      targets: [
        {
          _id: new ObjectID(),
          name: 'name1',
          cssSelector: 'h1',
          type: 'string',
        },
        {
          _id: new ObjectID(),
          name: 'name2',
          cssSelector: 'h2',
          type: 'string',
        },
      ],
    }

    const mockTemplate2 = {
      name: 'test2',
      urlPattern: 'http://*.net',
      targets: [
        {
          _id: new ObjectID(),
          name: 'name1',
          cssSelector: 'h1',
          type: 'string',
        },
      ],
    }

    beforeEach(async () => {
      const templateCollection = mongol
        .collection('templates')
        .attachHook(createTimestampHook())
      await templateCollection.insertMany([mockTemplate1, mockTemplate2])
    })

    test('get all templates', async () => {
      const templates = await service.get()
      expect(templates[0]).toMatchObject(mockTemplate1)
      expect(templates[1]).toMatchObject(mockTemplate2)
    })

    test('get templates matched by url', async () => {
      const templates = await service.get('http://google.net')
      expect(templates[0]).toMatchObject(mockTemplate2)
    })
  })
})
