module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var request = require("request")
    var FormData = require('form-data')
    var form = new FormData()
    var fs = require("fs")

    imports.eventbus.on("graphicsmagick.watermarked", function(file) {
      uploaderObj.upload(file)
    })
    // Define our plugin and functions
    var uploaderObj = {
        plugin: package,
        upload: function(file) {
          imports.logger.log("uploader", "Uploading " + file + " to " + imports.config.get("endpoint", options.options.endpoint))
          var formData = {
            file: fs.createReadStream(file),
          };

          request.post({url: imports.config.get("endpoint", options.options.endpoint) + "?key=" + imports.config.get("apikey", null), strictSSL: false, formData: formData}, function(err, httpResponse, body) {
            if (err) {
              imports.eventbus.emit("uploader.upload.failed")
              return imports.logger.error("uploader", 'upload failed: ' + err)
            }
            imports.eventbus.emit("uploader.upload.complete")
            imports.logger.log("uploader", "File uploaded. URL is: " + body)
          });
        }
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        uploader: uploaderObj
    });
};
