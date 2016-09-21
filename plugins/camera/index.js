module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var RaspiCam = require("raspicam");
    var cam = new RaspiCam({
        mode: "timelapse",
        timelapse: 10000,
        quality: 100,
        width: 1440,
        height: 900,
        output: process.cwd() + "/images/image.jpg",
        exposure: "auto"
    });

    cam.on("read", function(err, timestamp, filename){
      if(filename.indexOf("~") == -1) {
        imports.uploader.upload(process.cwd() + "/images/" + filename)
      }
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
