const _idSchema = {
  description: 'ID of history entry',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const watchIDSchema = {
  description: 'ID of watch',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const targetIDSchema = {
  description: 'ID of target',
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24
}

const dataSchema = {
  description: 'Target value',
  bsonType: 'string',
  type: 'string'
}

const createdAtSchema = {
  description: 'Time at which this history entry was created',
  bsonType: 'date',
  type: 'string',
  format: 'date-time'
}

const historySchema = {
  bsonType: 'object',
  type: 'object',
  required: ['_id', 'watchID', 'targetID', 'data', 'createdAt'],
  properties: {
    _id: _idSchema,
    watchID: watchIDSchema,
    targetID: targetIDSchema,
    data: dataSchema,
    createdAt: createdAtSchema
  }
}

module.exports = historySchema
