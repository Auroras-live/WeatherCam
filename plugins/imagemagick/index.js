module.exports = function setup(options, imports, register) {
  var package = require("./package.json")
  var fs = require("fs")

  imagemagickObj = {
    plugin: package
  }

  register(null, {
    imagemagick: imagemagickObj
  });
};
