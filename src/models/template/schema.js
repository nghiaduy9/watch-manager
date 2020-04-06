const _id = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
}

const name = {
  bsonType: 'string',
  type: 'string',
}

const urlPattern = {
  bsonType: 'string',
  type: 'string',
}

const targets = {
  bsonType: 'array',
  type: 'array',
  minItems: 1,
  items: {
    bsonType: 'object',
    type: 'object',
    required: ['_id', 'name', 'cssSelector', 'type'],
    properties: {
      _id: {
        bsonType: 'objectId',
        type: 'string',
      },
      name: {
        bsonType: 'string',
        type: 'string',
      },
      cssSelector: {
        bsonType: 'string',
        type: 'string',
      },
      type: {
        bsonType: 'string',
        type: 'string',
        enum: ['string'],
      },
    },
  },
}

const createdAt = {
  bsonType: 'date',
  type: 'string',
  format: 'date-time',
}

const updatedAt = {
  bsonType: 'date',
  type: 'string',
  format: 'date-time',
}

module.exports = {
  bsonType: 'object',
  type: 'object',
  required: ['_id', 'name', 'urlPattern', 'targets', 'createdAt'],
  properties: { _id, name, urlPattern, targets, createdAt, updatedAt },
}
