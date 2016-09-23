module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var gm = require("gm")
    var request = require("request")

    imagemagickObj = {
        plugin: package,
        watermark: function(image) {
            weather = request({
                url: "https://api.auroras.live/v1/?type=weather&lat=" + imports.config.config.lat + "&long=" + imports.config.config.long,
                json: true
            }, function(err, obj, body) {
                gm(image).fontSize(30).stroke('black', 1).fill('white').drawText(0, 40, imports.config.config.location + " " + body.date + "\nCloud: " + body.cloud + "% | Temp: " + body.temperature + "°C | Rain: " + body.rain + "mm", 'north').write(process.cwd() + "/images/image_watermark.jpg", function(err) {
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
