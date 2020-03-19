const schema = require('./schema')
const HistoryService = require('./service')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const historyService = new HistoryService(mongol)

  server.get(
    '/history/targets/:id',
    { schema: schema.getByTargetID },
    async (req, res) => {
      try {
        const { id } = req.params
        const { limit, after, before } = req.query
        const result = await historyService.getByTargetID(id, limit, after, before)
        res.code(200).send(result)
      } catch (err) {
        server.log.error(err.message)
        res.code(500).send()
      }
    }
  )
}
