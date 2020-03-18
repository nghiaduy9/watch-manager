const { HistoryService } = require('../services')
const { getHistoryByTargetIDSchema } = require('../schemas/services/history')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const historyService = new HistoryService(mongol)

  server.get(
    '/history/targets/:id',
    { schema: getHistoryByTargetIDSchema },
    async (req, res) => {
      try {
        const { id } = req.params
        const { limit, after, before } = req.query
        const result = await historyService.getHistoryByTargetID(id, limit, after, before)
        res.code(200).send(result)
      } catch (err) {
        server.log.error(err.message)
        res.code(500).send()
      }
    }
  )
}
