const axios = require('axios')
const { ObjectID } = require('mongodb')

const { GATEWAY_ADDRESS } = process.env

module.exports = (server, opts, next) => {
  const { mongol } = opts
  const watchCollection = mongol.database.collection('watches')

  server.get('/', async () => {
    return { iam: '/' }
  })

  server.post('/', async (req, res) => {
    try {
      const { userID, url, interval, targets } = req.body  

      // add a document into the database
      const now = new Date()
      const { insertedId } = await watchCollection.insertOne({
        userID: new ObjectID(userID),
        url,
        interval,
        targets,
        active: true,
        createdAt: now,
        updatedAt: now
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

  server.get('/:id', async (req, res) => {
    try {
      const _id = new ObjectID(req.params.id)
      const result = await watchCollection.findOne({ _id })
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put('/:id/targets', async (req, res) => {
    try {
      const _id = new ObjectID(req.params.id)
      const now = new Date()

      let { targets } = await watchCollection.findOne({ _id })
      targets = targets.map((target) => {
        let newTarget = target
        for (const updatedTarget of req.body) {
          if (target.name === updatedTarget.name) {
            newTarget = updatedTarget
            newTarget.updatedAt = now
            break
          }
        }
        return newTarget
      })

      watchCollection.updateOne({ _id }, { $set: { targets, updatedAt: now } })
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put('/:id/status/:newStatus', async (req, res) => {
    try {
      const _id = new ObjectID(req.params.id)
      const { newStatus } = req.params
      const now = new Date()
      if (newStatus === 'inactive') {
        axios.delete(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
          data: { payload: { watchID: _id } }
        })
        watchCollection.updateOne({ _id }, { $set: { active: false, updatedAt: now } })
      } else if (newStatus === 'active') {
        const watch = await watchCollection.findOne({ _id })
        const { active, interval } = watch
        if (!active) {
          axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
            interval,
            payload: { watchID: _id }
          })
          watchCollection.updateOne({ _id }, { $set: { active: true, updatedAt: now } })
        }
      }
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  next()
}
