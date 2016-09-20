module.exports = function setup(options, imports, register) {
    var EventEmitter = require("pattern-emitter")
    var package = require("./package.json")
    var io = require("socket.io")()

    var emitter = new EventEmitter()
    eventbusObj = {
        plugin: package,
        emitter: emitter,
        emit: function() {
          io.sockets.emit(emitter.event, arguments)
          emitter.emit.bind(emitter).apply(this, arguments)
        },
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        error: function(err, module) {
            eventbusObj.emit("error", err, module)
        }
    }

    io.listen(3000)

    register(null, {
        eventbus: eventbusObj
    });
};
