require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')
const { ObjectID } = require('mongodb')
const { getCollection } = require('./database')

const { NODE_ENV, PORT, SCHEDULER_ADDRESS } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/', async (req, res) => {
  try {
    const { userID, url, interval, targets } = req.body
    const watchCollection = await getCollection('watches')

    // add a document into the database
    const now = new Date()
    const { insertedId } = await watchCollection.insertOne({
      userID: new ObjectID(userID),
      url,
      interval,
      targets,
      active: true,
      createdAt: now,
      updatedAt: now
    })

    // add this watch into the scheduler
    const { status } = await axios.post(`${SCHEDULER_ADDRESS}/watches`, {
      interval,
      payload: insertedId
    })

    res.code(status)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

server.get('/:id', async (req, res) => {
  try {
    const _id = new ObjectID(req.params.id)
    const watchCollection = await getCollection('watches')
    const result = await watchCollection.findOne({ _id })
    res.code(200).send(result)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

server.put('/:id/targets', async (req, res) => {
  try {
    const _id = new ObjectID(req.params.id)
    const watchCollection = await getCollection('watches')
    const now = new Date()

    let { targets } = await watchCollection.findOne({ _id })
    targets = targets.map((target) => {
      let newTarget = target
      for (const updatedTarget of req.body) {
        if (target.name === updatedTarget.name) {
          newTarget = updatedTarget
          break
        }
      }
      newTarget.updatedAt = now
      return newTarget
    })

    watchCollection.updateOne({ _id }, { $set: { targets, updatedAt: now } })
    res.code(204)
  } catch (err) {
    req.log.error(err.message)
    res.code(500)
  }
})

const start = async () => {
  try {
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
