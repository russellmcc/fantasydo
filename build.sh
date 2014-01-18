#!/bin/sh
browserify -t uglifyify index.js --standalone fantasydo -o fantasydo.min.js
