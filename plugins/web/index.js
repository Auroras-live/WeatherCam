module.exports = function setup(options, imports, register) {
    var package = require("./package.json")

    var finalhandler = require('finalhandler')
    var http = require('http')
    var serveStatic = require('serve-static')

    // Serve up public/ftp folder
    var serve = serveStatic(process.cwd() + '/images', {'index': ['index.html', 'index.htm']})

    // Create server
    var server = http.createServer(function onRequest (req, res) {
      serve(req, res, finalhandler(req, res))
    })

    // Listen
    server.listen(3000)

    // Define our plugin and functions
    var webObj = {
        plugin: package
    }

    // Finally, register our plugin so Architect can do its magic.
    register(null, {
        web: webObj
    });
};
