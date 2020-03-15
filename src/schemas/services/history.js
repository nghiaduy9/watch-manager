const { historySchema, targetIDSchema } = require('../models/history')

const getHistoryByTargetIDSchema = {
  params: {
    type: 'object',
    required: ['targetID'],
    properties: {
      targetID: targetIDSchema
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
