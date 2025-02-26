#!/bin/bash
SAVEDCD=$PWD

cd "$(dirname "${BASH_SOURCE[0]}")"

DATE=`date +"%Y%m%d_%H%M%S"`

echo $DATE

if [ -d tmp ]; then
  rm -rf tmp
fi

mkdir tmp

cp -R ../extension tmp/

cd tmp/extension

VERSION=`grep "// @version" carbon-for-f1tv.user.js | rev | cut -d ' ' -f 1 | rev | tr -d '\n'`
echo $VERSION
sed -i "s/0.1000.1000/$VERSION/" manifest.json
sed -i "s/0.1000.1000/$VERSION/" manifest_firefox.json
sed -i "s/0.1000.1000/$VERSION/" popup.html


mv manifest_firefox.json background_firefox.js load_firefox.js ../


7z a -tzip ../chrome.zip *
rm manifest.json
mv ../manifest_firefox.json manifest.json
mv ../background_firefox.js ../load_firefox.js ./

7z a -tzip ../firefox.zip *

cd ../../

mkdir -p out

mv "tmp/chrome.zip" "out/carbon-for-f1tv-${VERSION}-${DATE}_chrome.zip"
mv "tmp/firefox.zip" "out/carbon-for-f1tv-${VERSION}-${DATE}_firefox.zip"

rm -rf tmp

cd $SAVEDCD
