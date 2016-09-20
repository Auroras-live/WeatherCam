module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var winston = require('winston');

    winston.remove(winston.transports.Console);
    winston.add(require('winston-daily-rotate-file'), {
        filename: options.options.logfile,
        prepend: true
    })
    winston.add(winston.transports.Console, {
        'timestamp': true,
        'colorize': true
    });

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
    });
};
