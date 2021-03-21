#!/usr/bin/env sh

# abort on errors
set -e

# remove dists
rm -r -f docs/content/.vitepress/dist

# build
npm run docs:build

# navigate into the build output directory
cd docs/content/.vitepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://vueup.github.io/vue-quill
git push -f git@github.com:vueup/vue-quill.git master:gh-pages

cd -