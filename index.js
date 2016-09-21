var fs = require("fs")
var architect = require("architect")
var cfonts = require("cfonts")

console.log()
console.log()
cfonts.say(' auroras.live', {
    font: 'block',        //define the font face
    align: 'left',        //define text alignment
    colors: ["white", "black"], //define all colors
    background: 'black', //define the background color
    letterSpacing: 1,     //define letter spacing
    lineHeight: 1,        //define the line height
    space: false,          //define if the output text should have empty lines on top and on the bottom
    maxLength: '0'        //define how many character can be on one line
})
cfonts.say(' weather cam', {
    font: 'block',        //define the font face
    align: 'left',        //define text alignment
    colors: ["white", "black"], //define all colors
    background: 'black', //define the background color
    letterSpacing: 1,     //define letter spacing
    lineHeight: 1,        //define the line height
    space: false,          //define if the output text should have empty lines on top and on the bottom
    maxLength: '0'        //define how many character can be on one line
})


console.log()
console.log()

// A list of plugins we'd like to load. Some of them require options, so be sure to check the plugin for what options are required
plugins = architect.resolveConfig(JSON.parse(fs.readFileSync("./plugins/plugins.json", 'utf8')), __dirname);

console.log("Loading plugins..")
console.log()
// Start our app. The callback happens when all plugins have loaded, so plugin order shouldn't really matter
architectApp = architect.createApp(plugins, function (err, app) {
    if (err) {
        throw "Error while trying to start app. Error was: " + err
    }

});

architectApp.on("service", function(name, service) {
  console.log("Loaded plugin: " + service.plugin.description)
})

architectApp.on("error", function(err) {
  console.log(err)
})

architectApp.on("ready", function(app) {
  app.services.eventbus.emit("app.ready")
  app.services.config.load()
  app.services.camera.start()
})
