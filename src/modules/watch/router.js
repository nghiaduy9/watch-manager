const schema = require('./schema')
const WatchService = require('./service')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const watchService = new WatchService(mongol)

  server.post('/', { schema: schema.create }, async (req, res) => {
    try {
      const watch = await watchService.create(req.body)
      res.status(200).send(watch)
    } catch (err) {
      req.log.error(err.message)
      res.status(500).send()
    }
  })

  server.get('/:id', { schema: schema.getByID }, async (req, res) => {
    try {
      const watch = await watchService.getByID(req.params.id)
      if (watch) res.status(200).send(watch)
      else res.status(404).send()
    } catch (err) {
      req.log.error(err.message)
      res.status(500).send()
    }
  })

  server.put('/:id/checkedAt', { schema: schema.updateCheckedAt }, async (req, res) => {
    try {
      const result = await watchService.updateCheckedAt(req.params.id)
      if (result) res.status(200).send(result)
      else res.status(404).send()
    } catch (err) {
      req.log.error(err.message)
      res.status(500).send()
    }
  })

  server.put(
    '/:id/status/:newStatus',
    { schema: schema.updateStatus },
    async (req, res) => {
      try {
        const { id, newStatus } = req.params
        const result = await watchService.updateStatus(id, newStatus)
        if (result) res.status(200).send(result)
        else res.status(404).send()
      } catch (err) {
        req.log.error(err.message)
        res.status(500).send()
      }
    }
  )

  server.put(
    '/targets/:id/data',
    { schema: schema.updateTargetData },
    async (req, res) => {
      try {
        const watch = await watchService.updateTargetData(req.params.id, req.body.data)
        if (watch) res.status(200).send(watch)
        else res.status(404).send()
      } catch (err) {
        req.log.error(err.message)
        res.status(500).send()
      }
    }
  )

  server.get('/users/:id', { schema: schema.getByUserID }, async (req, res) => {
    try {
      const watches = await watchService.getByUserID(req.params.id)
      res.status(200).send(watches)
    } catch (err) {
      req.log.error(err.message)
      res.status(500).send()
    }
  })
}
