const fastify = require('fastify')
const { mongolLoader, oasLoader } = require('./loaders')
const { rootRouter, historyRouter } = require('./routers')

const { NODE_ENV, PORT } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

const main = async () => {
  try {
    server.register(mongolLoader)
    server.register(oasLoader)
    server.register(rootRouter, (parent) => {
      return { mongol: parent.mongol }
    })
    server.register(historyRouter, (parent) => {
      return { mongol: parent.mongol }
    })
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
