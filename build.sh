#!/bin/bash

set -ex

PATH="$PATH:$(npm bin)"

which minify

mkdir -p dist

minify src/index.html > dist/index.html
coffee -cmo dist/index.js src/index.coffee
terser -cm -o dist/index.min.js \
  --source-map "content=dist/index.js.map" \
  --source-map "url=index.min.js.map" \
  -- dist/index.js
rm dist/index.js dist/index.js.map
minify src/index.css > dist/index.css
cp src/favicon.ico dist/
