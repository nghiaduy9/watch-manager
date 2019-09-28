const { MongoClient } = require('mongodb')

const { MONGODB_URI, MONGODB_DB_NAME } = process.env

const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true })

const getCollection = async (name) => {
  if (!client.isConnected()) await client.connect()
  const db = client.db(MONGODB_DB_NAME)
  return db.collection(name)
}

const closeConnection = async () => client.close()

module.exports = { getCollection, closeConnection }
