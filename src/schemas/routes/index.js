const {
  _idSchema,
  watchSchema,
  userIDSchema,
  urlSchema,
  intervalSchema,
  targetsSchema,
  activeSchema
} = require('../models/watch')

const addNewWatchSchema = {
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

const getWatchByWatchIDSchema = {
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

const updateWatchSchema = {
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

const changeWatchStatusSchema = {
  params: {
    type: 'object',
    required: ['id', 'newStatus'],
    properties: {
      id: _idSchema,
      newStatus: activeSchema
    }
  }
}

const getAllWatchByUserIDSchema = {
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
  addNewWatchSchema,
  getWatchByWatchIDSchema,
  updateWatchSchema,
  changeWatchStatusSchema,
  getAllWatchByUserIDSchema
}
