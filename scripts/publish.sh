#!/usr/bin/env sh

# abort on errors
set -e

# remove dists
rm -r -f dist

# build
npm run lib:build

# navigate into the build output directory
npm publish

cd -