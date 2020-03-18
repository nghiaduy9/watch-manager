const { watchSchema } = require('../models')

const createWatchSchema = {
  body: {
    type: 'object',
    required: ['userID', 'url', 'interval', 'targets'],
    properties: {
      userID: watchSchema.properties.userID,
      url: watchSchema.properties.url,
      interval: watchSchema.properties.interval,
      targets: {
        type: watchSchema.properties.targets.type,
        minItems: watchSchema.properties.targets.minItems,
        items: {
          required: ['name', 'cssSelector', 'type'],
          properties: watchSchema.properties.targets.items.properties
        }
      }
    }
  }
}

const getWatchByIDSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: watchSchema.properties._id
    }
  },
  response: {
    200: watchSchema
  }
}

const updateWatchTargetsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: watchSchema.properties._id
    }
  },
  body: {
    type: watchSchema.properties.targets.type,
    items: {
      required: ['_id', 'name', 'cssSelector', 'type', 'data'],
      properties: watchSchema.properties.targets.items.properties
    }
  }
}

const updateWatchStatusSchema = {
  params: {
    type: 'object',
    required: ['id', 'newStatus'],
    properties: {
      id: watchSchema.properties._id,
      newStatus: {
        type: 'string',
        enum: ['active', 'inactive'],
        description: 'Either "active" or "inactive"'
      }
    }
  }
}

const getWatchsByUserIDSchema = {
  params: {
    bsonType: 'object',
    type: 'object',
    required: ['id'],
    properties: {
      id: watchSchema.properties.userID
    }
  },
  response: {
    200: {
      type: 'array',
      items: watchSchema
    }
  }
}

module.exports = {
  createWatchSchema,
  getWatchByIDSchema,
  updateWatchTargetsSchema,
  updateWatchStatusSchema,
  getWatchsByUserIDSchema
}
