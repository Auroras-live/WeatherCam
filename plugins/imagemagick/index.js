module.exports = function setup(options, imports, register) {
  var package = require("./package.json")
  var fs = require("fs")
  var gm = require("gm")

  imagemagickObj = {
    plugin: package,
    watermark: function(image) {
      gm(image).composite(process.cwd() + 'logo.png').write(image, function(err) {
        if(err) {
          console.log(err)
        } else {
          imports.uploader.upload(process.cwd() + "/images/image.jpg")
        }
      })
    }
  }

  register(null, {
    imagemagick: imagemagickObj
  });
};
