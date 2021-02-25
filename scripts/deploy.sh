#!/usr/bin/env sh

# abort on errors
set -e

# remove dists
rm -r -f demo/dist
rm -r -f docs/.vitepress/dist

# build
npm run docs:build
npm run demo:build

# navigate into the build output directory
cd demo/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:vueup/vueup-quill.git master:gh-pages

cd -