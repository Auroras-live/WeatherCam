module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var RaspiCam = require("raspicam");
    var cam = new RaspiCam({
        ts: 5000,
        mode: "timelapse",
        output: process.cwd() + "/images/image.jpg",
        ex: "auto"
    });

    cam.on("read", function(err, timestamp, filename){
      imports.eventbus.emit("camera.photo.taken", filename)
    });

    cam.on("start", function(err, timestamp){
      if(err) {
        console.dir(err)
      }
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
