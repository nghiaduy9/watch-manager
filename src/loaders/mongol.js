const { Mongol } = require('@albert-team/mongol')
const fp = require('fastify-plugin')
const historyModel = require('../models/history')
const watchModel = require('../models/watch')

const { MONGODB_URI, MONGODB_DB_NAME } = process.env

const mongol = new Mongol(MONGODB_URI, MONGODB_DB_NAME)

module.exports = fp(async (server) => {
  await mongol.connect()
  const options = {
    ignoreUnsupportedKeywords: true,
    ignoreType: true
  }
  await mongol.setSchema('history', historyModel.schema, options)
  await mongol.setSchema('watches', watchModel.schema, options)
  server.decorate('mongol', mongol)
})
