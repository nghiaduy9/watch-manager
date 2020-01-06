const Id = {
  bsonType: 'objectId',
  minLength: 24,
  maxLength: 24,
  description: 'ID of watch'
}

const UserID = {
  bsonType: 'objectId',
  minLength: 24,
  maxLength: 24,
  description: 'ID of the user to whom this watch belongs'
}

const Url = {
  bsonType: 'string',
  description: 'URL to crawl'
}

const Interval = {
  bsonType: 'int',
  minimum: 300,
  description: 'Number of seconds between executions'
}

const Targets = {
  bsonType: 'array',
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
  minItems: 1,
  description: 'Array of target objects'
}

const Active = {
  bsonType: 'bool',
  description: 'Being scheduled or not'
}

const CreatedAt = {
  bsonType: 'date',
  description: 'Time at which the user was created'
}

const UpdatedAt = {
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
    _id: Id,
    userID: UserID,
    url: Url,
    interval: Interval,
    targets: Targets,
    active: Active,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt
  }
}

module.exports = { Watch }
