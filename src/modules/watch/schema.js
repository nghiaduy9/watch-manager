const watchModel = require('../../models/watch')

const watch = watchModel.schema

const aggregatedWatch = {
  ...watch,
  properties: {
    ...watch.properties,
    targets: {
      ...watch.properties.targets,
      items: {
        ...watch.properties.targets.items,
        properties: {
          ...watch.properties.targets.items.properties,
          data: {
            type: 'string'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          },
        }
      }
    }
  }
}

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
      200: aggregatedWatch
    }
  },
  updateTargetData: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id
      }
    },
    body: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'string'
        }
      }
    }
  },
  updateCheckedAt: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id
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
        items: aggregatedWatch
      }
    }
  }
}
