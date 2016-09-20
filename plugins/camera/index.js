module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var RaspiCam = require("raspicam");
    var cam = new RaspiCam({
        tl: 5000,
        q: 100,
        w: 3280,
        h: 2464,
        mode: "timelapse",
        output: process.cwd() + "/images/image.jpg",
        ex: "auto"
    });

    cam.on("read", function(err, timestamp, filename){
      imports.uploader.upload(process.cwd() + "/images/" + filename)
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
