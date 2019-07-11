const axios = require('axios')

module.exports = (server, opts, next) => {
  server.get('/', async () => {
    return { iam: '/api' }
  })

  server.post('/watch', async (req) => {
    const { url, cssSelectors, interval } = req.body
    try {
      const res = await axios.post(`${process.env.WATCH_SCHEDULER_ADDRESS}/api/watch`, {
        url,
        cssSelectors,
        interval
      })
      const { success } = res.data
      return { success }
    } catch (err) {
      req.log.error(err.message)
      return { success: false }
    }
  })

  next()
}
