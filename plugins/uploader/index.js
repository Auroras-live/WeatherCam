module.exports = function setup(options, imports, register) {
    var package = require("./package.json")
    var request = require("request")
    var fs = require("fs")

    imports.eventbus.on("camera.photo.taken", function(file) {
        imports.logger.log("Uploading file: " + file)
        uploaderObj.upload(file)
    })

    // Define our plugin and functions
    var uploaderObj = {
        plugin: package,
        upload: function(file) {
            var req = request.post({
                url: options.options.endpoint,
                strictSSL: false
            }, function(err, resp, body) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log(body)
                }
            });
            var form = req.form();
            form.append('file', fs.createReadStream(file));
        }
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        uploader: uploaderObj
    });
};
