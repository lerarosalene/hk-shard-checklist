#!/bin/bash

set -ex

PATH="$PATH:$(npm bin)"

which minify

mkdir -p dist

minify src/index.html > dist/index.html
minify src/index.js > dist/index.js
minify src/index.css > dist/index.css
cp src/favicon.ico dist/
