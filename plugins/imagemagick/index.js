module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var gm = require("gm")
    var request = require("request")

    imagemagickObj = {
        plugin: package,
        watermark: function(image) {
            imports.logger.log("imagemagick", "Getting weather for " + imports.config.config.lat + ", " + imports.config.config.long)
            weather = request({
                url: "https://api.auroras.live/v1/?type=all&weather=true&forecast=false&probability=true&threeday=false&ace=false&lat=" + imports.config.config.lat + "&long=" + imports.config.config.long + "&tz=" + (new Date()).getTimezoneOffset(),
                json: true
            }, function(err, obj, body) {
                if(err) { throw new Error(err) }
                imports.logger.log("imagemagick", "Weather retrieved", "info", body)
                imageText = body.weather.location.name + ", " + body.weather.location.state + ", " + body.weather.location.country + " " + body.date + "\nCloud: " + body.weather.cloud + "% | Temp: " + body.weather.temperature + "°C | Rain: " + body.weather.rain + "mm\nLocal aurora probability: " + body.probability.calculated.value + "%" 
                gm(image).font(process.cwd() + "/OpenSans-Regular.ttf").fontSize(30).stroke('black', 1).fill('white').drawText(0, 40, imageText, 'north').stroke('none').fill('white').drawText(0, 40, imageText, 'north').write(process.cwd() + "/images/image_watermark.jpg", function(err) {
                  imports.logger.log("imagemagick", "Writing text to " + image)
                    gm(process.cwd() + "/images/image_watermark.jpg").composite(process.cwd() + '/logo.png').gravity("SouthEast").geometry("+25+25").write(process.cwd() + "/images/image_watermark.jpg", function(err) {
                        imports.logger.log("imagemagick", "Writing watermark to " + process.cwd() + "/images/image_watermark.jpg")
                        if (err) {
                            imports.logger.error("imagemagick", err)
                        } else {
                            imports.logger.log("imagemagick", "Image watermarked. Proceeding to upload")
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
