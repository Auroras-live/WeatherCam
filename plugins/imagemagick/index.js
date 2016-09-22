module.exports = function setup(options, imports, register) {
  var package = require("./package.json")
  var fs = require("fs")
  var gm = require("gm")

  imagemagickObj = {
    plugin: package,
    watermark: function(image) {
      gm(image).composite(process.cwd() + '/logo.png').gravity("SouthEast").geometry("+25+25").write(process.cwd() + "/images/image_watermark.jpg", function(err) {
        if(err) {
          console.log(err)
        } else {
          imports.uploader.upload(process.cwd() + "/images/image_watermark.jpg")
        }
      })
    }
  }

  register(null, {
    imagemagick: imagemagickObj
  });
};
