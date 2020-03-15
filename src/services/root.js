const axios = require('axios')
const { ObjectID } = require('mongodb')
const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')

const { GATEWAY_ADDRESS } = process.env

module.exports = class RootService {
  constructor(mongol) {
    this.watchCollection = mongol
      .collection('watches')
      .attachHook(createTimestampHook())
    this.historyCollection = mongol
      .collection('history')
      .attachHook(createTimestampHook())
  }

  async createWatch(data) {
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

  async getWatchByID(id) {
    const _id = new ObjectID(id)
    const result = await this.watchCollection.findOne({ _id })
    return result
  }

  async updateWatchTargets(id, updatedTargets) {
    const _id = new ObjectID(id)
    let { targets } = await this.watchCollection.findOne({ _id })

    targets = targets.map((target) => {
      let newTarget = target
      for (const updatedTarget of updatedTargets) {
        updatedTarget._id = new ObjectID(updatedTarget._id)
        if (target._id.equals(updatedTarget._id)) {
          newTarget = updatedTarget
          newTarget.updatedAt = new Date()
          this.historyCollection.insertOne({
            watchID: _id,
            targetID: target._id,
            data: updatedTarget.data
          })
          break
        }
      }
      return newTarget
    })

    this.watchCollection.updateOne({ _id }, { $set: { targets, checkedAt: new Date() } })
  }

  async updateWatchStatus(id, newStatus) {
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

  async getWatchsByUserID(id) {
    const userID = new ObjectID(id)
    const result = await this.watchCollection.find({ userID }).toArray()
    return result
  }
}
