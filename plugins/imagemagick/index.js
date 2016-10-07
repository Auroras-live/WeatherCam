module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var gm = require("gm")
    var moment = require("moment")
    var request = require("request")
    var fontsize = 30
    var iconsize = 28

    imagemagickObj = {
        plugin: package,
        watermark: function(image) {

            imports.logger.log("imagemagick", "Getting weather for " + imports.config.config.lat + ", " + imports.config.config.long)
            weather = request({
                url: "https://api.auroras.live/v1/?type=all&weather=true&forecast=false&probability=true&threeday=false&ace=false&lat=" + imports.config.config.lat + "&long=" + imports.config.config.long + "&tz=" + (new Date()).getTimezoneOffset(),
                json: true
            }, function(err, obj, body) {
                if (err) {
                    imports.logger.log("imagemagick", "Error getting weather. Error was: ", err)
                }
                imports.logger.log("imagemagick", "Weather retrieved", "info", body)
                imageText = body.weather.cloud + "%\n" + body.weather.temperature + "°C\n" + body.weather.rain + "mm\n" + body.weather.fog + "%\n" + body.weather.wind.speed + "km/h " + body.weather.wind.direction + "\n" + moment(body.date).format("Y-MM-DD HH:mm:ss Z") + "\n" + moment(body.weather.sunset).format("Y-MM-DD HH:mm:ss Z") + "\n" + body.weather.location.name + ", " + body.weather.location.state + " " + body.weather.location.country
                // Cloud, temperature, rain, fog, wind, time, sunset, location
                switch(body.weather.wind.direction) {
                  case "N":
                    iconText = '\uf013\n\uf055\n\uf017\n\uf014\n\uf05c\n\uf08c\n\uf052\n\uf0eb'
                    break;
                  case "NE":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf05a\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "E":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf059\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "SE":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf05d\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "S":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf060\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "SW":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf05e\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "W":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf061\n\uf08c\n\uf052\n\uf0eb"
                    break;
                  case "NW":
                    iconText = "\uf013\n\uf055\n\uf017\n\uf014\n\uf05b\n\uf08c\n\uf052\n\uf0eb"
                    break;
                }

                gm(image).font(process.cwd() + "/weathericons-regular-webfont.ttf").fontSize(iconsize).stroke('black', 1).fill('white').drawText(25, 25, iconText, 'SouthWest').stroke('none').fill('white').drawText(25, 25, iconText, 'SouthWest').write(process.cwd() + "/images/image_watermark.jpg", function(err) {
                    gm(process.cwd() + "/images/image_watermark.jpg").font(process.cwd() + "/OpenSans-Regular.ttf").fontSize(fontsize).stroke('black', 1).fill('white').drawText(85, 25, imageText, 'SouthWest').stroke('none').fill('white').drawText(85, 25, imageText, 'SouthWest').write(process.cwd() + "/images/image_watermark.jpg", function(err) {
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
            })
        }
    }
    register(null, {
        imagemagick: imagemagickObj
    });
};
