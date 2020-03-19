const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const { ObjectID } = require('mongodb')

module.exports = class HistoryService {
  constructor(mongol) {
    this.historyColection = mongol.collection('history').attachHook(createTimestampHook())
  }

  async getByTargetID(id, limit, after, before) {
    const targetID = new ObjectID(id)
    if (before === undefined) before = new Date()
    const result = await this.historyColection
      .find({ targetID, createdAt: { $gt: new Date(after), $lt: new Date(before) } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return result
  }
}
