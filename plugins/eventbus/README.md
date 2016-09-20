# weathercam-eventbus
## Inter-plugin communication for weathercam
This plugin is a wrapper for pattern-emitter (EventEmitter with regex), but with a few helper functions

## Usage
- Consume this plugin and call the `emit` function like you would when using EventEmitter
- To listen for events, use the `.on` function, same as EventEmitter, or pass a valid regex. For example, `/(abc|def)/` to search for an event called `abc` or `def`
- Best practice is to namespace the event. For example, `camera.photo.taken` or `imagemagick.image.watermarked`
