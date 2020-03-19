const axios = require('axios').default

module.exports = class Scheduler {
  constructor() {
    this.axios = axios.create({
      timeout: 1000
    })
  }
}
