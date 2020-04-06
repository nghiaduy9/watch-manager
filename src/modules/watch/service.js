const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const axios = require('axios')
const { ObjectID } = require('mongodb')

const { GATEWAY_ADDRESS } = process.env

module.exports = class WatchService {
  constructor(mongol) {
    this.watchCollection = mongol.collection('watches').attachHook(createTimestampHook())
    this.historyCollection = mongol
      .collection('history')
      .attachHook(createTimestampHook())
  }

  async aggregate(watch) {
    for (const target of watch.targets) {
      const history = await this.historyCollection
        .find({ targetID: target._id })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray()
      if (history.length !== 0) {
        target.data = history[0].data
        target.updatedAt = history[0].createdAt
      }
    }
    return watch
  }

  async create(data) {
    const { userID, url, interval, templateID } = data
    let { targets } = data
    targets = targets.map((target) => {
      target._id = new ObjectID()
      target.tid = target.tid ? new ObjectID(target.tid) : undefined
      return target
    })

    // add a document into the database
    const { insertedId, ops } = await this.watchCollection.insertOne({
      userID: new ObjectID(userID),
      url,
      interval,
      templateID: templateID ? new ObjectID(templateID) : undefined,
      targets,
      active: true,
    })

    // add this watch into the scheduler
    await axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
      interval,
      payload: { watchID: insertedId },
    })

    return this.aggregate(ops[0])
  }

  async getByID(id) {
    const _id = new ObjectID(id)
    const watch = await this.watchCollection.findOne({ _id })
    return this.aggregate(watch)
  }

  async updateCheckedAt(id) {
    const _id = new ObjectID(id)
    const watch = await this.watchCollection.findOneAndUpdate(
      { _id },
      { $set: { checkedAt: new Date() } }
    )
    if (!watch) return
    return { checkedAt: watch.checkedAt }
  }

  async updateStatus(id, newStatus) {
    const _id = new ObjectID(id)
    if (newStatus === 'inactive') {
      await axios.delete(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
        data: { payload: { watchID: _id } },
      })
      const watch = await this.watchCollection.findOneAndUpdate(
        { _id },
        { $set: { active: false } }
      )
      if (!watch) return
      return { active: watch.active }
    } else if (newStatus === 'active') {
      // this block should be an atomic transaction, need to be fixed later
      const watch = await this.watchCollection.findOne({ _id })
      if (!watch) return
      const { interval } = watch
      await axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
        interval,
        payload: { watchID: _id },
      })
      await this.watchCollection.updateOne({ _id }, { $set: { active: true } })
      return { active: true }
    }
  }

  async updateTargetData(id, data) {
    const _id = new ObjectID(id)
    const watch = await this.watchCollection.findOne({ targets: { $elemMatch: { _id } } })
    if (!watch) return
    await this.historyCollection.insertOne({
      watchID: watch._id,
      targetID: _id,
      data,
    })
    await this.updateCheckedAt(watch._id)
    return this.aggregate(watch)
  }

  async getByUserID(id) {
    const userID = new ObjectID(id)
    const watches = await this.watchCollection.find({ userID }).toArray()
    return Promise.all(watches.map((watch) => this.aggregate(watch)))
  }
}
