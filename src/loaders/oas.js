const oas = require('fastify-oas')

module.exports = async (server) => {
  server.register(oas, {
    routePrefix: '/documentation', 
    swagger: {
      info: {
        title: 'watch-manager',
        description: 'watch-manager API documentation',
        version: '0.4.1'
      },
      externalDocs: {
        url: 'https://github.com/night-watch-project/watch-manager',
        description: 'Github'
      }
    },
    exposeRoute: true,
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [{
      url: `http://localhost:${process.env.PORT}`
    }]
  })
}
