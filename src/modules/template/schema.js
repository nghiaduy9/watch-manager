const templateModel = require('../../models/template')

const template = templateModel.schema

module.exports = {
  create: {
    body: {
      type: 'object',
      required: ['name', 'urlPattern', 'targets'],
      properties: {
        name: template.properties.name,
        urlPattern: template.properties.urlPattern,
        targets: {
          type: template.properties.targets.type,
          minItems: template.properties.targets.minItems,
          items: {
            required: ['name', 'cssSelector', 'type'],
            properties: template.properties.targets.items.properties,
          },
        },
      },
    },
    response: {
      200: template,
    },
  },
  get: {
    query: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri',
        },
      },
    },
    response: {
      200: {
        type: 'array',
        items: template,
      },
    },
  },
}
