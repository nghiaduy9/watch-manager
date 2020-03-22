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

  async create(data) {
    const { userID, url, interval, targets } = data
    const newTargets = targets.map((target) => {
      target._id = new ObjectID()
      return target
    })
    // add a document into the database
    const { insertedId } = await this.watchCollection.insertOne({
      userID: new ObjectID(userID),
      url,
      interval,
      targets: newTargets,
      active: true
    })

    // add this watch into the scheduler
    const { status } = await axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
      interval,
      payload: { watchID: insertedId }
    })
    if (status < 200 || status >= 300)
      throw new Error('Unable to add this watch to the scheduler')
  }

  async getByID(id) {
    const _id = new ObjectID(id)
    const watch = await this.watchCollection.findOne({ _id })
    for (const target of watch.targets) {
      const targetID = new ObjectID(target._id)
      const history = await this.historyCollection.find({ targetID })
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

  async updateTargetData(id, data) {
    const _id = new ObjectID(id)
    const watch = await this.watchCollection.findOne({ targets: { $elemMatch: { _id } } })
    this.historyCollection.insertOne({
      watchID: watch._id,
      targetID: _id,
      data
    })
    this.updateCheckedAt(watch._id)
  }

  async updateCheckedAt(id) {
    const _id = new ObjectID(id)
    await this.watchCollection.updateOne({ _id }, { $set: { checkedAt: new Date() } })
  }

  async updateStatus(id, newStatus) {
    const _id = new ObjectID(id)
    if (newStatus === 'inactive') {
      axios.delete(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
        data: { payload: { watchID: _id } }
      })
      this.watchCollection.updateOne({ _id }, { $set: { active: false } })
    } else if (newStatus === 'active') {
      const watch = await this.watchCollection.findOne({ _id })
      const { active, interval } = watch
      if (!active) {
        axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
          interval,
          payload: { watchID: _id }
        })
        this.watchCollection.updateOne({ _id }, { $set: { active: true } })
      }
    }
  }

  async getByUserID(id) {
    const userID = new ObjectID(id)
    const watchs = await this.watchCollection.find({ userID }).toArray()
    for (const watch of watchs) {
      for (const target of watch.targets) {
        const targetID = new ObjectID(target._id)
        const history = await this.historyCollection.find({ targetID })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray()
        if (history.length !== 0) {
          target.data = history[0].data
          target.updatedAt = history[0].createdAt
        }
      }
    }
    return watchs
  }
}
