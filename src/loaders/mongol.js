const { Mongol } = require('@albert-team/mongol')
const { watchSchema } = require('../models/watch')

const { MONGODB_URI, MONGODB_DB_NAME } = process.env

const mongol = new Mongol(MONGODB_URI, MONGODB_DB_NAME)

module.exports = async () => {
    await mongol.connect()
    await mongol.setSchema('watches', watchSchema)
    return mongol
}
