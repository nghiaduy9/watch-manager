const { createTimestampHook } = require('@albert-team/mongol/builtins/hooks')
const picomatch = require('picomatch')

module.exports = class TemplateService {
  constructor(mongol) {
    this.templateCollection = mongol
      .collection('templates')
      .attachHook(createTimestampHook())
  }

  async create(data) {
    const { name, urlPattern, targets } = data
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
