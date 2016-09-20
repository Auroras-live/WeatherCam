module.exports = function setup(options, imports, register) {
  var package = require("./package.json")
  var fs = require("fs")

  cameraObj = {
    plugin: package
  }

  register(null, {
    camera: cameraObj
  });
};
