# F1TV+
Userscript that adds some useful features to F1TV.

All in your browser, no external apps needed.

## Current features
* theater mode (bigger video, less wasted space on screen),
* ~~get video/stream URL (to use in external player, like VLC)~~ (as of 2022.04.08, broken due to DRM)
* open video in popup (keep "original" F1TV player)
* ~~open video in popup in alternative mode (use default HTML5 player)~~ (as of 2022.04.08, broken due to DRM)
* ~~"multi-popout" - open multiple popups with synchronized streams~~ (as of 2022.04.08, broken due to DRM)
  * ~~In multi-popout mode, you can set offset for each video, to keep them perfectly synchronized in case they are hosted out-of-sync~~
  * ~~Loads predefined offsets from [sync_offsets.json](sync_offsets.json)~~

## Installation
* Install the Tampermonkey extension for your browser:
  * [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
  * [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
  * [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
* Click here to open the latest version of userscript: [[f1tv_plus.user.js]](https://github.com/najdek/f1tv_plus/raw/v1/f1tv_plus.user.js)
* Tampermonkey should detect userscript automatically. Click on "Install".

You may have to allow F1TV website to open popups.
