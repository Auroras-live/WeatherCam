module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var fs = require("fs")
    var gm = require("gm")
    var moment = require("moment")
    var request = require("request")
    var fontsize = 30
    var iconsize = 28

    imports.eventbus.on("camera.snap.success", function(image) {
      imports.logger.log("graphicsmagick", "Photo taken. graphicsmagick watermarking")
      graphicsmagickObj.watermark(image)
    })

    graphicsmagickObj = {
        plugin: package,
        watermark: function(image) {

            imports.logger.log("graphicsmagick", "Getting weather for " + imports.config.get("location.lat", null) + ", " + imports.config.get("location.long", null))
            weather = request({
                url: "https://api.auroras.live/v1/?type=all&weather=true&forecast=false&probability=true&threeday=false&ace=false&lat=" + imports.config.get("location.lat", null) + "&long=" + imports.config.get("location.long", null) + "&tz=" + imports.config.get("location.timezone", (new Date()).getTimezoneOffset()),
                json: true
            }, function(err, obj, body) {
                if (err) {
                    imports.logger.log("graphicsmagick", "Error getting weather. Error was: ", err)
                }
                imports.logger.log("graphicsmagick", "Weather retrieved", "info", body)
                imageText = body.weather.cloud + "%\n"
                + body.weather.temperature + "°C\n"
                + body.weather.rain + "mm\n"
                + body.weather.fog + "%\n"
                + body.weather.wind.speed
                + "km/h " + body.weather.wind.direction + "\n"
                + moment(body.date).format("Y-MM-DD HH:mm:ss Z") + "\n"
                + moment(body.weather.sunset).format("Y-MM-DD HH:mm:ss Z") + "\n"
                + imports.config.get("location.name", body.weather.location.name + ", " + body.weather.location.state + " " + body.weather.location.country)


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

                gm(image)
                .font(imports.config.get("camera.output.fonts.weather", process.cwd() + "/fonts/weathericons-regular-webfont.ttf"))
                .fontSize(iconsize)
                .stroke('black', 1)
                .fill('white')
                .drawText(25, 25, iconText, 'SouthWest')
                .stroke('none')
                .fill('white')
                .drawText(25, 25, iconText, 'SouthWest')
                .write(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"), function(err) {
                    gm(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
                    .font(imports.config.get("camera.output.fonts.text", process.cwd() + "/fonts/OpenSans-Regular.ttf"))
                    .fontSize(fontsize)
                    .stroke('black', 1)
                    .fill('white')
                    .drawText(85, 25, imageText, 'SouthWest')
                    .stroke('none')
                    .fill('white')
                    .drawText(85, 25, imageText, 'SouthWest')
                    .write(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"), function(err) {
                        imports.logger.log("graphicsmagick", "Writing text to " + image)
                        gm(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
                        .composite(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.watermark", "logo.png"))
                        .gravity("SouthEast")
                        .geometry("+25+25")
                        .write(imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"), function(err) {
                            imports.logger.log("graphicsmagick", "Writing watermark to " + imports.config.get("camera.path", process.cwd() + "/images/") + imports.config.get("camera.watermark", "image.jpg"))
                            if (err) {
                                imports.logger.error("graphicsmagick", err)
                            } else {
                                imports.logger.log("graphicsmagick", "Image watermarked. File saved to " + imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
                                imports.eventbus.emit("graphicsmagick.watermarked", imports.config.get("camera.output.path", process.cwd() + "/images/") + imports.config.get("camera.output.filename", "image.jpg"))
                            }
                        })
                    })
                })
            })
        }
    }
    register(null, {
        graphicsmagick: graphicsmagickObj
    });
};
