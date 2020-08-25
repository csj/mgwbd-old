#!/bin/bash

# Script to build frontend lcoally. This should be replaced with a proper build
# within AWS CodeStar and buildspec.yaml.
#
# Run from root directory.

npm run build --prefix js
# copy files from js/build/ to static/



