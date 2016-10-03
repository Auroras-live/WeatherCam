#! /bin/sh

# Install git
sudo apt-get install git

# cd into home
cd ~/

# Clone Bellboy
git clone http://github.com/auroras-live/weathercam

# cd into the directory
cd ~/weathercam

# Get the latest version of node
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash

# Install node
sudo apt-get install nodejs

# Install everything
sudo npm install -g gulp nodemon node-autostart

# Install stuff for bellboy
npm install

# Run the gulp task to set stuff up
gulp install-plugins

# Set up autostart
autostart enable -n "weathercam" -p "~/weathercam" -c "nodemon index"

# Set up raspi-config
sudo raspi-config

# Run sudo
sudo -i

grep 'pi /bin/bash /home/pi/weathercam/update.sh' /etc/crontab || echo '0 0 * * * pi /bin/bash /home/pi/weathercam/update.sh' >> /etc/crontab
