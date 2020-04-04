const fastify = require('fastify')
const loaders = require('./loaders')
const historyModule = require('./modules/history')
const watchModule = require('./modules/watch')
const templateModule = require('./modules/template')

const { NODE_ENV, PORT } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

const main = async () => {
  try {
    server.register(loaders.mongol)
    server.register(loaders.oas)
    server.register(historyModule.router, (parent) => {
      return { mongol: parent.mongol }
    })
    server.register(watchModule.router, (parent) => {
      return { mongol: parent.mongol }
    })
    server.register(templateModule.router, (parent) => {
      return { mongol: parent.mongol }
    })
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
