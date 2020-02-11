const { Mongol } = require('@albert-team/mongol')
const fp = require('fastify-plugin')
const { watchSchema } = require('../schemas/models/watch')

const { MONGODB_URI, MONGODB_DB_NAME } = process.env

const mongol = new Mongol(MONGODB_URI, MONGODB_DB_NAME)

module.exports = fp(async (server) => {
  await mongol.connect()
  await mongol.setSchema('watches', watchSchema, {
    ignoreUnsupportedKeywords: true,
    ignoreType: true
  })
  server.decorate('mongol', mongol)
})
