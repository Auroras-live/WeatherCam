module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var _ = require("lodash") // For shuffling arrays
    var cp = require("child_process") // For running our audio player

    // Define our plugin and functions
    var updaterObj = {
        plugin: package,
        update: function() {
          imports.logger.log("updater", "Attempting to update", "warn")
          imports.eventbus.emit("updater.update.start")
          imports.logger.log("updater", cp.exec("gulp update", { cwd: process.cwd() }), "info")
        }
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        updater: updaterObj
    });
};
