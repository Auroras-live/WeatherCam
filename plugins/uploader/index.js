module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var request = require("request")
    var FormData = require('form-data')
    var form = new FormData()
    var fs = require("fs")

    // Define our plugin and functions
    var uploaderObj = {
        plugin: package,
        upload: function(file) {
          var formData = {
            file: fs.createReadStream(file),
          };

          request.post({url: options.options.endpoint + "?key=" + imports.config.config.apikey, strictSSL: false, formData: formData}, function(err, httpResponse, body) {
            if (err) {
              return imports.logger.error("uploader", 'upload failed: ' + err)
            }
            imports.logger.log("uploader", "File uploaded. Server responded with: ", "info", body)
          });
        }
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        uploader: uploaderObj
    });
};
