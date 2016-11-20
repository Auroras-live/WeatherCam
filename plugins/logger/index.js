module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var winston = require('winston')
    var fs = require("fs")

    try {
      // If file is greater than 10mb
      if(fs.statSync(options.options.logfile)["size"] / 1000000.0 > 10) {
        // Delete it
        fs.unlink(options.options.logfile)
      }
    // Error is thrown if file doesn't exist (e.g. on first run)
    // so we ignore it.
    } catch(ex) {

    }

    winston.configure({
      transports: [
       new (winston.transports.Console)( {
           'timestamp': true,
           'colorize': true
       }),
       new (winston.transports.File)({ filename: options.options.logfile })
     ]
    })

    winston.level = process.env.LOG_LEVEL || 'debug'
    loggerObj = {
        plugin: package,
        log: function(module, text, type, obj) {
            if (typeof type === "undefined") {
                type = "info"
            }
            winston.log(type, "(" + module + ") " + text, obj || null)
            imports.eventbus.emit("logger." + type, text, module, obj)
        },
        error: function(module, text) {
            this.log(module, text, "error")
        },
        warn: function(module, text) {
            this.log(module, text, "warn")
        },
        debug: function(module, text) {
            this.log(module, text, "debug")
        },
        query: winston.query.bind(winston)
    }

    register(null, {
        logger: loggerObj
    })
}
