#!/usr/bin/env sh

# abort on errors
set -e

# build
# npm run docs:build

# navigate into the build output directory
cd demo/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:luthfimasruri/vue3-quill-editor.git master:gh-pages

cd -