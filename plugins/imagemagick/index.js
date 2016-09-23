module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var gm = require("gm")
    var moment = require("moment")
    var request = require("request")

    imagemagickObj = {
        plugin: package,
        watermark: function(image) {
            weather = request({
                url: "https://api.auroras.live/v1/?type=weather&lat=" + imports.config.config.lat + "&long=" + imports.config.config.long,
                json: true
            }, function(err, obj, body) {
                gm(image).fontSize(60).stroke('black', 1).fill('white').drawText(0, 20, imports.config.config.location + " " + moment().format() + "\nCloud: " + body.cloud + "%", 'north').write(process.cwd() + "/images/image_watermark.jpg", function(err) {
                    gm(process.cwd() + "/images/image_watermark.jpg").composite(process.cwd() + '/logo.png').gravity("SouthEast").geometry("+25+25").write(process.cwd() + "/images/image_watermark.jpg", function(err) {
                        // gm(image).composite(process.cwd() + '/logo.png').gravity("SouthEast").geometry("+25+25")
                        if (err) {
                            console.log(err)
                        } else {
                            imports.uploader.upload(process.cwd() + "/images/image_watermark.jpg")
                        }
                    })
                })
            })
        }
    }
    register(null, {
        imagemagick: imagemagickObj
    });
};
