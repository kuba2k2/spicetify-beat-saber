#!/bin/bash

set -e

VERSION=$(node -p -e "require('./package.json').version")

echo Building $VERSION

npm install
npm run build

cd apps/beatsaber
cp beatsaber.shim.js ../
rm -f ../beatsaber-$VERSION.spa
zip -r ../beatsaber-$VERSION.spa *
cd ../../
