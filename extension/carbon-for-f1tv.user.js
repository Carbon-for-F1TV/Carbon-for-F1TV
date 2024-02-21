// ==UserScript==
// @name           Carbon for F1TV
// @namespace      https://Carbon-for-F1TV.github.io/Carbon-for-F1TV/
// @match          https://f1tv.formula1.com/*
// @version        1.0.3
// @author         Carbon-for-F1TV
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
var carbon_mode = "default";
if (window.location.hash.split("_")[0] == "#carbon") {
  carbon_mode = window.location.hash.split("_")[1];
}

function log(msg) {
  let d = new Date();
  let dt = d.toISOString().split('T')[0] + " " + d.toTimeString().split(' ')[0];
  console.log("[Carbon for F1TV] [" + dt + "]: " + msg);
}

function isTheaterMode() {
  if ($("#carbon-helper .carbon-theatermode-style").length > 0) {
    return true;
  } else {
    return false;
  }
}

function toggleTheaterMode(temporary) {
  log("Theater mode toggle");
  if (isTheaterMode()) {
    //disabling theater mode
    $("#carbon-helper .carbon-theatermode-style").remove();
    if (temporary !== true) {
      theatermode_active = false;
    }
  } else {
    let theaterModeStyleHtml = "<div class='carbon-theatermode-style'>" +
      "<style>" +
      "body {overflow: hidden;}" +
      ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; margin: 0 !important; background-color: #000;}" +
      ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
      ".inset-video-item-play-action-container {width: 100%;}" +
      "</style>" +
      "</div>";
    $("#carbon-helper")[0].insertAdjacentHTML("beforeEnd", theaterModeStyleHtml);
    theatermode_active = true;
  }
}

var popouts = [];
function addPopout() {
  let popoutId;
  let createTime = Date.now();
  if ($("#carbon-helper .carbon-popout").length > 0) {
    popoutId = parseInt($("#carbon-helper .carbon-popout").last()[0].id.split("carbon-popout-")[1]) + 1;
  } else {
    popoutId = 0;
  }
  log("creating popout [id: " + popoutId + "]");
  let popoutHtml = "<div class='carbon-popout' id='carbon-popout-" + popoutId + "' style='display: none;'>" +
    "<div id='carbon-popout-" + popoutId + "-create-time'>" + createTime + "</div>" +
    "</div>";
  $("#carbon-helper")[0].insertAdjacentHTML("beforeEnd", popoutHtml);
  let popoutUrl = document.location.href.split("#")[0];
  if (popoutUrl.includes("?action=play")) {
    popoutUrl += "#carbon_popout";
  } else {
    popoutUrl += "?action=play#carbon_popout";
  }
  popouts["popout-" + popoutId] = window.open(popoutUrl, createTime, "width=1280,height=720");
  console.log(popouts["popout-" + popoutId]);

}


function deletePopout(p) {
  let id = parseInt(p.split("-")[1]);
  let createTime = $("#carbon-popout-" + id + "-create-time").text();
  let currentTime = Date.now();
  let timeDiff = Math.round((currentTime - createTime) / 1000);
  let deleteAfterSeconds = 20;

  if (timeDiff > deleteAfterSeconds) {
    $("#carbon-popout-" + id).remove();
    delete popouts[p];
    log("popout closed [id: " + id + "]");
  } else {
    log("popout [id: " + id + "] not responding [" + timeDiff + "/" + deleteAfterSeconds + "s]");
  }
}


if (carbon_mode !== "popout") {
  var pushProgressToPopouts = setInterval(function () {

    // delete closed popouts
    for (let p in popouts) {
      try {
        if (popouts[p].document.location) {
        } else {
          deletePopout(p);
        }
      } catch (e) {
        deletePopout(p);
      }
    }


    for (let p in popouts) {
      try {
        popouts[p].document.getElementById("main-progress").textContent = $(".carbon-player video")[0].currentTime;

        popouts[p].document.getElementById("progress-sync-time").textContent = Date.now();

        let mainState;
        if ($(".carbon-player video")[0].paused) {
          mainState = "paused";
        } else {
          mainState = "playing";
        }
        popouts[p].document.getElementById("main-state").textContent = mainState;

        popouts[p].document.getElementById("main-playbackrate").textContent = $(".carbon-player video")[0].playbackRate;
      } catch (e) {
        let id = parseInt(p.split("-")[1]);
        log("popout not loaded [id: " + id + "]");
      }
    }
  }, 2000);
}

if (carbon_mode == "popout") {
  var syncData = setInterval(function () {
    if ($(".player-container.shown .bitmovinplayer-container.carbon-player").length > 0) {
      let thisProgressRealtime = $(".carbon-player video")[0].currentTime;
      $("#this-progress-realtime").text(thisProgressRealtime);

      let estimatedMainProgress;
      if ($("#main-state").text() == "paused") {
        $("#main-progress-realtime").text($("#main-progress").text());
      } else {
        let timeDifference = (Date.now() - parseInt($("#progress-sync-time").text())) / 1000;
        let mainPlaybackrate = parseFloat($("#main-playbackrate").text());
        estimatedMainProgress = parseInt($("#main-progress").text()) + (timeDifference * mainPlaybackrate);
        $("#main-progress-realtime").text(estimatedMainProgress);
      }

      let thisPlaybackrate = $(".carbon-player video")[0].playbackRate;
      $("#this-playbackrate").text(thisPlaybackrate);

      let targetProgress = estimatedMainProgress;
      let syncOffset = parseInt(document.getElementById("sync-offset").value) / 1000 || 0;
      targetProgress += syncOffset;
      $("#this-progress-target").text(targetProgress);

      let diffToTarget = targetProgress - thisProgressRealtime;
      $("#diff-to-target").text(diffToTarget);
    } else {
      log("can't sync, player not loaded");
    }
  }, 500);

  let syncNow = setInterval(function () {
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
  if ($(".player-container.shown .bitmovinplayer-container.carbon-player").length > 0) {
    $(".carbon-player video")[0].playbackRate = speed;
  } else {
    log("can't set speed, player not loaded");
  }
}


function videoJumpToProgress(progress) {
  let oldTime = $(".carbon-player video")[0].currentTime;
  let newTime = progress - 10;
  $(".carbon-player video")[0].currentTime = newTime;
  let checkTime = $(".carbon-player video")[0].currentTime;
  log("Jumped from: " + oldTime + ", to: " + newTime + ". Current time:" + checkTime);
  if (Math.abs(checkTime - newTime) > 15) {
    log("problem with sync, disabling");
    toggleSyncMode(0);
    $(".carbon-player video")[0].pause();
    if ($(".bmpui-ui-playbacktimelabel-live").length > 0) {
      log("attempting to fix sync on live stream");
      // for some reason, on live streams we can't jump forward by much,
      // this simulates clicking "live" button and enables sync again to jump backward
      $(".bmpui-ui-playbacktimelabel-live")[0].click();
      setTimeout(function() {
        toggleSyncMode(1);
      }, 250);
    }
  } else {
    // Simulates click on seek-forward button.
    // This fixes Bitmovin player sometimes not buffering video after setting it's currentTime value.
    $(".carbon-player video")[0].currentTime = newTime;
    $(".carbon-player .bmpui-ui-forwardbutton")[0].click();
  }
}



function injectPlayerFeatures() {
  log("Injecting player features");
  $(".player-container.shown .bitmovinplayer-container").addClass("carbon-player");


  var multi_channels;
  if ($(".embedded-player-container .channel-switcher-container").length > 0) {
    log("player has multiple channels");
    multi_channels = true;
  } else {
    multi_channels = false;
  }

  var is_live;
  if ($(".bmpui-ui-playbacktimelabel-live").length > 0) {
    log("player is live");
    is_live = true;
  } else {
    log("player is not live");
    is_live = false;
  }


  // show player speed toggle
  $(".carbon-player .bmpui-ui-playbackspeedselectbox").parent().parent().removeClass("bmpui-hidden");

  // PIP BUTTON
  /*
  if ((window.navigator.userAgent.indexOf("Firefox") == -1) // not on Firefox
    && (carbon_mode !== "popout")) { // not in popout mode
    // show pip button
    $(".carbon-player .bmpui-ui-piptogglebutton").removeClass("bmpui-hidden");
    // fix pip button
    var pipBtn = $(".carbon-player .bmpui-ui-piptogglebutton")[0];
    $(pipBtn).addClass("carbon-btn-piptoggle");
    pipBtn.replaceWith(pipBtn.cloneNode(true));

    $(".carbon-player .carbon-btn-piptoggle").on("click", function() {
      log("Requesting PictureInPicture");
      $(".carbon-player video")[0].requestPictureInPicture();
    })
  }
  */

  // add theater mode button
  if (carbon_mode !== "popout") {
    let theaterBtnHtml = "<button aria-label='Theater mode' class='carbon-btn-theatermode bmpui-off' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + theatermode_btn_image + ")' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Theater mode</span></button>";
    $(".carbon-player .bmpui-container-wrapper .bmpui-ui-piptogglebutton")[0].insertAdjacentHTML("beforebegin", theaterBtnHtml);
    $(".carbon-player .carbon-btn-theatermode").on("click", function () {
      toggleTheaterMode();
    })
  }

  // set theater mode state
  if ((!isTheaterMode() && (theatermode_active == true)) || (!isTheaterMode() && (carbon_mode == "popout"))) {
    toggleTheaterMode();
  }

  if ((multi_channels == true) && (carbon_mode !== "popout")) {
    let popoutBtnHtml = "<button aria-label='New Popout' class='carbon-btn-popout bmpui-ui-piptogglebutton bmpui-off' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label'>New Popout</span></button>";
    $(".carbon-player .bmpui-container-wrapper .carbon-btn-theatermode")[0].insertAdjacentHTML("beforebegin", popoutBtnHtml);
    $(".carbon-player .carbon-btn-popout").on("click", function () {
      addPopout();
    })
  }

  if (carbon_mode == "popout") {
    $(".carbon-player .bmpui-ui-casttogglebutton").addClass("bmpui-hidden");
    //$(".carbon-player .bmpui-ui-forwardbutton").addClass("bmpui-hidden");
    //$(".carbon-player .bmpui-ui-rewindbutton").addClass("bmpui-hidden");

    let syncToggleHtml = "<span class='carbon-btn-synctoggle bmpui-ui-playbacktimelabel' style='cursor: pointer; min-width: 80px; position: relative; padding-left: 18px;'><span class='carbon-btn-synctoggle-label'>SYNC ON</span><div class='carbon-btn-synctoggle-dot' style='background-color: #56ff63; width: 8px; height: 8px; border-radius: 8px; position: absolute; left: 0; top: 5px;'></div></span>";
    $(".carbon-player .bmpui-controlbar-top .bmpui-container-wrapper")[0].insertAdjacentHTML("afterbegin", syncToggleHtml);
    $(".carbon-btn-synctoggle")[0].addEventListener("click", function () {
      toggleSyncMode();
    });

    $(".carbon-player .bmpui-seekbar")[0].addEventListener("click", function () {
      toggleSyncMode(0);
    });
    $(".carbon-player .bmpui-ui-rewindbutton")[0].addEventListener("mouseup", function () { //can't be listening to "click" event on rewind button, as we're simulating it elsewhere to fix sync mode
      toggleSyncMode(0);
    })
    $(".carbon-player .bmpui-ui-forwardbutton")[0].addEventListener("mouseup", function () {
      toggleSyncMode(0);
    })
    $(".carbon-player .bmpui-ui-playbacktogglebutton")[0].addEventListener("mouseup", function () {
      toggleSyncMode(0);
    })
    $(".carbon-player .bmpui-ui-hugeplaybacktogglebutton")[0].addEventListener("mouseup", function () {
      toggleSyncMode(0);
    })

    let syncDebugToggleHtml = "<div class='carbon-sync-debug-toggle bmpui-ui-settings-panel-item' style='cursor: pointer;' role='menuitem'><div class='bmpui-container-wrapper' style='cursor: pointer;'><label class='bmpui-ui-label' style='cursor: pointer;'>SYNC MODE DEBUG</label></div></div>";
    $(".bmpui-ui-settings-panel-page .bmpui-container-wrapper")[0].insertAdjacentHTML("afterbegin", syncDebugToggleHtml);
    $(".carbon-sync-debug-toggle")[0].addEventListener("click", function () {
      toggleSyncDebug();
    })

    let syncOffsetSwitcherHtml = "<span class='bmpui-ui-playbacktimelabel carbon-syncoffset-menu' style='font-size: 13px; line-height: 28px; padding-left: 14px; padding-right: 4px;'>Sync Offset:</span>" +
      "<button class='carbon-btn-syncoffset-back bmpui-off carbon-syncoffset-menu' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + syncoffset_btn_image + ");' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Sync Offset (-)</span></button>" +
      "<span class='bmpui-ui-playbacktimelabel carbon-syncoffset-view carbon-syncoffset-menu' style='font-size: 18px; line-height: 28px; padding: 0px 10px; min-width: 52px; text-align: center;'></span>" +
      "<button class='carbon-btn-syncoffset-forward bmpui-off carbon-syncoffset-menu' style='background-color: transparent; background-origin: content-box; background-position: center; background-repeat: no-repeat; background-size: 1.5em; border: 0; -webkit-box-sizing: content-box; box-sizing: content-box; cursor: pointer; font-size: 1em; height: 1.5em; min-width: 1.5em; padding: 0.25em; background-image: url(" + syncoffset_btn_image + "); transform: rotate(180deg);' type='button' aria-pressed='false' tabindex='0' role='button'><span class='bmpui-label' style='display: none;'>Sync Offset (+)</span></button>";
    $(".carbon-player .bmpui-container-wrapper .bmpui-ui-volumeslider")[0].insertAdjacentHTML("afterEnd", syncOffsetSwitcherHtml);
    updateSyncOffsetView();
    $(".carbon-player .carbon-btn-syncoffset-back").on("click", function () {
      setSyncOffset(-200);
    })
    $(".carbon-player .carbon-btn-syncoffset-forward").on("click", function () {
      setSyncOffset(+200);
    })

  }

  let donateHtml = "<div class='carbon-sync-debug-toggle bmpui-ui-settings-panel-item' role='menuitem'><a style='color: #ff6643; font-size: 12px; text-decoration: none; text-align: center; display: block;' href='https://github.com/Carbon-for-F1TV/Carbon-for-F1TV/blob/master/DONATE.md' target='_blank'>❤ Donate to support Carbon for F1TV</a></div>";
  $(".bmpui-ui-settings-panel-page .bmpui-container-wrapper")[0].insertAdjacentHTML("beforeEnd", donateHtml);


}


function updateSyncOffsetView() {
  let syncOffset = $("#sync-offset")[0].value || 0;
  syncOffset = (Math.round(syncOffset) / 1000).toFixed(1);
  $(".carbon-player .carbon-syncoffset-view").text(syncOffset);
}

function setSyncOffset(diff) {
  let syncOffset = $("#sync-offset")[0].value || 0;
  let newSyncOffset = parseInt(syncOffset) + diff;
  $("#sync-offset")[0].value = newSyncOffset;
  updateSyncOffsetView();
}


function toggleSyncDebug() {
  if ($("#carbon-helper .sync-data").is(":visible")) {
    $("#carbon-helper .sync-data").hide();
  } else {
    $("#carbon-helper .sync-data").show();
  }
}

function toggleSyncMode(mode) {
  let syncMode = parseInt(document.getElementById("sync-mode").value);
  if (syncMode == 1 || mode == 0) {
    log("sync mode disabled");
    document.getElementById("sync-mode").value = 0;
    $(".carbon-btn-synctoggle-label").text("SYNC OFF");
    $(".carbon-btn-synctoggle-dot").css("background-color", "#999");
    $(".carbon-syncoffset-menu").hide();
    videoSpeed(1);
  } else {
    log("sync mode enabled");
    document.getElementById("sync-mode").value = 1;
    $(".carbon-btn-synctoggle-label").text("SYNC ON");
    $(".carbon-btn-synctoggle-dot").css("background-color", "#56ff63");
    $(".carbon-syncoffset-menu").show();
    if ($(".carbon-player video")[0].paused) {
      $(".carbon-player video")[0].play();
    }
  }
}

function waitForPlayer() {
  if ($(".player-container.shown .bitmovinplayer-container").length > 0) {
    if ($(".player-container.shown .bitmovinplayer-container.carbon-player").length > 0) {
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
    // no player found
    // check for watch live popup
    if ($("button.btn-main:contains('WATCH LIVE')").length > 0) {
      $("button.btn-main:contains('WATCH LIVE')")[0].click();
    }
  }
}

function waitForPageLoad() {
  if ($("#app .app-wrapper").length > 0) {
    clearInterval(waitForPageLoad);
    $("#app")[0].insertAdjacentHTML("beforeEnd", "<div id='carbon-helper'></div>");
    if (carbon_mode == "popout") {
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
      $("#carbon-helper")[0].insertAdjacentHTML("beforeEnd", syncDataHtml);
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
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
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
