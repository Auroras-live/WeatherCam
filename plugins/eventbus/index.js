module.exports = function setup(options, imports, register) {
    var Emitter = require("pattern-emitter")
    var package = require("./package.json")

    var emitter = new Emitter()
    eventbusObj = {
        plugin: package,
        emit: emitter.emit.bind(emitter),
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        error: function(err, module) {
            eventbusObj.emit("error", err, module)
        }
    }

    register(null, {
        eventbus: eventbusObj
    })
}
