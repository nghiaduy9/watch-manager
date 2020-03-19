const watchModel = require('../../models/watch')

const watch = watchModel.schema

module.exports = {
  create: {
    body: {
      type: 'object',
      required: ['userID', 'url', 'interval', 'targets'],
      properties: {
        userID: watch.properties.userID,
        url: watch.properties.url,
        interval: watch.properties.interval,
        targets: {
          type: watch.properties.targets.type,
          minItems: watch.properties.targets.minItems,
          items: {
            required: ['name', 'cssSelector', 'type'],
            properties: watch.properties.targets.items.properties
          }
        }
      }
    }
  },
  getByID: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id
      }
    },
    response: {
      200: watch
    }
  },
  updateTargets: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id
      }
    },
    body: {
      type: watch.properties.targets.type,
      items: {
        required: ['_id', 'name', 'cssSelector', 'type', 'data'],
        properties: watch.properties.targets.items.properties
      }
    }
  },
  updateStatus: {
    params: {
      type: 'object',
      required: ['id', 'newStatus'],
      properties: {
        id: watch.properties._id,
        newStatus: {
          type: 'string',
          enum: ['active', 'inactive'],
          description: 'Either "active" or "inactive"'
        }
      }
    }
  },
  getByUserID: {
    params: {
      bsonType: 'object',
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties.userID
      }
    },
    response: {
      200: {
        type: 'array',
        items: watch
      }
    }
  }
}
