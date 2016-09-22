module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var cp = require("child_process")
    cameraObj = {
        plugin: package,
        start: function() {
          if(typoeof imports.config.config.flipImage !== "undefined") {
            flip = "-vf"
          } else {
            flip = ""
          }
            cp.exec("/opt/vc/bin/raspistill " + flip + " --timelapse 1000 --quality 100 --width 1440 --height 900 --output " + process.cwd() + "/images/image.jpg -t 999999999 --exposure auto -a 4 -a \"" + imports.config.config.location + " %Y-%m-%d %X%z\"")
            setInterval(function() {
              imports.imagemagick.watermark(process.cwd() + "/images/image.jpg")
            }, 60000)
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
