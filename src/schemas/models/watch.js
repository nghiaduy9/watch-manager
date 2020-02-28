const _idSchema = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
  description: 'ID of watch'
}

const userIDSchema = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
  description: 'ID of the user to whom this watch belongs'
}

const urlSchema = {
  bsonType: 'string',
  type: 'string',
  format: 'uri',
  description: 'URL to crawl'
}

const intervalSchema = {
  bsonType: 'int',
  type: 'integer',
  minimum: 300,
  description: 'Number of seconds between executions'
}

const targetsSchema = {
  bsonType: 'array',
  type: 'array',
  minItems: 1,
  items: {
    bsonType: 'object',
    required: ['_id', 'name', 'cssSelector', 'type'],
    properties: {
      _id: {
        bsonType: 'objectId',
        type: 'string',
        description: 'ID of target'
      },
      name: {
        bsonType: 'string',
        type: 'string',
        description: 'Unique name'
      },
      cssSelector: {
        bsonType: 'string',
        type: 'string',
        description: 'CSS selector'
      },
      type: {
        enum: ['string'],
        description: 'Type of the data'
      },
      data: {
        bsonType: 'string',
        type: 'string',
        description: 'Current value'
      },
      updatedAt: {
        bsonType: 'date',
        type: 'string',
        description: 'Time at which the data was last updated'
      }
    }
  },
  description: 'Array of target objects'
}

const activeSchema = {
  bsonType: 'bool',
  type: 'boolean',
  description: 'Being scheduled or not'
}

const createdAtSchema = {
  bsonType: 'date',
  type: 'string',
  format: 'date',
  description: 'Time at which the user was created'
}

const updatedAtSchema = {
  bsonType: 'date',
  type: 'string',
  format: 'date',
  description: 'Time at which the data was last updated'
}

const checkedAtSchema = {
  bsonType: 'date',
  description: 'Time at which the data was last checked'
}

const watchSchema = {
  bsonType: 'object',
  type: 'object',
  required: [
    '_id',
    'userID',
    'url',
    'interval',
    'targets',
    'active',
    'createdAt'
  ],
  properties: {
    _id: _idSchema,
    userID: userIDSchema,
    url: urlSchema,
    interval: intervalSchema,
    targets: targetsSchema,
    active: activeSchema,
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
    checkedAt: checkedAtSchema
  }
}

module.exports = { 
  _idSchema,
  userIDSchema,
  urlSchema,
  intervalSchema,
  targetsSchema,
  watchSchema
}
