#!/bin/bash

set -e

if [ ! -f levels.zip ]; then
	wget https://$1/$2 -o /dev/null -O levels.zip
fi

unzip levels.zip -d apps/beatsaber
mv apps/beatsaber/levels.json res/levels.json
