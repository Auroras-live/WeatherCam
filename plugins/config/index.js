module.exports = function setup(options, imports, register) {
  var package = require("./package.json")
  var fs = require("fs")
  var _ = require("lodash")

  configObj = {
    plugin: package,
    config: null,
    load: function() {
      configObj.config = JSON.parse(fs.readFileSync(options.options.configFile, 'utf8'))
      imports.eventbus.emit("config.loaded")
      return true
    },
    save: function() {
      fs.writeFileSync(options.options.configFile, JSON.stringify(this.config))
      imports.eventbus.emit("config.saved")
    },
    get: function(option, defaultValue) {
      return _.get(this.config, option, defaultValue)
    }
  }

  register(null, {
    config: configObj
  })
}
