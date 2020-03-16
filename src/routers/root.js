const { RootService } = require('../services')
const {
  createWatchSchema,
  getWatchByIDSchema,
  updateWatchTargetsSchema,
  updateWatchStatusSchema,
  getWatchsByUserIDSchema
} = require('../schemas/services/root')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const rootService = new RootService(mongol)

  server.post('/', { schema: createWatchSchema }, async (req, res) => {
    try {
      await rootService.createWatch(req.body)
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.get('/:id', { schema: getWatchByIDSchema }, async (req, res) => {
    try {
      const result = await rootService.getWatchByID(req.params.id)
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put('/:id/targets', { schema: updateWatchTargetsSchema }, async (req, res) => {
    try {
      await rootService.updateWatchTargets(req.params.id, req.body)
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
        await rootService.updateWatchStatus(req.params.id, req.params.newStatus)
        res.code(204).send()
      } catch (err) {
        req.log.error(err.message)
        res.code(500).send()
      }
    }
  )

  server.get('/users/:userID', { schema: getWatchsByUserIDSchema }, async (req, res) => {
    try {
      const result = await rootService.getWatchsByUserID(req.params.userID)
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })
}
