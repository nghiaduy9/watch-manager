require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')
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

const start = async () => {
  try {
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
