#!/usr/bin/env sh

# abort on errors
set -e

# remove dists
rm -r -f dist

# build library
npm run lib:build

# publish package to npm
npm publish