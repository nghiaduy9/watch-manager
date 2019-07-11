require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')

const loggerLevel = process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/watch', async (req) => {
  const { url, cssSelectors, interval } = req.body
  try {
    const res = await axios.post(`${process.env.SCHEDULER_ADDRESS}/watch`, {
      interval,
      payload: { url, cssSelectors }
    })
    return { success: res.data }
  } catch (err) {
    req.log.error(err.message)
    return { success: false }
  }
})

const start = async () => {
  try {
    await server.listen(process.env.PORT || 3000, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
