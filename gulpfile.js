var gulp = require('gulp');
var gutil = require('gulp-util');

var sh = require('shelljs');
var cp = require("child_process")
var nodemon = require('gulp-nodemon')
var path = require('path');
var fs = require("fs")

gulp.task('update-git', function() {
  cp.execSync("git reset --hard")
  cp.execSync("git pull")
})

gulp.task("update", ['update-git', 'install-plugins', 'reboot'], function() {

})

gulp.task('add-plugin', ['clone-plugin', 'install-plugins'], function() {

})

gulp.task('reboot', function() {
  cp.execSync("sudo reboot")
})

gulp.task('clone-plugin', function() {
    if (!sh.which('git')) {
        gutil.log(gutil.colors.red("git not installed!"))
        process.exit(1)
    } else if (typeof gutil.env.url === "undefined") {
        gutil.log(gutil.colors.red("No plugin URL specified. use --url <github URL>"))
    }

    cp.execSync("git clone " + gutil.env.url, {
        cwd: "./plugins"
    })
})

// Goes through all the folders in the plugins directory, runs
// npm install on each one, then adds it to plugins.json
gulp.task('install-plugins', function() {
    plugins = []
    if (typeof gutil.env.path === "undefined") {
        gutil.env.path = "./plugins"
    }

    try {
        fs.statSync(gutil.env.path)
    } catch (ex) {
        gutil.log(gutil.colors.red("Plugin path not found! Check that it exists"))
        process.exit(1)
    }

    paths = sh.ls("-d", "./plugins/*")
    try {
        paths.forEach(function(item) {
            if (item.indexOf("node_modules") > -1 || item.indexOf("bower_components") > -1 || item.indexOf(".git") > -1 || item.indexOf("plugins.json") > -1 || item.indexOf("README.md") > -1) {
                return
            } else if (sh.test("-f", item + "/package.json") == false) {
                gutil.log(item + " doesn't contain a valid package.json, skipping")
                return
            }
            plugin = JSON.parse(fs.readFileSync(item + "/package.json"))
            gutil.log("Installing " + gutil.colors.green(plugin.description))

            plugins.push({
                packagePath: item
            })

            cp.execSync("npm install", {
                cwd: item
            })
        })
        fs.writeFileSync(__dirname + "/plugins/plugins.json", JSON.stringify(plugins, null, "\t"))
        gutil.log(gutil.colors.green("Installation complete. Please edit plugins.json if you need to overwrite any of the defaults"))
    } catch (ex) {
        gutil.log(gutil.colors.red("Failed to run 'npm install'. Error was: ") + ex)
    }



});
