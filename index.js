var fs = require("fs")
var architect = require("architect")
var winston = require("winston")

// Winston is configured here, but to log plugin stuff, you'll want to use the logger plugin
winston.configure({
  transports: [
   new (winston.transports.Console)( {
       'timestamp': true,
       'colorize': true
   }),
   new (winston.transports.File)({ filename: "./logs/weathercam.log" })
 ]
})

plugins = architect.resolveConfig(JSON.parse(fs.readFileSync("./plugins/plugins.json", 'utf8')), __dirname)

architectApp = architect.createApp(plugins, function (err, app) {
    if (err) {
        throw "Error while trying to start app. Error was: " + err
    }
})

// A plugin has been loaded
architectApp.on("service", function(name, service) {
  winston.info("Loaded plugin: " + service.plugin.description)
})

// A plugin failed with an error
architectApp.on("error", function(err) {
  winston.error(err)
})

architectApp.on("ready", function(app) {
  app.services.eventbus.emit("app.ready")
  app.services.config.load()
  app.services.camera.start()
})
