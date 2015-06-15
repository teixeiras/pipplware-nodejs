#!/bin/bash
set -u

set -e

HOME=/home/pi/jenkins/pipplware-server

cd $HOME

DIST=${HOME}/debinstall/deb-src

SYSROOT=${DIST}/sysroot

DEBIAN=${DIST}/DEBIAN

VERSION=0.1

rm -rf $DIST

mkdir -p $DIST

mkdir -p $SYSROOT

mkdir -p $DEBIAN

mkdir -p $SYSROOT/etc/udev/rules.d/

mkdir -p $SYSROOT/etc/init.d/

echo 'KERNEL=="uinput", MODE="0666"' >  $DIST/sysroot/etc/udev/rules.d/10-udev.rules

sudo apt-get -y install libavahi-compat-libdnssd-dev

wget http://node-arm.herokuapp.com/node_latest_armhf.deb

sudo DEBIAN_FRONTEND=noninteractive dpkg -i node_latest_armhf.deb

#git clone https://github.com/teixeiras/pipplware-nodejs

pwd

ls

cd server

npm i


mkdir -p $SYSROOT/opt/pipplware-server

cp -r ./* $SYSROOT/opt/pipplware-server

cp -r ../scripts/pipplware-server $SYSROOT/etc/init.d/

cp -r $HOME/DEBIAN/*  $DEBIAN


find ${DIST}/ -type d -exec chmod 0755 {} \;

find ${DIST}/ -type f -exec chmod go-w {} \;

chown -R root:root ${DIST}/

let SIZE=`du -s ${SYSROOT} | sed s'/\s\+.*//'`+8

pushd ${SYSROOT}/

sudo tar czf ${DIST}/data.tar.gz [a-z]*

popd

sed s"/SIZE/${SIZE}/" -i ${DEBIAN}/control

pushd ${DEBIAN}

sudo tar czf ${DIST}/control.tar.gz *

popd

pushd ${DIST}/

echo 2.0 > ./debian-binary

find ${DIST}/ -type d -exec chmod 0755 {} \;

find ${DIST}/ -type f -exec chmod go-w {} \;

chown -R root:root ${DIST}/

ar r $HOME/pipplware-server_$VERSION.deb debian-binary control.tar.gz data.tar.gz

popd

rm -rf  $HOME/deb_dist

mkdir $HOME/deb_dist

cp $HOME/node_latest_armhf.deb $HOME/deb_dist

cp $HOME/pipplware-server_$VERSION.deb $HOME/deb_dist
