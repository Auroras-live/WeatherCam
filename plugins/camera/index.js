module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var cp = require("child_process")
    cameraObj = {
        plugin: package,
        start: function() {
            flip = ""
            if (typeof imports.config.config.flip.horizontal !== "undefined") {
                flip += " -hf "
            }

            if (typeof imports.config.config.flip.vertical !== "undefined") {
                flip += " -vf "
            }

            cp.exec("/opt/vc/bin/raspistill " + flip + " --timelapse " + imports.config.config.timelapse + " --quality 100 --width 1440 --height 900 --output " + process.cwd() + "/images/image.jpg -t 999999999 --exposure auto -a 4 -a \"" + imports.config.config.location + " %Y-%m-%d %X%z\"")
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
