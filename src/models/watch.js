const _id = {
  bsonType: 'objectId',
  description: 'ID of watch'
}

const userID = {
  bsonType: 'objectId',
  description: 'ID of the user to whom this watch belongs'
}

const url = {
  bsonType: 'string',
  description: 'URL to crawl'
}

const interval = {
  bsonType: 'int',
  minimum: 300,
  description: 'Number of seconds between executions'
}

const targets = {
  bsonType: 'array',
  minItems: 1,
  items: {
    bsonType: 'object',
    required: ['name', 'cssSelector', 'type'],
    properties: {
      name: {
        bsonType: 'string',
        description: 'Unique name'
      },
      cssSelector: {
        bsonType: 'string',
        description: 'CSS selector'
      },
      type: {
        enum: ['string'],
        description: 'Type of the data'
      },
      data: {
        bsonType: 'string',
        description: 'Current value'
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Time at which the data was last updated'
      }
    }
  },
  description: 'Array of target objects'
}

const active = {
  bsonType: 'bool',
  description: 'Being scheduled or not'
}

const createdAt = {
  bsonType: 'date',
  description: 'Time at which the user was created'
}

const updatedAt = {
  bsonType: 'date',
  description: 'Time at which the data was last updated'
}

const Watch = {
  bsonType: 'object',
  required: [
    '_id',
    'userID',
    'url',
    'interval',
    'targets',
    'active',
    'createdAt',
    'updatedAt'
  ],
  properties: {
    _id,
    userID,
    url,
    interval,
    targets,
    active,
    createdAt,
    updatedAt
  }
}

module.exports = { Watch }
