const schema = require('./schema')
const WatchService = require('./service')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const watchService = new WatchService(mongol)

  server.post('/', { schema: schema.create }, async (req, res) => {
    try {
      await watchService.create(req.body)
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.get('/:id', { schema: schema.getByID }, async (req, res) => {
    try {
      const result = await watchService.getByID(req.params.id)
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put(
    '/targets/:id/data',
    { schema: schema.updateTargetData },
    async (req, res) => {
      try {
        await watchService.updateTargetData(req.params.id, req.body.data)
        res.code(204).send()
      } catch (err) {
        req.log.error(err.message)
        res.code(500).send()
      }
    }
  )

  server.put('/:id/checkedAt', { schema: schema.updateCheckedAt }, async (req, res) => {
    try {
      await watchService.updateCheckedAt(req.params.id)
      res.code(204).send()
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })

  server.put(
    '/:id/status/:newStatus',
    { schema: schema.updateStatus },
    async (req, res) => {
      try {
        await watchService.updateStatus(req.params.id, req.params.newStatus)
        res.code(204).send()
      } catch (err) {
        req.log.error(err.message)
        res.code(500).send()
      }
    }
  )

  server.get('/users/:id', { schema: schema.getByUserID }, async (req, res) => {
    try {
      const result = await watchService.getByUserID(req.params.id)
      res.code(200).send(result)
    } catch (err) {
      req.log.error(err.message)
      res.code(500).send()
    }
  })
}
