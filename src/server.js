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
    const { insertedId } = await watchCollection.insertOne({
      userID,
      url,
      interval,
      targets,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // add this watch into the scheduler
    const { status } = await axios.post(`${SCHEDULER_ADDRESS}/watch`, {
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
    const _id = ObjectID(req.params.id)
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
    const _id = ObjectID(req.params.id)
    const watchCollection = await getCollection('watches')
    const updatedAt = new Date()
    const watch = await watchCollection.findOne({ _id })
    const { targets } = watch
    for (const updateTarget of req.body) {
      const { name } = updateTarget
      for (let target of targets) {
        if (name === target.name) {
          target.data = updateTarget.data
          target.updatedAt = updatedAt
        }
      }
    }
    watchCollection.updateOne({ _id }, { $set: { targets, updatedAt } })
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
