require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')

const { NODE_ENV, PORT, SCHEDULER_ADDRESS } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/', async (req, res) => {
  const { url, cssSelectors, interval } = req.body
  try {
    const { status } = await axios.post(`${SCHEDULER_ADDRESS}/watch`, {
      interval,
      payload: { url, cssSelectors }
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
