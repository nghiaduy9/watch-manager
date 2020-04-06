const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const picomatch = require('picomatch')
const { ObjectID } = require('mongodb')

module.exports = class TemplateService {
  constructor(mongol) {
    this.templateCollection = mongol
      .collection('templates')
      .attachHook(createTimestampHook())
  }

  async create(data) {
    const { name, urlPattern } = data
    let { targets } = data
    targets = targets.map((target) => {
      target._id = new ObjectID()
      return target
    })
    const { ops } = await this.templateCollection.insertOne({
      name,
      urlPattern,
      targets,
    })
    return ops[0]
  }

  async get(url) {
    const templates = await this.templateCollection.find().toArray()
    if (url) {
      const matchedTemplates = templates.filter((template) => {
        const isMatch = picomatch(template.urlPattern)
        if (isMatch(url)) return template
      })
      return matchedTemplates
    }
    return templates
  }
}
