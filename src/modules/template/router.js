const schema = require('./schema')
const TemplateService = require('./service')

module.exports = async (server, opts) => {
  const { mongol } = opts
  const templateService = new TemplateService(mongol)

  server.post('/templates', { schema: schema.create }, async (req, res) => {
    try {
      const template = await templateService.create(req.body)
      res.status(200).send(template)
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })

  server.get('/templates', { schema: schema.get }, async (req, res) => {
    try {
      const templates = await templateService.get(req.query.url)
      res.status(200).send(templates)
    } catch (err) {
      server.log.error(err.message)
      res.status(500).send()
    }
  })
}
