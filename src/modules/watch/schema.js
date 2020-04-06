const historyModel = require('../../models/history')
const watchModel = require('../../models/watch')

const history = historyModel.schema
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
          data: history.properties.data,
          updatedAt: history.properties.createdAt,
        },
      },
    },
  },
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
        templateID: watch.properties.templateID,
        targets: {
          type: watch.properties.targets.type,
          minItems: watch.properties.targets.minItems,
          items: {
            required: ['name', 'cssSelector', 'type'],
            properties: watch.properties.targets.items.properties,
          },
        },
      },
    },
    response: {
      200: aggregatedWatch,
    },
  },
  getByID: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id,
      },
    },
    response: {
      200: aggregatedWatch,
    },
  },
  updateCheckedAt: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties._id,
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          checkedAt: watch.properties.checkedAt,
        },
      },
    },
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
          description: 'Either "active" or "inactive"',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          active: watch.properties.active,
        },
      },
    },
  },
  updateTargetData: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties.targets.items.properties._id,
      },
    },
    body: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'string',
        },
      },
    },
    response: {
      200: aggregatedWatch,
    },
  },
  getByUserID: {
    params: {
      bsonType: 'object',
      type: 'object',
      required: ['id'],
      properties: {
        id: watch.properties.userID,
      },
    },
    response: {
      200: {
        type: 'array',
        items: aggregatedWatch,
      },
    },
  },
}
