const _idSchema = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
  description: 'ID of history entry'
}

const watchIDSchema = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
  description: 'ID of watch'
}

const targetIDSchema = {
  bsonType: 'objectId',
  type: 'string',
  minLength: 24,
  maxLength: 24,
  description: 'ID of target'
}

const dataSchema = {
  bsonType: 'string',
  type: 'string',
  description: 'Value'
}

const createdAtSchema = {
  bsonType: 'date',
  type: 'string',
  format: 'date-time',
  description: 'Time at which the history entry was created'
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

module.exports = {
  historySchema,
  _idSchema,
  targetIDSchema
}
