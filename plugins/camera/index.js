module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var cp = require("child_process")
    cameraObj = {
        plugin: package,
        timer: null,
        start: function() {
            this.timer = setInterval(function() {
                this.snap()
            }.bind(this), imports.config.get("camera.interval", 300000))
            imports.eventbus.emit("camera.start")
        },
        stop: function() {
          clearInterval(this.timer)
          imports.eventbus.emit("camera.stop")
        },
        // Test function for use when developing on Windows
        snapTest: function() {
          imports.logger.log("camera", "snapTest called. Saving file to " + imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
          imports.eventbus.emit("camera.snap.success", imports.config.get("camera.output.path", process.cwd() + "/images/") + "test.jpg")
        },
        snap: function() {
          flip = ""
          if (imports.config.get("camera.flip.horizontal", true)) {
              flip += " -hf "
          }

          if (imports.config.get("camera.flip.vertical", false)) {
              flip += " -vf "
          }

          cp.exec("/opt/vc/bin/raspistill " + flip + " --quality 100 --width " + imports.config.get("camera.size.width", 1440) + " --height " + imports.config.get("camera.size.height", 900) + " --output " + imports.config.get("camera.output.filename", process.cwd() + "/images/image.jpg") + " --exposure auto", function(err) {
            if(err) {
              imports.logger.error("camera", "Failed to run command! Error was: " + err)
              imports.eventbus.emit("camera.snap.fail")
            } else {
              imports.logger.log("camera", "Called rapistill. File saved to " + imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
              imports.eventbus.emit("camera.snap.success", imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
            }
          })
        }
    }

    register(null, {
        camera: cameraObj
    })
}
