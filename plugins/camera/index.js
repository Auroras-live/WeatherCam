module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var RaspiCam = require("raspicam");
    var cam = new RaspiCam({
        ts: 300000,
        mode: "timelapse",
        output: process.cwd() + "/images/image.jpg",
        ex: "auto"
    });

    camera.on("read", function(err, timestamp, filename){
      imports.eventbus.emit("camera.photo.taken", filename)
    });

    cameraObj = {
        plugin: package,
        start: function() {
          cam.start()
        },
        stop: function() {
          cam.stop()
        }
    }

    register(null, {
        camera: cameraObj
    });
};
