module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var cp = require("child_process")
    cameraObj = {
        plugin: package,
        start: function() {
            cp.exec("/opt/vc/bin/raspistill --timelapse 60000 --quality 100 --width 1440 --height 900 --output " + process.cwd() + "/images/image.jpg --exposure auto -a \"" + imports.config.config.location + " %Y-%m-%d " + (new Date()).getTimezoneOffset() + "\"")
            fs.watch(process.cwd() + "/images/", function(eventType, filename) {
                if (filename === "image.jpg") {
                    console.log("Image found. Uploading")
                    imports.uploader.upload(process.cwd() + "/images/image.jpg")
                }
            });
        },
        stop: function() {
            cam.stop()
        }
    }

    register(null, {
        camera: cameraObj
    });
};
