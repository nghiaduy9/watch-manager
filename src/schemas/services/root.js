const {
  _idSchema,
  watchSchema,
  userIDSchema,
  urlSchema,
  intervalSchema,
  targetsSchema
} = require('../models/watch')

const createWatchSchema = {
  body: {
    type: 'object',
    required: ['userID', 'url', 'interval', 'targets'],
    properties: {
      userID: userIDSchema,
      url: urlSchema,
      interval: intervalSchema,
      targets: {
        type: targetsSchema.type,
        minItems: 1,
        items: {
          required: ['name', 'cssSelector', 'type'],
          properties: targetsSchema.items.properties
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
      id: _idSchema
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
      id: _idSchema
    }
  },
  body: {
    type: targetsSchema.type,
    items: {
      required: ['_id', 'name', 'cssSelector', 'type', 'data'],
      properties: targetsSchema.items.properties
    }
  }
}

const updateWatchStatusSchema = {
  params: {
    type: 'object',
    required: ['id', 'newStatus'],
    properties: {
      id: _idSchema,
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
    required: ['userID'],
    properties: {
      userID: userIDSchema
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