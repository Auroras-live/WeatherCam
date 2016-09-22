module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var cp = require("child_process")
    cameraObj = {
        plugin: package,
        start: function() {

            cp.exec("/opt/vc/bin/raspistill --timelapse 60000 --quality 100 --width 1440 --height 900 --output " + process.cwd() + "/images/image.jpg -t 999999999 --exposure auto -a 4 -a \"" + imports.config.config.location + " %Y-%m-%d %X%z\"")
            fs.watch(process.cwd() + "/images/", function(eventType, filename) {
                if (filename === "image.jpg") {
                    console.log("Image found. Watermarking")
                    imports.imagemagick.watermark(process.cwd() + "/images/image.jpg")
                }
            });
        },
        stop: function() {

        },
        snap: function() {
            cp.execSync("/opt/vc/bin/raspistill --quality 100 --width 1440 --height 900 --output " + process.cwd() + "/images/image_preview.jpg --exposure auto -a 4 -a \"" + imports.config.config.location + " %Y-%m-%d %X%z\"")        
        }
    }

    register(null, {
        camera: cameraObj
    });
};
