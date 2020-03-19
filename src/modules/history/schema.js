const historyModel = require('../../models/history')

const history = historyModel.schema

module.exports = {
  getByTargetID: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: history.properties.targetID
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
        items: history
      }
    }
  }
}
