const _id = {
  description: 'ID of watch',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const userID = {
  description: "User's ID",
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const url = {
  description: 'URL to crawl',
  bsonType: 'string',
  type: 'string',
  format: 'uri'
}

const interval = {
  description: 'Number of seconds between executions',
  bsonType: 'int',
  type: 'integer',
  minimum: 300
}

const targets = {
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
      }
    }
  }
}

const active = {
  description: 'Being scheduled or not',
  bsonType: 'bool',
  type: 'boolean'
}

const checkedAt = {
  description: 'Time at which the data was last checked',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const createdAt = {
  description: 'Time at which this watch was created',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const updatedAt = {
  description: 'Time at which this watch was last updated',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

module.exports = {
  bsonType: 'object',
  type: 'object',
  required: ['_id', 'userID', 'url', 'interval', 'targets', 'active', 'createdAt'],
  properties: {
    _id,
    userID,
    url,
    interval,
    targets,
    active,
    checkedAt,
    createdAt,
    updatedAt
  }
}
