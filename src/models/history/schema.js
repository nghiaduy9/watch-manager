const _id = {
  description: 'ID of history entry',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const watchID = {
  description: 'ID of watch',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const targetID = {
  description: 'ID of target',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const data = {
  description: 'Target value',
  bsonType: 'string',
  type: 'string'
}

const createdAt = {
  description: 'Time at which this history entry was created',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

module.exports = {
  bsonType: 'object',
  type: 'object',
  required: ['_id', 'watchID', 'targetID', 'data', 'createdAt'],
  properties: { _id, watchID, targetID, data, createdAt }
}
