// ==UserScript==
// @name        F1TV+
// @namespace   https://najdek.github.io/f1tv_plus/
// @match       https://f1tv.formula1.com/*
// @grant       none
// @version     4.0.1
// @author      Mateusz Najdek
// @description  A few improvements to F1TV
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

var DEFAULT_THEATERMODE = true;


var theatermode_btn_image = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIGlkPSdMYXllcl8xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4PScwcHgnIHk9JzBweCcgdmlld0JveD0nMCAwIDI4My41IDQyNS4yJyBzdHlsZT0nZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyODMuNSA0MjUuMjsnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxnPjxwYXRoIHN0eWxlPSdmaWxsOiNEMEQwRDI7JyBkPSdNMjM5LjMsMTI0LjlINDQuMmMtMTAuNywwLTE5LjQsOC43LTE5LjQsMTkuNHYxMzYuNmMwLDEwLjcsOC43LDE5LjQsMTkuNCwxOS40aDE5NS4xICBjMTAuNywwLDE5LjQtOC43LDE5LjQtMTkuNFYxNDQuM0MyNTguNywxMzMuNiwyNTAsMTI0LjksMjM5LjMsMTI0Ljl6IE04Ni43LDI4Ny40SDM4di00OC43aDE5LjV2MjkuMmgyOS4yVjI4Ny40eiBNODYuNywxNTYuMiBINTcuNXYyOS4ySDM4di00OC43aDQ4LjdWMTU2LjJ6IE0yNDUuNSwyODcuNGgtNDguN3YtMTkuNUgyMjZ2LTI5LjJoMTkuNVYyODcuNHogTTI0NS41LDE4NS40SDIyNnYtMjkuMmgtMjkuMnYtMTkuNWg0OC43VjE4NS40eicvPjwvZz48L3N2Zz4NCg==";
var theatermode_active = DEFAULT_THEATERMODE;

function log(msg) {
  var d = new Date();
  var dt = d.toISOString().split('T')[0] + " " + d.toTimeString().split(' ')[0];
  console.log("[F1TV+] [" + dt + "]: " + msg);
}

function isTheaterMode() {
  if ($("#f1tvplus-helper .f1tvplus-theatermode-style").length > 0) {
    return true;
  } else {
    return false;
  }
}

function toggleTheaterMode() {
  log("Theater mode toggle");
  if (isTheaterMode()) {
    //disabling theater mode
    $("#f1tvplus-helper .f1tvplus-theatermode-style").remove();
    theatermode_active = false;
  } else {
    var theaterModeStyleHtml = "<div class='f1tvplus-theatermode-style'>" +
        "<style>" +
        "body {overflow: hidden;}" +
        ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; margin: 0 !important; background-color: #000;}" +
        ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
        ".inset-video-item-play-action-container {width: 100%;}" +
        "</style>" +
        "</div>";
      $("#f1tvplus-helper")[0].insertAdjacentHTML("beforeEnd", theaterModeStyleHtml);
    theatermode_active = true;
  }
}

function injectPlayerFeatures() {
  log("Injecting player features");
  $(".player-container.shown .bitmovinplayer-container").addClass("f1tvplus-player");

  // show player speed toggle
  $(".f1tvplus-player .bmpui-ui-playbackspeedselectbox").parent().parent().removeClass("bmpui-hidden");

  // PIP BUTTON
  if (window.navigator.userAgent.indexOf("Firefox") == -1) { // not on Firefox
    // show pip button
    $(".f1tvplus-player .bmpui-ui-piptogglebutton").removeClass("bmpui-hidden");
    // fix pip button
    var pipBtn = $(".f1tvplus-player .bmpui-ui-piptogglebutton")[0];
    pipBtn.replaceWith(pipBtn.cloneNode(true));

    $(".f1tvplus-player .bmpui-ui-piptogglebutton").on("click", function(event) {
      log("Requesting PictureInPicture");
      $(".f1tvplus-player video")[0].requestPictureInPicture();
    })
  }

  // add theater mode button
  var theaterBtnHtml = "<button aria-label='Theater mode' class='f1tvplus-btn-theatermode bmpui-off' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + theatermode_btn_image + ")' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Theater mode</span></button>";
  $(".f1tvplus-player .bmpui-container-wrapper .bmpui-ui-piptogglebutton")[0].insertAdjacentHTML("beforebegin", theaterBtnHtml);
  $(".f1tvplus-player .f1tvplus-btn-theatermode").on("click", function(event) {
    toggleTheaterMode();
  })

  // set theater mode state
  if (!isTheaterMode() && (theatermode_active == true)) {
    toggleTheaterMode();
  }
}

function waitForPlayer() {
  if ($(".player-container.shown .bitmovinplayer-container").length > 0) {
    if ($(".player-container.shown .bitmovinplayer-container.f1tvplus-player").length > 0) {
    } else {
      if ($(".player-container.shown .bitmovinplayer-container video")[0].readyState > 0) {
        log("new player loaded");
        injectPlayerFeatures();
        // slow down loop
        clearInterval(playerInjectLoop);
        playerInjectLoop = setInterval(waitForPlayer, 1000);
      }
    }
  } else {
    //no player found
  }
}

function waitForPageLoad() {
  if ($("#app .app-wrapper").length > 0) {
    clearInterval(waitForPageLoad);
    $("#app")[0].insertAdjacentHTML("beforeEnd", "<div id='f1tvplus-helper'></div>");
  }
}

var waitForPageLoad = setInterval(waitForPageLoad, 50);
var playerInjectLoop;

function pageChanged() {
  clearInterval(playerInjectLoop);
  if (document.location.href.split("formula1.com/")[1].split("/")[0] == "detail") {
    log("Page changed (video)");
    playerInjectLoop = setInterval(waitForPlayer, 50);
  } else {
    log("Page changed (not video)");
  }
}

var oldHref = document.location.href;
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
            oldHref = document.location.href;
            pageChanged();
        }
    });
});

observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
});
pageChanged();
