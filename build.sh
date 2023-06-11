#!/bin/bash

set -e

VERSION=$(node -p -e "require('./package.json').version")

echo Building $VERSION

rm -rf apps/beatsaber/*.js apps/beatsaber/*.js.map apps/beatsaber/css

npm run build

# copy Zlink shim to release directory
cd apps/beatsaber
cp beatsaber.shim.js ../

# package SPA
rm -f ../beatsaber-$VERSION.spa
zip -r ../beatsaber-$VERSION.spa *

# package dist ZIP
cd ../
rm -f beatsaber-dist-$VERSION.zip
zip -r beatsaber-dist-$VERSION.zip beatsaber/

cd ../
