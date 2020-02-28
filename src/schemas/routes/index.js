const {
  _idSchema,
  watchSchema,
  userIDSchema,
  urlSchema,
  intervalSchema,
  targetsSchema,
  activeSchema
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
    required: 'id',
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
    minItems: 1,
    items: {
      required: ['name', 'cssSelector', 'type', 'data'],
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
      newStatus: activeSchema
    }
  }
}

const getWatchsByUserIDSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: _idSchema
    }
  },
  response: {
    200: {
      type: 'array',
      items: watchSchema
      }
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
