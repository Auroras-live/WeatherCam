# WeatherCam Plugins
This folder contains the various plugins for WeatherCam. You can install new ones using `git clone`, or by using `gulp add-plugin --url <repo URL here>`. Using `npm install` won't work, as each plugin needs to be in it's own folder, and not in a `node_modules` folder.

When you've cloned the plugin you want, use `gulp install-plugins` on the root folder to add the plugin to `plugins.json`. Manual changes to this file WILL be overwritten, so be careful!

Default settings for these plugins can be found in each folder's `package.json`. If you wish to change them, you can either change the `package.json` file, or you can edit `plugins.json` with an `options` property:

```json
{
    "packagePath": "./plugins/myplugin",
    "options": {
      "someOption": true
    }
}
```

Please note that use of unauthorized plugins may result in your API key getting revoked
