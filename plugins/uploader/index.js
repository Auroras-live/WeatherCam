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

          request.post({url: options.options.endpoint, formData: formData}, function(err, httpResponse, body) {
            if (err) {
              return console.error('upload failed:', err);
            }
            console.log('Upload successful!  Server responded with:', body);
          });
        }
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        uploader: uploaderObj
    });
};
