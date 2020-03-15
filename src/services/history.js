const { ObjectID } = require('mongodb')
const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')

module.exports = class HistoryService {
  constructor(mongol) {
    this.historyColection = mongol
      .collection('history')
      .attachHook(createTimestampHook())
  }

  async getHistoryByTargetID(id, limit, after, before) {
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
