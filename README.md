# Auroras.live Sensor Network Weathercam
*Please note, this software is still in alpha and will change*

This software will let you turn a Raspberry Pi into a cloud cover camera. The resulting image is then sent to the Auroras.live API and displayed on [the map](https://auroras.live/#/maps) so other users can see what the cloud cover is like at a particular location.

## Installation
An install script and video tutorial is coming soon, until then, the steps to install the software are below.

### Requirements
* A Raspberry Pi. This software has been tested with the Pi 2 and the Pi Zero (v1.3 revision)
* The Raspberry Pi camera
* Raspberry Pi accessories
  * If using the Pi Zero, you'll need the Pi Zero camera cable
  * A Micro-SD card. 4gb is fine, but 8gb recommended
  * Keyboard, mouse, power supply (most phone chargers work great)
  * If you're using a Raspberry Pi Zero, you'll need a USB on-the-go hub
  * A compatible WiFi dongle or Ethernet connection (if using the Pi Zero, you'll need a USB > Ethernet dongle)
  * A Mini-HDMI to HDMI cable (strongly recommended, but [not necessary](https://davidmaitland.me/2015/12/raspberry-pi-zero-headless-setup/)
* [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/). Both the lite and full versions will work, but the full version is easier to set up.
* [Etcher](http://etcher.io) to write the software to the SD card
* Optional accessories
  * A Raspberry Pi case (The Pibow cases work well)

Most of these accessories can be purchased from eBay for a few dollars, or you may have them already laying around the house

### Preparing the SD card
* Installer Etcher, then download Raspbian Jessie
* Insert the micro-SD card into the SD card adapter, then insert it into your computer
* Open Etcher. In Step 1, find the Raspbian image you downloaded (no need to unzip it). In Step 2, find the SD card you just inserted. Click the `Flash!` button in Step 3 and wait

### Preparing your Raspberry Pi
* Connect your camera up to your Raspberry Pi. If using the Pi Zero, replace the camera cable with the Pi Zero cable
* Plug in your SD card
* Connect the USB on-the-go hub
* Connect your keyboard, mouse and WiFi dongle
* Connect your mini HDMI and plug it in to a TV or monitor
* Connect the power

### Installing the software
* Log in to the Raspberry Pi using the username `pi` and the password `raspberry`
* If you're not taken to a desktop, type `startx`
* When you're at the desktop, use the icon in the top right corner to set up your WiFi. If using Ethernet, skip this step
* Ensure you can browse the internet (this tests if your network is set up correctly)
* Open a terminal
* Run the following commands:
  * `sudo apt-get update`
  * `sudo apt-get install git`
  * `cd /tmp`
  * If you're using the Raspberry Pi Zero, run these two commands:
    * `wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-armv6l.tar.xz`
    * `tar xf node-v6.9.1-linux-armv6l.tar.xz -C /usr/local --strip=1`
  * If you're using another Raspberry Pi, run this command:
    * `curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash`
  * `cd ~`
  * `git clone http://github.com/auroras-live/weathercam`
  * `cd weathercam`
  * `npm install -g gulp node-autostart nodemon`
  * `npm install`
  * `gulp install-plugins`
  * `autostart enable -n "weathercam" -p "~/weathercam" -c "nodemon index"`
* Next, create a config file by running these commands:
  * `cd ~/weathercam/config`
  * `nano config.json`
* Paste or type the following in:

```json
{
  "apikey": "<Your API Key Here>",
  "camera": {
    "size": {
      "width": 1440,
      "height": 900
    },
    "flip": {
      "horizontal": true,
      "vertical": false
    },
    "interval": 300000
  },
  "location": {
    "lat": 0,
    "long": 0
  }
}
```
* You can get an API key by emailing [sensor@auroras.live](mailto:sensor@auroras.live)
* Reboot your Raspberry Pi using `sudo reboot`
* Wait 5 minutes, then check the Auroras.live map. Your image should appear
