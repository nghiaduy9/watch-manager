const axios = require('axios')
const { ObjectID } = require('mongodb')
const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const {
  createWatchSchema,
  getWatchByIDSchema,
  updateWatchTargetsSchema,
  updateWatchStatusSchema,
  getWatchsByUserIDSchema
} = require('../schemas/routes')

const { GATEWAY_ADDRESS } = process.env

module.exports = async (server, opts) => {
  const { mongol } = opts
  const watchCollection = mongol.database.collection('watches')
  mongol.attachDatabaseHook(watchCollection, createTimestampHook())

  server.get('/', async () => {
    return { iam: '/' }
  })

  server.post('/', { schema: createWatchSchema }, async (req, res) => {
    try {
      const { userID, url, interval, targets } = req.body
      const newTargets = targets.map((target) => {
        target._id = new ObjectID()
        return target
      })
      // add a document into the database
      const { insertedId } = await watchCollection.insertOne({
        userID: new ObjectID(userID),
        url,
        interval,
        targets: newTargets,
        active: true
      })

      // add this watch into the scheduler
      const { status } = await axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
        interval,
        payload: { watchID: insertedId }
      })

      res.code(status).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.get('/:id', { schema: getWatchByIDSchema }, async (req, res) => {
    try {
      const _id = new ObjectID(req.params.id)
      const result = await watchCollection.findOne({ _id })
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put('/:id/targets', { schema: updateWatchTargetsSchema }, async (req, res) => {
    try {
      const _id = new ObjectID(req.params.id)

      let { targets } = await watchCollection.findOne({ _id })
      targets = targets.map((target) => {
        let newTarget = target
        for (const updatedTarget of req.body) {
          if (target.name === updatedTarget.name) {
            newTarget = updatedTarget
            newTarget.updatedAt = new Date()
            break
          }
        }
        return newTarget
      })

      watchCollection.updateOne({ _id }, { $set: { targets, checkedAt: new Date() } })
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put(
    '/:id/status/:newStatus',
    { schema: updateWatchStatusSchema },
    async (req, res) => {
      try {
        const _id = new ObjectID(req.params.id)
        const { newStatus } = req.params
        if (newStatus === 'inactive') {
          axios.delete(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
            data: { payload: { watchID: _id } }
          })
          watchCollection.updateOne({ _id }, { $set: { active: false } })
        } else if (newStatus === 'active') {
          const watch = await watchCollection.findOne({ _id })
          const { active, interval } = watch
          if (!active) {
            axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
              interval,
              payload: { watchID: _id }
            })
            watchCollection.updateOne({ _id }, { $set: { active: true } })
          }
        }
        res.code(204).send()
      } catch (err) {
        req.log.error(err.message)
        res.code(500).send()
      }
    }
  )

  server.get(
    '/users/:userID',
    { schema: getWatchsByUserIDSchema },
    async (req, res) => {
      try {
        const userID = new ObjectID(req.params.userID)
        const result = await watchCollection.find({ userID }).toArray()
        res.code(200).send(result)
      } catch (err) {
        req.log.error(err.message)
        res.code(500).send()
      }
    }
  )
}