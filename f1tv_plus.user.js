// ==UserScript==
// @name           F1TV+
// @namespace      https://najdek.github.io/f1tv_plus/
// @match          https://f1tv.formula1.com/*
// @version        4.0.6
// @author         Mateusz Najdek
// @description    Enhance your F1TV experience
// @require        https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

var DEFAULT_THEATERMODE = true;



var theatermode_btn_image = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIGlkPSdMYXllcl8xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4PScwcHgnIHk9JzBweCcgdmlld0JveD0nMCAwIDI4My41IDQyNS4yJyBzdHlsZT0nZW5hYmxlLWJhY2tncm91bm" +
    "Q6bmV3IDAgMCAyODMuNSA0MjUuMjsnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxnPjxwYXRoIHN0eWxlPSdmaWxsOiNEMEQwRDI7JyBkPSdNMjM5LjMsMTI0LjlINDQuMmMtMTAuNywwLTE5LjQsOC43LTE5LjQsMTkuNHYxMzYuNmMwLDEwLjcsOC43LDE5LjQsMTkuNCwxOS40aDE5NS4xICBjMTAuNywwLDE5LjQtOC43LDE5LjQtMTkuNFYxNDQuM0MyNTguNywxMzMuNiwyNTAsMT" +
    "I0LjksMjM5LjMsMTI0Ljl6IE04Ni43LDI4Ny40SDM4di00OC43aDE5LjV2MjkuMmgyOS4yVjI4Ny40eiBNODYuNywxNTYuMiBINTcuNXYyOS4ySDM4di00OC43aDQ4LjdWMTU2LjJ6IE0yNDUuNSwyODcuNGgtNDguN3YtMTkuNUgyMjZ2LTI5LjJoMTkuNVYyODcuNHogTTI0NS41LDE4NS40SDIyNnYtMjkuMmgtMjkuMnYtMTkuNWg0OC43VjE4NS40eicvPjwvZz48L3N2Zz4NCg==";

var syncoffset_btn_image = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDI4My41IDQyNS4yIiBzdHlsZT0iZW5hYmxlLWJhY2tncm9" +
    "1bmQ6bmV3IDAgMCAyODMuNSA0MjUuMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgc3R5bGU9ImRpc3BsYXk6bm9uZTsiPg0KCTxwYXRoIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOiNEMEQwRDI7IiBkPSJNMjM5LjMsMTI0LjlINDQuMmMtMTAuNywwLTE5LjQsOC43LTE5LjQsMTkuNHYxMzYuNmMwLDEwLjcsOC43LDE5LjQsMTkuNCwxOS40DQoJCWgxOTUuMWMxMC4" +
    "3LDAsMTkuNC04LjcsMTkuNC0xOS40VjE0NC4zQzI1OC43LDEzMy42LDI1MCwxMjQuOSwyMzkuMywxMjQuOXogTTg2LjcsMjg3LjRIMzh2LTQ4LjdoMTkuNXYyOS4yaDI5LjJWMjg3LjR6DQoJCSBNODYuNywxNTYuMkg1Ny41djI5LjJIMzh2LTQ4LjdoNDguN1YxNTYuMnogTTI0NS41LDI4Ny40aC00OC43di0xOS41SDIyNnYtMjkuMmgxOS41VjI4Ny40eiBNMjQ1LjUsMTg1LjR" +
    "IMjI2di0yOS4yaC0yOS4ydi0xOS41DQoJCWg0OC43VjE4NS40eiIvPg0KPC9nPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QwRDBEMjsiIGQ9Ik0yOS43LDIwMy41bDEwOS43LTc3LjhjMi45LTIsNy4yLTAuMiw3LjIsM3YxNjcuNmMwLDMuMy00LjMsNS4xLTcuMiwzTDI5LjcsMjIxLjcNCglDMjMuMiwyMTcsMjMuMiwyMDguMiwyOS43LDIwMy41eiIvPg0KPHBhdGggc3R5bGU9ImZ" +
    "pbGw6I0QwRDBEMjsiIGQ9Ik0xNDEuOCwyMDMuNWwxMDkuNy03Ny44YzIuOS0yLDcuMi0wLjIsNy4yLDN2MTY3LjZjMCwzLjMtNC4zLDUuMS03LjIsM2wtMTA5LjctNzcuOA0KCUMxMzUuMiwyMTcsMTM1LjIsMjA4LjIsMTQxLjgsMjAzLjV6Ii8+DQo8L3N2Zz4=";

var theatermode_active = DEFAULT_THEATERMODE;
var f1tvplus_mode = "default";
if (window.location.hash.split("_")[0] == "#f1tvplus") {
  f1tvplus_mode = window.location.hash.split("_")[1];
}

function log(msg) {
  let d = new Date();
  let dt = d.toISOString().split('T')[0] + " " + d.toTimeString().split(' ')[0];
  console.log("[F1TV+] [" + dt + "]: " + msg);
}

function isTheaterMode() {
  if ($("#f1tvplus-helper .f1tvplus-theatermode-style").length > 0) {
    return true;
  } else {
    return false;
  }
}

function toggleTheaterMode(temporary) {
  log("Theater mode toggle");
  if (isTheaterMode()) {
    //disabling theater mode
    $("#f1tvplus-helper .f1tvplus-theatermode-style").remove();
    if (temporary !== true) {
      theatermode_active = false;
    }
  } else {
    let theaterModeStyleHtml = "<div class='f1tvplus-theatermode-style'>" +
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

var popouts = [];
function addPopout() {
  let popoutId;
  if ($("#f1tvplus-helper .f1tvplus-popout").length > 0) {
    popoutId = parseInt($("#f1tvplus-helper .f1tvplus-popout").last()[0].id.split("f1tvplus-popout-")[1]) + 1;
  } else {
    popoutId = 0;
  }
  log("creating popout [id: " + popoutId + "]");
  let popoutHtml = "<div class='f1tvplus-popout' id='f1tvplus-popout-" + popoutId + "' style='position: fixed; z-index: 1001; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;'>" +
      "</div>";
  $("#f1tvplus-helper")[0].insertAdjacentHTML("beforeEnd", popoutHtml);
  let popoutUrl = document.location.href.split("#")[0];
  if (popoutUrl.includes("?action=play")) {
    popoutUrl += "#f1tvplus_popout";
  } else {
    popoutUrl += "?action=play#f1tvplus_popout";
  }
  popouts["popout-" + popoutId] = window.open(popoutUrl, Date.now(), "width=1280,height=720");
  console.log(popouts["popout-" + popoutId]);

}

if (f1tvplus_mode !== "popout") {
  var pushProgressToPopouts = setInterval(function() {
    for (let p in popouts) {
      if (popouts[p].document.location == null) {
        let id = parseInt(p.split("-")[1]);
          $("#f1tvplus-popout-" + id).remove();
          delete popouts[p];
          log("popout closed [id: " + id + "]");
      } else {
        popouts[p].document.getElementById("main-progress").textContent = $(".f1tvplus-player video")[0].currentTime;

        popouts[p].document.getElementById("progress-sync-time").textContent = Date.now();

        let mainState;
        if ($(".f1tvplus-player video")[0].paused) {
          mainState = "paused";
        } else {
          mainState = "playing";
        }
        popouts[p].document.getElementById("main-state").textContent = mainState;

        popouts[p].document.getElementById("main-playbackrate").textContent = $(".f1tvplus-player video")[0].playbackRate;


      }
    }
  }, 2000);
}

if (f1tvplus_mode == "popout") {
  var syncData = setInterval(function() {
    let thisProgressRealtime = $(".f1tvplus-player video")[0].currentTime;
    $("#this-progress-realtime").text(thisProgressRealtime);

    let estimatedMainProgress;
    if ($("#main-state").text() == "paused") {
      $("#main-progress-realtime").text($("#main-progress").text());
    } else {
      let timeDifference = (Date.now() - parseInt($("#progress-sync-time").text()))/1000;
      let mainPlaybackrate = parseFloat($("#main-playbackrate").text());
      estimatedMainProgress = parseInt($("#main-progress").text()) + (timeDifference * mainPlaybackrate);
      $("#main-progress-realtime").text(estimatedMainProgress);
    }

    let thisPlaybackrate = $(".f1tvplus-player video")[0].playbackRate;
    $("#this-playbackrate").text(thisPlaybackrate);

    let targetProgress = estimatedMainProgress;
    let syncOffset = parseInt(document.getElementById("sync-offset").value) / 1000 || 0;
    targetProgress += syncOffset;
    $("#this-progress-target").text(targetProgress);

    let diffToTarget = targetProgress - thisProgressRealtime;
    $("#diff-to-target").text(diffToTarget);


  }, 100);

  let syncNow = setInterval(function() {
    let syncMode = parseInt(document.getElementById("sync-mode").value);
    if (syncMode == 1) {
      let thisProgressRealtime = parseFloat($("#this-progress-realtime").text());
      let targetProgress = parseFloat($("#this-progress-target").text());
      let mainPlaybackrate = parseFloat($("#main-playbackrate").text());
      let thisPlaybackrate = parseFloat($("#this-playbackrate").text());
      let diffToTarget = targetProgress - thisProgressRealtime;
      let diffToTargetAbs = Math.abs(diffToTarget);

      if (diffToTargetAbs > 15) {
        videoJumpToProgress(targetProgress);
      } else if (diffToTargetAbs > 10) {
        if (diffToTarget > 0) { videoSpeed(3); } else { videoSpeed(0.333); }
      } else if (diffToTargetAbs > 5) {
        if (diffToTarget > 0) { videoSpeed(2); } else { videoSpeed(0.5); }
      } else if (diffToTargetAbs > 1) {
        if (diffToTarget > 0) { videoSpeed(1.5); } else { videoSpeed(0.666); }
      } else if (diffToTargetAbs > 0.5) {
        if (diffToTarget > 0) { videoSpeed(1.25); } else { videoSpeed(0.8); }
      } else if (diffToTargetAbs > 0.2) {
        if (diffToTarget > 0) { videoSpeed(1.11); } else { videoSpeed(0.9); }
      } else {
        videoSpeed(1);
      }
    }
  }, 500);
}


function videoSpeed(speed) {
  $(".f1tvplus-player video")[0].playbackRate = speed;
}

function videoJumpToProgress(progress) {
    $(".f1tvplus-player video")[0].currentTime = progress + 10;
    // DIRTY FIX:
    // Simulates click on seek-backward button.
    // This fixes Bitmovin player sometimes not buffering video after setting it's currentTime value.
    $(".f1tvplus-player .bmpui-ui-rewindbutton")[0].click();
}


function injectPlayerFeatures() {
  log("Injecting player features");
  $(".player-container.shown .bitmovinplayer-container").addClass("f1tvplus-player");


  var multi_channels;
  if ($(".embedded-player-container .channel-switcher-container").length > 0) {
    log("player has multiple channels");
    multi_channels = true;
  } else {
    multi_channels = false;
  }

  // show player speed toggle
  $(".f1tvplus-player .bmpui-ui-playbackspeedselectbox").parent().parent().removeClass("bmpui-hidden");

  // PIP BUTTON
  /*
  if ((window.navigator.userAgent.indexOf("Firefox") == -1) // not on Firefox
    && (f1tvplus_mode !== "popout")) { // not in popout mode
    // show pip button
    $(".f1tvplus-player .bmpui-ui-piptogglebutton").removeClass("bmpui-hidden");
    // fix pip button
    var pipBtn = $(".f1tvplus-player .bmpui-ui-piptogglebutton")[0];
    $(pipBtn).addClass("f1tvplus-btn-piptoggle");
    pipBtn.replaceWith(pipBtn.cloneNode(true));

    $(".f1tvplus-player .f1tvplus-btn-piptoggle").on("click", function() {
      log("Requesting PictureInPicture");
      $(".f1tvplus-player video")[0].requestPictureInPicture();
    })
  }
  */

  // add theater mode button
  if (f1tvplus_mode !== "popout") {
    let theaterBtnHtml = "<button aria-label='Theater mode' class='f1tvplus-btn-theatermode bmpui-off' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + theatermode_btn_image + ")' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Theater mode</span></button>";
    $(".f1tvplus-player .bmpui-container-wrapper .bmpui-ui-piptogglebutton")[0].insertAdjacentHTML("beforebegin", theaterBtnHtml);
    $(".f1tvplus-player .f1tvplus-btn-theatermode").on("click", function() {
      toggleTheaterMode();
    })
  }

  // set theater mode state
  if ((!isTheaterMode() && (theatermode_active == true)) || (!isTheaterMode() && (f1tvplus_mode == "popout"))) {
    toggleTheaterMode();
  }

  if ((multi_channels == true) && (f1tvplus_mode !== "popout")) {
    let popoutBtnHtml = "<button aria-label='New Popout' class='f1tvplus-btn-popout bmpui-ui-piptogglebutton bmpui-off' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label'>New Popout</span></button>";
    $(".f1tvplus-player .bmpui-container-wrapper .f1tvplus-btn-theatermode")[0].insertAdjacentHTML("beforebegin", popoutBtnHtml);
    $(".f1tvplus-player .f1tvplus-btn-popout").on("click", function() {
      addPopout();
    })
  }

  if (f1tvplus_mode == "popout") {
    $(".f1tvplus-player .bmpui-ui-casttogglebutton").addClass("bmpui-hidden");
    //$(".f1tvplus-player .bmpui-ui-forwardbutton").addClass("bmpui-hidden");
    //$(".f1tvplus-player .bmpui-ui-rewindbutton").addClass("bmpui-hidden");

    let syncToggleHtml = "<span class='f1tvplus-btn-synctoggle bmpui-ui-playbacktimelabel' style='cursor: pointer; min-width: 80px; position: relative; padding-left: 18px;'><span class='f1tvplus-btn-synctoggle-label'>SYNC ON</span><div class='f1tvplus-btn-synctoggle-dot' style='background-color: #56ff63; width: 8px; height: 8px; border-radius: 8px; position: absolute; left: 0; top: 5px;'></div></span>";
    $(".f1tvplus-player .bmpui-controlbar-top .bmpui-container-wrapper")[0].insertAdjacentHTML("afterbegin", syncToggleHtml);
    $(".f1tvplus-btn-synctoggle")[0].addEventListener("click", function() {
      toggleSyncMode();
    });

    $(".f1tvplus-player .bmpui-seekbar")[0].addEventListener("click", function() {
      toggleSyncMode(0);
    });

    $(".f1tvplus-player .bmpui-ui-rewindbutton")[0].addEventListener("mouseup", function() { //can't be listening to "click" event on rewind button, as we're simulating it elsewhere to fix sync mode
      toggleSyncMode(0);
    })
    $(".f1tvplus-player .bmpui-ui-forwardbutton")[0].addEventListener("mouseup", function() {
      toggleSyncMode(0);
    })
    $(".f1tvplus-player .bmpui-ui-playbacktogglebutton")[0].addEventListener("mouseup", function() {
      toggleSyncMode(0);
    })


    let syncDebugToggleHtml = "<div class='f1tvplus-sync-debug-toggle bmpui-ui-settings-panel-item' style='cursor: pointer;' role='menuitem'><div class='bmpui-container-wrapper' style='cursor: pointer;'><label class='bmpui-ui-label' style='cursor: pointer;'>SYNC MODE DEBUG</label></div></div>";
    $(".bmpui-ui-settings-panel-page .bmpui-container-wrapper")[0].insertAdjacentHTML("afterbegin", syncDebugToggleHtml);
    $(".f1tvplus-sync-debug-toggle")[0].addEventListener("click", function() {
      toggleSyncDebug();
    })

    let syncOffsetSwitcherHtml = "<span class='bmpui-ui-playbacktimelabel f1tvplus-syncoffset-menu' style='font-size: 13px; line-height: 28px; padding-left: 14px; padding-right: 4px;'>Sync Offset:</span>" +
        "<button class='f1tvplus-btn-syncoffset-back bmpui-off f1tvplus-syncoffset-menu' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + syncoffset_btn_image + ");' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Sync Offset (-)</span></button>" +
        "<span class='bmpui-ui-playbacktimelabel f1tvplus-syncoffset-view f1tvplus-syncoffset-menu' style='font-size: 18px; line-height: 28px; padding: 0px 10px; min-width: 52px; text-align: center;'></span>" +
        "<button class='f1tvplus-btn-syncoffset-forward bmpui-off f1tvplus-syncoffset-menu' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + syncoffset_btn_image + "); transform: rotate(180deg);' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Sync Offset (+)</span></button>";
    $(".f1tvplus-player .bmpui-container-wrapper .bmpui-ui-volumeslider")[0].insertAdjacentHTML("afterEnd", syncOffsetSwitcherHtml);
    updateSyncOffsetView();
    $(".f1tvplus-player .f1tvplus-btn-syncoffset-back").on("click", function() {
      setSyncOffset(-100);
    })
    $(".f1tvplus-player .f1tvplus-btn-syncoffset-forward").on("click", function() {
      setSyncOffset(+100);
    })

  }

  let donateHtml = "<div class='f1tvplus-sync-debug-toggle bmpui-ui-settings-panel-item' role='menuitem'><a style='color: #ff6643; text-align: center; display: block;' href='https://github.com/najdek/f1tv_plus/blob/master/DONATE.md' target='_blank'>❤ Donate to support F1TV+</a></div>";
  $(".bmpui-ui-settings-panel-page .bmpui-container-wrapper")[0].insertAdjacentHTML("beforeEnd", donateHtml);


}


function updateSyncOffsetView() {
  let syncOffset = $("#sync-offset")[0].value || 0;
  syncOffset = (Math.round(syncOffset) / 1000).toFixed(1);
  $(".f1tvplus-player .f1tvplus-syncoffset-view").text(syncOffset);
}

function setSyncOffset(diff) {
  let syncOffset = $("#sync-offset")[0].value || 0;
  let newSyncOffset = parseInt(syncOffset) + diff;
  $("#sync-offset")[0].value = newSyncOffset;
  updateSyncOffsetView();
}


function toggleSyncDebug() {
  if ($("#f1tvplus-helper .sync-data").is(":visible")) {
    $("#f1tvplus-helper .sync-data").hide();
  } else {
    $("#f1tvplus-helper .sync-data").show();
  }
}

function toggleSyncMode(mode) {
  let syncMode = parseInt(document.getElementById("sync-mode").value);
  if (syncMode == 1 || mode == 0) {
    log("sync mode disabled");
    document.getElementById("sync-mode").value = 0;
    $(".f1tvplus-btn-synctoggle-label").text("SYNC OFF");
    $(".f1tvplus-btn-synctoggle-dot").css("background-color", "#999");
    $(".f1tvplus-syncoffset-menu").hide();
    videoSpeed(1);
  } else {
    log("sync mode enabled");
    document.getElementById("sync-mode").value = 1;
    $(".f1tvplus-btn-synctoggle-label").text("SYNC ON");
    $(".f1tvplus-btn-synctoggle-dot").css("background-color", "#56ff63");
    $(".f1tvplus-syncoffset-menu").show();
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
    if (f1tvplus_mode == "popout") {
      let syncDataHtml = "<div class='sync-data'>" +
          "<div>main window progress: <span id='main-progress'></span>, estimated realtime: <span class='thiswindow' id='main-progress-realtime'></span></div>" +
          "<div>this window progress: <span class='thiswindow' id='this-progress-realtime'></span></div>" +
          "<div>sync offset: <input id='sync-offset' type='number' step='250' value='' style='width: 80px;'>, target progress: <span class='thiswindow' id='this-progress-target'></span></div>" +
          "<div>progress sync time: <span id='progress-sync-time'></span></div>" +
          "<div>diff to target: <span class='thiswindow' id='diff-to-target'></span></div><br>" +
          "<div>main window state: <span id='main-state'></span></div>" +

          "<div>sync mode: <input id='sync-mode' type='number' step='1' value='1' style='width: 40px;'></div>" +
          "<div>main window playback rate: <span id='main-playbackrate'></span></div>" +
          "<div>this window playback rate: <span class='thiswindow' id='this-playbackrate'></span></div>" +
          "</div>" +
          "<style>" +
          ".sync-data {position: fixed; top: 0; left: 0; background-color: #000000bb; color: #aaa; padding: 6px; z-index: 1001; font-family: monospace; display: none;}" +
          ".sync-data span {font-weight: bold; color: #fff;}" +
          ".sync-data span.thiswindow {font-weight: bold; color: #ffff00;}" +
          "</style>";
      $("#f1tvplus-helper")[0].insertAdjacentHTML("beforeEnd", syncDataHtml);
    }
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
    if (isTheaterMode()) {
      toggleTheaterMode(true);
    }
  }
}

let oldHref = document.location.href;
let observer = new MutationObserver(function(mutations) {
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
