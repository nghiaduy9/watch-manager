const oas = require('fastify-oas')
const { name, description, version } = require('../../package.json')

module.exports = async (server) => {
  server.register(oas, {
    exposeRoute: true,
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: name,
        description,
        version
      },
      externalDocs: {
        url: 'https://github.com/night-watch-project/watch-manager',
        description: 'Github'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      servers: [{ url: `http://localhost:${process.env.PORT}` }]
    }
  })
}
