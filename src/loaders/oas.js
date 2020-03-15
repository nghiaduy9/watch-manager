module.exports = (server, opts, next) => {
  server.register(require('fastify-oas'), {
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
    exposeRoute: true
  })

  next()
}
