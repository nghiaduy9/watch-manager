const { historySchema } = require('../models')

const getHistoryByTargetIDSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: historySchema.properties.targetID
    }
  },
  querystring: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        default: 100
      },
      after: {
        type: 'string',
        format: 'date-time'
      },
      before: {
        type: 'string',
        format: 'date-time'
      }
    }
  },
  response: {
    200: {
      type: 'array',
      items: historySchema
    }
  }
}

module.exports = {
  getHistoryByTargetIDSchema
}
