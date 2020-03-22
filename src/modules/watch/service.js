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
    const { userID, url, interval } = data
    let { targets } = data
    targets = targets.map((target) => {
      target._id = new ObjectID()
      return target
    })

    // add a document into the database
    const { insertedId, ops } = await this.watchCollection.insertOne({
      userID: new ObjectID(userID),
      url,
      interval,
      targets,
      active: true
    })

    // add this watch into the scheduler
    await axios.post(`${GATEWAY_ADDRESS}/api/scheduler/watches`, {
      interval,
      payload: { watchID: insertedId }
    })

    return ops[0] // this should be aggregatedWatch, need to be fixed later
  }

  async getByID(id) {
    const _id = new ObjectID(id)
    return this.watchCollection.findOne({ _id }) // this should be aggregatedWatch, need to be fixed later
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
        data: { payload: { watchID: _id } }
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
        payload: { watchID: _id }
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
      data
    })
    await this.updateCheckedAt(watch._id)
    return watch // this should be aggregatedWatch, need to be fixed later
  }

  async getByUserID(id) {
    const userID = new ObjectID(id)
    return this.watchCollection.find({ userID }).toArray() // this should be aggregatedWatches, need to be fixed later
  }
}
