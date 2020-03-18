const _idSchema = {
  description: 'ID of watch',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const userIDSchema = {
  description: "User's ID",
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const urlSchema = {
  description: 'URL to crawl',
  bsonType: 'string',
  type: 'string',
  format: 'uri'
}

const intervalSchema = {
  description: 'Number of seconds between executions',
  bsonType: 'int',
  type: 'integer',
  minimum: 300
}

const targetsSchema = {
  description: 'Array of target objects',
  bsonType: 'array',
  type: 'array',
  minItems: 1,
  items: {
    bsonType: 'object',
    type: 'object',
    required: ['_id', 'name', 'cssSelector', 'type'],
    properties: {
      _id: {
        description: 'ID of target',
        bsonType: 'objectId',
        type: 'string'
      },
      name: {
        description: 'Unique name',
        bsonType: 'string',
        type: 'string'
      },
      cssSelector: {
        description: 'CSS selector',
        bsonType: 'string',
        type: 'string'
      },
      type: {
        description: 'Type of the data',
        bsonType: 'string',
        type: 'string',
        enum: ['string']
      },
      data: {
        description: 'Current value',
        bsonType: 'string',
        type: 'string'
      },
      updatedAt: {
        description: 'Time at which the data was last updated',
        bsonType: 'date',
        type: 'string',
        format: 'date-time'
      }
    }
  }
}

const activeSchema = {
  description: 'Being scheduled or not',
  bsonType: 'bool',
  type: 'boolean'
}

const createdAtSchema = {
  description: 'Time at which this watch was created',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const updatedAtSchema = {
  description: 'Time at which this watch was last updated',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const checkedAtSchema = {
  description: 'Time at which the data was last checked',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const watchSchema = {
  bsonType: 'object',
  type: 'object',
  required: ['_id', 'userID', 'url', 'interval', 'targets', 'active', 'createdAt'],
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

module.exports = watchSchema
