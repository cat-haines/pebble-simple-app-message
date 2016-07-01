#!/bin/bash
pwd
rm -rf ./node_modules/pebble-simple-app-message
cd ..
pebble build
cd simple-app-message-test
pebble build
