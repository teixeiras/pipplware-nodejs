#!/bin/bash
mkdir ~/pipplware
cd ~/pipplware
sudo apt-get -y install libavahi-compat-libdnssd-dev

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
rm node_latest_armhf.deb

sudo (echo 'KERNEL=="uinput", MODE="0666"' >  /etc/udev/rules.d/10-udev.rules)

git clone https://github.com/teixeiras/pipplware-nodejs
cd pipplware-nodejs/server
npm i
