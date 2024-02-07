// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.github.io/f1tv_plus/
// @version      3.0.2
// @description  A few improvements to F1TV
// @author       Mateusz Najdek
// @match        https://f1tv.formula1.com/*
// @grant        GM.xmlHttpRequest
// @connect      raw.githubusercontent.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
(function() {
    'use strict';

    var smVersion = "3.0.2";
    //<updateDescription>Update details:<br>multi-view: fix offsets not loading from database</updateDescription>

    var smUpdateUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/v3/f1tv_plus.user.js";
    var smSyncDataUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/v3/sync_offsets.json";

    //// SETTINGS FOR MULTI-POPOUT MODE ////
    var BROWSER_USED_HEIGHT = 70; // height [px] of window that is used by browser/system (title bar, url bar, etc) | Default value: 70
    var BROWSER_USED_WIDTH = 9; // width [px] of window that is used by browser/system | Default value: 9
    // settings above are browser and OS dependent. If values are too small, windows will overlap. If too high, there will be gaps between windows.

    var smPopupPositions = [
        [],
        // offset X %, offset Y %, width %, height %
        // 1 WINDOW:
        [
            [0, 0, 100, 100]
        ],
        // 2 WINDOWS:
        [
            [0, 0, 50, 100],
            [50, 0, 50, 100]
        ],
        // 3 WINDOWS:
        [
            [0, 0, 66.6, 100],
            [66.6, 0, 33.3, 50],
            [66.6, 50, 33.3, 50]
        ],
        // 4 WINDOWS:
        [
            [0, 0, 50, 50],
            [50, 0, 50, 50],
            [0, 50, 50, 50],
            [50, 50, 50, 50]
        ],
        // 5 WINDOWS:
        [
            [30, 0, 40, 100],
            [0, 0, 30, 50],
            [0, 50, 30, 50],
            [70, 0, 30, 50],
            [70, 50, 30, 50]
        ],
        // 6 WINDOWS:
        [
            [0, 0, 33.3, 50],
            [33.3, 0, 33.3, 50],
            [66.6, 0, 33.3, 50],
            [0, 50, 33.3, 50],
            [33.3, 50, 33.3, 50],
            [66.6, 50, 33.3, 50]
        ],
        // 7 WINDOWS:
        [
            [30, 0, 40, 100],
            [0, 0, 30, 33.3],
            [0, 33.3, 30, 33.3],
            [0, 66.6, 30, 33.3],
            [70, 0, 30, 33.3],
            [70, 33.3, 30, 33.3],
            [70, 66.6, 30, 33.3]
        ],
        // 8 WINDOWS:
        [
            [0, 0, 25, 50],
            [25, 0, 25, 50],
            [50, 0, 25, 50],
            [75, 0, 25, 50],
            [0, 50, 25, 50],
            [25, 50, 25, 50],
            [50, 50, 25, 50],
            [75, 50, 25, 50]
        ],
        // 9 WINDOWS:
        [
            [0, 0, 33.3, 33.3],
            [33.3, 0, 33.3, 33.3],
            [66.6, 0, 33.3, 33.3],
            [0, 33.3, 33.3, 33.3],
            [33.3, 33.3, 33.3, 33.3],
            [66.6, 33.3, 33.3, 33.3],
            [0, 66.6, 33.3, 33.3],
            [33.3, 66.6, 33.3, 33.3],
            [66.6, 66.6, 33.3, 33.3]
        ],
        // 10 WINDOWS:
        [
            [25, 0, 50, 50],
            [25, 50, 50, 50],
            [0, 0, 25, 25],
            [0, 25, 25, 25],
            [0, 50, 25, 25],
            [0, 75, 25, 25],
            [75, 0, 25, 25],
            [75, 25, 25, 25],
            [75, 50, 25, 25],
            [75, 75, 25, 25]
        ]
    ];

    // settings optimized for display with 16:9 aspect ratio (full screen)
    var smFramePositions16by9 = [
        [],
        // offset X %, offset Y %, width %, height %
        // 1 WINDOW:
        [],
        // 2 WINDOWS:
        [
            [0, 25, 50, 50],
            [50, 25, 50, 50]
        ],
        // 3 WINDOWS:
        [
            [0, 16.667, 66.667, 66.667],
            [66.667, 16.667, 33.333, 33.333],
            [66.667, 50, 33.333, 33.333]
        ],
        // 4 WINDOWS:
        [
            [0, 0, 50, 50],
            [50, 0, 50, 50],
            [0, 50, 50, 50],
            [50, 50, 50, 50]
        ],
        // 5 WINDOWS:
        [
            [0, 8.333, 50, 50],
            [50, 8.333, 50, 50],
            [0, 58.333, 33.333, 33.333],
            [33.333, 58.333, 33.333, 33.333],
            [66.666, 58.333, 33.333, 33.333]
        ],
        // 6 WINDOWS:
        [
            [0, 0, 66.666, 66.666],
            [66.666, 0, 33.333, 33.333],
            [66.666, 33.333, 33.333, 33.333],
            [0, 66.666, 33.333, 33.333],
            [33.333, 66.666, 33.333, 33.333],
            [66.666, 66.666, 33.333, 33.333]
        ],
        // 7 WINDOWS:
        [],
        // 8 WINDOWS:
        [],
        // 9 WINDOWS:
        [
            [0, 0, 33.3, 33.3],
            [33.3, 0, 33.3, 33.3],
            [66.6, 0, 33.3, 33.3],
            [0, 33.3, 33.3, 33.3],
            [33.3, 33.3, 33.3, 33.3],
            [66.6, 33.3, 33.3, 33.3],
            [0, 66.6, 33.3, 33.3],
            [33.3, 66.6, 33.3, 33.3],
            [66.6, 66.6, 33.3, 33.3]
        ],
        // 10 WINDOWS:
        [
            [25, 0, 50, 50],
            [25, 50, 50, 50],
            [0, 0, 25, 25],
            [0, 25, 25, 25],
            [0, 50, 25, 25],
            [0, 75, 25, 25],
            [75, 0, 25, 25],
            [75, 25, 25, 25],
            [75, 50, 25, 25],
            [75, 75, 25, 25]
        ]
    ];

    // settings optimized for display with 21:9 aspect ratio (full screen)
    var smFramePositions21by9 = [
        [],
        // offset X %, offset Y %, width %, height %
        // 1 WINDOW:
        [
            [0, 0, 100, 100]
        ],
        // 2 WINDOWS:
        [
            [0, 16.25, 50, 50],
            [50, 16.25, 50, 50]
        ],
        // 3 WINDOWS:
        [
            [0, 5, 66.666, 90],
            [66.666, 5, 33.333, 45],
            [66.666, 50, 33.333, 45]
        ],
        // 4 WINDOWS:
        [
            [12.943, 0, 37.057, 50],
            [50, 0, 37.057, 50],
            [12.943, 50, 37.057, 50],
            [50, 50, 37.057, 50]
        ],
        // 5 WINDOWS:
        [
            [25, 16.25, 50, 67.5],
            [0, 16.25, 25, 33.75],
            [0, 50, 25, 33.75],
            [75, 16.25, 25, 33.75],
            [75, 50, 25, 33.75]
        ],
        // 6 WINDOWS:
        [
            [0, 5, 33.333, 45],
            [33.333, 5, 33.333, 45],
            [66.666, 5, 33.333, 45],
            [0, 50, 33.333, 45],
            [33.333, 50, 33.333, 45],
            [66.666, 50, 33.333, 45]
        ],
        // 7 WINDOWS:
        [
            [25, 16.25, 50, 67.5],
            [0, 0, 25, 33.333],
            [0, 33.333, 25, 33.333],
            [0, 66.666, 25, 33.333],
            [75, 0, 25, 33.333],
            [75, 33.333, 25, 33.333],
            [75, 66.666, 25, 33.333]
        ],
        // 8 WINDOWS:
        [
            [31.458, 0, 37.057, 50],
            [31.458, 50, 37.057, 50],
            [6.458, 0, 25, 33.333],
            [6.458, 33.333, 25, 33.333],
            [6.458, 66.666, 25, 33.333],
            [68.515, 0, 25, 33.333],
            [68.515, 33.333, 25, 33.333],
            [68.515, 66.666, 25, 33.333]
        ],
        // 9 WINDOWS:
        [
            [12.995, 0, 25, 33.333],
            [37.995, 0, 25, 33.333],
            [62.995, 0, 25, 33.333],
            [12.995, 33.333, 25, 33.333],
            [37.995, 33.333, 25, 33.333],
            [62.995, 33.333, 25, 33.333],
            [12.995, 66.666, 25, 33.333],
            [37.995, 66.666, 25, 33.333],
            [62.995, 66.666, 25, 33.333]
        ]
    ];
    ////////////////////////////////////////

    var VIDEO_SPEEDS = [
        [10, "0.1x"],
        [25, "0.25x"],
        [50, "0.5x"],
        [75, "0.75x"],
        [100, "1x (Normal)"],
        [125, "1.25x"],
        [150, "1.5x"],
        [200, "2x"],
        [400, "4x"]
    ];



    if (window.location.hash.split("_")[0] == "#f1tvplus") {
        if (window.location.hash.split("_")[1].split("=")[0] == "popout" ||
            window.location.hash.split("_")[1].split("=")[0].split(":")[0] == "multipopout") {
            var smHtml = "<div id='sm-popup-id' style='display: none;'>0</div>" +
                "<div class='sm-bg' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
                "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
                "</div>" +
                "<style>" +
                "body {overflow: hidden;}" +
                ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; background-color: #000;}" +
                ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
                ".inset-video-item-play-action-container {width: 100%;}" +
                "</style>";
            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);

            if (window.location.hash.split("_")[1].split(":")[0] == "multipopout") {
                if (window.location.hash.split("_")[1].split("=")[0].split(":")[2] == "onewindow") {
                    var oneWindow = true;
                    var oneWindowAr = window.location.hash.split("_")[1].split("=")[0].split(":")[3];
                    if (oneWindowAr == "16by9") {
                        smPopupPositions = smFramePositions16by9;
                    } else if (oneWindowAr == "21by9") {
                        smPopupPositions = smFramePositions21by9;
                    }
                    /*
                    var smGoFullscreenHtml = "<div id='sm-gofullscreen' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1001; text-align: center;'>" +
                        "<div style='background-color: #0000008f; width: 100%; height: 100%; top: 0; left: 0; position: absolute;'></div>" +
                        "<div style='background-color: #c70000; color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                        "<h3>Click anywhere to go fullscreen...</h3>" +
                        "</div>" +
                        "</div>";
                    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smGoFullscreenHtml);
                    document.getElementById("sm-gofullscreen").addEventListener("click", function() {
                        $("#sm-gofullscreen").hide();
                        document.getElementsByTagName("body")[0].requestFullscreen();
                    });
                    */
                }

                var smWindowAmount = parseInt(window.location.hash.split("_")[1].split(":")[1]);

                document.getElementById("sm-popup-id").innerHTML = 1;
                document.title = "(#1)";
                var smSettingsFrameHtml = "<div id='sm-offset-settings-btn' class='sm-autohide' style='background-color: #000000aa; color: #fff; font-size: 12px; padding: 8px 16px; border-radius: 0px 0px 20px 20px; position: fixed; top: 0; left: 5%; cursor: pointer; z-index: 1004; display: none;'>SYNC MENU</div>" +
                    "<div id='sm-offset-settings' style='padding: 10px; position: fixed; top: 0; left: 0; background-color: #000; border-radius: 0px 0px 20px; display: none; z-index: 1005;'>" +
                    "<div id='sm-offset-settings-close-btn' style='text-align: right; font-size: 20px; cursor: pointer;'>[x]</div>" +
                    "<div id='sm-offset-settings-msg-top' style='margin: 10px 0px;'></div>" +
                    "<table>" +
                    "<tr><th colspan='3'>OFFSETS [ms]</th></tr>";

                for (let i = 1; i <= smWindowAmount; i++) {
                    smSettingsFrameHtml += "<tr><td>Window #" + i + "</td><td><input id='sm-offset-" + i + "' type='number' step='250' value='' style='width: 80px;'></td><td><span id='sm-offset-external-" + i + "'></span></td></tr>";
                }

                smSettingsFrameHtml += "<tr><td>Max desync [ms]</td><td><input id='sm-maxdesync' type='number' step='10' value='300' min='10' max='3000' style='width: 80px;'></td></tr>" +
                    "</table>" +
                    "<table style='margin-top: 40px;'>" +
                    "<tr><th colspan='2'>CURRENT SYNC [ms]</th></tr>" +
                    "<tr><td>Window #1</td><td>0 ms</td></tr>";

                for (let i = 2; i <= smWindowAmount; i++) {
                    smSettingsFrameHtml += "<tr><td>Window #" + i + "</td><td id='sm-sync-status-" + i + "'></td></tr>";
                }

                smSettingsFrameHtml += "</table>" +
                    "<div id='sm-sync-status-text' style='text-align: center; font-size: 24px; line-height: 24px; height: 24px; color: #ff0000;'></div>" +
                    "</div>" +
                    "<style>" +
                    "body { background-color: #000; color: #fff; font-family: Arial; margin: 0; }" +
                    "td,th { padding: 4px 20px; }" +
                    "#sm-offset-settings-msg-top p { padding: 10px; border-radius: 10px; font-size: 14px; background-color: #ffef5b; color: #000; }" +
                    "#app:hover ~ #sm-offset-settings-btn, .sm-bg:hover ~ #sm-offset-settings-btn, #sm-offset-settings-btn:hover { display: block !important; }" +
                    "</style>";

                var smWindow = [];

                document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smSettingsFrameHtml);

                document.getElementById("sm-offset-settings-btn").addEventListener("click", function() {
                    document.getElementById("sm-offset-settings").style.display = "block";
                });

                document.getElementById("sm-offset-settings-close-btn").addEventListener("click", function() {
                    document.getElementById("sm-offset-settings").style.display = "none";
                });

                var smSyncData;
                GM.xmlHttpRequest({
                    method: "GET",
                    url: smSyncDataUrl,
                    onload: function(response) {
                        smSyncData = JSON.parse(response.responseText);
                        if (Object.keys(smSyncData.videos).length > 0) {
                            console.log("[F1TV+] Loaded sync offsets for " + Object.keys(smSyncData.videos).length + " videos!");
                            if (smSyncData.videos[window.location.hash.split("_")[1].split("=")[1]]) {
                                console.log("[F1TV+] Found sync offsets for current video!");
                                document.getElementById("sm-offset-settings-msg-top").innerHTML = "<p>Loaded offsets for this video from F1TV+ database!<br>All feeds should be perfectly synchronized!</p>";
                            }
                        } else {
                            console.log("[F1TV+] Error loading sync offsets");
                        }
                    }
                });

                var smAllWindowExtraHtml =  "<style>" +
                    ".bmpui-ui-piptogglebutton, .bmpui-ui-airplaytogglebutton, .bmpui-ui-casttogglebutton, .bmpui-ui-vrtogglebutton { display: none; }" +
                    "</style>";

                var smMainWindowExtraHtml = "";

                var smSecondaryWindowExtraHtml = "<style>" +
                    ".bmpui-ui-rewindbutton, .bmpui-ui-playbacktogglebutton, .bmpui-ui-forwardbutton, .bmpui-controlbar-top, .bmpui-ui-hugeplaybacktogglebutton { display: none; }" +
                    "</style>";

                document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smAllWindowExtraHtml + smMainWindowExtraHtml);

                if (oneWindow) {
                    $(".inset-video-item-image-container").css("left", smPopupPositions[smWindowAmount][0][0] + "%");
                    $(".inset-video-item-image-container").css("top", smPopupPositions[smWindowAmount][0][1] + "%");
                    $(".inset-video-item-image-container").css("width", smPopupPositions[smWindowAmount][0][2] + "%");
                    $(".inset-video-item-image-container").css("height", smPopupPositions[smWindowAmount][0][3] + "%");
                    var smHtml = "<style>" +
                        ".inset-video-item-image-container {z-index: 1000; top: " + smPopupPositions[smWindowAmount][0][1] + "%; left: " + smPopupPositions[smWindowAmount][0][0] + "%; height: " + smPopupPositions[smWindowAmount][0][3] + "%; width: " + smPopupPositions[smWindowAmount][0][2] + "%; background-color: #000;}" +
                        "</style>";
                    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);
                }

                smWindow[1] = window;

                if (oneWindow) {
                    for (let i = 1; i <= smWindowAmount; i++) {
                        var smWindowOffsetX = smPopupPositions[smWindowAmount][i - 1][0];
                        var smWindowOffsetY = smPopupPositions[smWindowAmount][i - 1][1];
                        var smWindowWidth = smPopupPositions[smWindowAmount][i - 1][2];
                        var smWindowHeight = smPopupPositions[smWindowAmount][i - 1][3];
                        if (i > 1) {
                            var frameHtml = '<iframe id="sm-frame-' + i + '" style="position: absolute; z-index: 1000; border: 0; left: ' + smWindowOffsetX + '%; top: ' + smWindowOffsetY + '%; width: ' + smWindowWidth + '%; height: ' + smWindowHeight + '%;" src="' + document.location.href.split("_multipopout")[0] + "_popout=" + window.location.hash.split("_")[1].split("=")[1] + '"></iframe>';
                            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", frameHtml);
                            smWindow[i] = document.getElementById("sm-frame-" + i).contentWindow;
                            smWindow[i].addEventListener('load', (event) => {
                                (function onWindowLoad() {
                                    if (smWindow[i].document.getElementsByTagName("video")[0]) {
                                        console.log("video found!");
                                        smWindow[i].document.getElementsByTagName("video")[0].muted = true;
                                        smWindow[i].document.title = "(#" + i + ")"; // + smWindow[i].document.getElementById("sm-video-title").innerHTML;
                                        smWindow[i].document.getElementById("sm-popup-id").innerHTML = i;
                                        smWindow[i].document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smAllWindowExtraHtml + smSecondaryWindowExtraHtml);
                                    } else {
                                        setTimeout(onWindowLoad, 100);
                                    }
                                })();
                            });
                        }

                        /*
                        var frameHelper = '<div class="sm-frame-helper" id="sm-frame-helper-' + i + '" style="pointer-events: none; position: absolute; border: 0; left: ' + smWindowOffsetX + '%; top: ' + smWindowOffsetY + '%; width: ' + smWindowWidth + '%; height: ' + smWindowHeight + '%; z-index: 1000;">';
                        frameHelper += '<div class="sm-frame-n" style="display: none; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); font-size: 42px;">' + i + '</div>';
                        frameHelper += '<div class="sm-frame-drag-btn sm-autohide" id="sm-frame-drag-btn-' + i + '" draggable="true" style="pointer-events: auto; background-color: #333; width: 40px; height: 40px; border-radius: 8px; position: absolute; top: 6px; right: 6px;"><svg class="svg-icon" style="width: 40px;height:40px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M749.344 425.504l60.288 55.072h-266.08V216.8l55.232 57.856 44.512-44.8L509.472 96 375.36 229.824l44.8 44.8 60.32-57.824v263.776H219.424l54.912-55.04-44.48-44.512L96 514.848l133.824 133.824 44.48-44.48-54.88-60.48h261.024v263.648l-60.288-57.696-44.8 44.48 102.56 102.304v2.816h2.528l29.024 28.736 28.736-28.736h2.816v-2.816l102.272-102.272-44.48-44.48-55.264 57.664v-263.68h266.08l-60.288 60.48 44.8 44.48L928 514.88l-133.824-133.824z" fill="#ffffff" /></svg></div>';
                        frameHelper += '</div>';
                        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", frameHelper);
                        document.getElementById("sm-frame-drag-btn-" + i).addEventListener("dragstart", function(e) {
                            $(".sm-frame-helper").addClass("active");
                            $("#sm-frame-helper-" + $(this)[0].id.split("sm-frame-drag-btn-")[1]).removeClass("active");
                        });
                        document.getElementById("sm-frame-drag-btn-" + i).addEventListener("dragend", function(e) {
                            e.preventDefault();
                            $(".sm-frame-helper").removeClass("active");
                        });
                        document.getElementById("sm-frame-drag-btn-" + i).addEventListener("dragover", function(e) {
                            e.preventDefault();
                        });
                        var draggedFrame;
                        document.getElementById("sm-frame-drag-btn-" + i).addEventListener("drag", function(e) {
                            draggedFrame = $(this).attr("id");
                        });
                        document.getElementById("sm-frame-drag-btn-" + i).addEventListener("drop", function(e) {
                            e.preventDefault();
                            $(".sm-frame-helper").removeClass("active");

                            var sourceId = draggedFrame.split("sm-frame-drag-btn-")[1];
                            if (sourceId == 1) {
                                var sourceElement = "sm-popup-alt-container";
                            } else {
                                var sourceElement = "sm-frame-" + sourceId;
                            }
                            var sourcePosition = [document.getElementById(sourceElement).style.left, document.getElementById(sourceElement).style.top, document.getElementById(sourceElement).style.width, document.getElementById(sourceElement).style.height];

                            var targetId = e.target.id.split("sm-frame-drag-btn-")[1];
                            if (targetId == 1) {
                                var targetElement = "sm-popup-alt-container";
                            } else {
                                var targetElement = "sm-frame-" + targetId;
                            }
                            var targetPosition = [document.getElementById(targetElement).style.left, document.getElementById(targetElement).style.top, document.getElementById(targetElement).style.width, document.getElementById(targetElement).style.height];

                            document.getElementById(sourceElement).style.left = targetPosition[0];
                            document.getElementById(sourceElement).style.top = targetPosition[1];
                            document.getElementById(sourceElement).style.width = targetPosition[2];
                            document.getElementById(sourceElement).style.height = targetPosition[3];
                            document.getElementById("sm-frame-helper-" + sourceId).style.left = targetPosition[0];
                            document.getElementById("sm-frame-helper-" + sourceId).style.top = targetPosition[1];
                            document.getElementById("sm-frame-helper-" + sourceId).style.width = targetPosition[2];
                            document.getElementById("sm-frame-helper-" + sourceId).style.height = targetPosition[3];

                            document.getElementById(targetElement).style.left = sourcePosition[0];
                            document.getElementById(targetElement).style.top = sourcePosition[1];
                            document.getElementById(targetElement).style.width = sourcePosition[2];
                            document.getElementById(targetElement).style.height = sourcePosition[3];
                            document.getElementById("sm-frame-helper-" + targetId).style.left = sourcePosition[0];
                            document.getElementById("sm-frame-helper-" + targetId).style.top = sourcePosition[1];
                            document.getElementById("sm-frame-helper-" + targetId).style.width = sourcePosition[2];
                            document.getElementById("sm-frame-helper-" + targetId).style.height = sourcePosition[3];
                        });
                        */
                    }
                } else {
                    for (let i = 1; i <= smWindowAmount; i++) {
                        if (i > 1) {
                            var smWindowOffsetX = Math.round(smPopupPositions[smWindowAmount][i - 1][0] * screen.availWidth / 100);
                            var smWindowOffsetY = Math.round(smPopupPositions[smWindowAmount][i - 1][1] * screen.availHeight / 100);
                            var smWindowWidth = Math.round(smPopupPositions[smWindowAmount][i - 1][2] * screen.availWidth / 100) - BROWSER_USED_WIDTH;
                            var smWindowHeight = Math.round(smPopupPositions[smWindowAmount][i - 1][3] * screen.availHeight / 100) - BROWSER_USED_HEIGHT;
                            smWindow[i] = window.open(document.location.href.split("_multipopout")[0] + "_popout=" + window.location.hash.split("_")[1].split("=")[1], Date.now(), "left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                        }
                        smWindow[i].addEventListener('load', (event) => {
                            (function onWindowLoad() {
                                if (smWindow[i].document.getElementsByTagName("video")[0]) {
                                    console.log("video found!");
                                    if (i > 1) {
                                        smWindow[i].document.getElementsByTagName("video")[0].muted = true;
                                        smWindow[i].document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smAllWindowExtraHtml + smSecondaryWindowExtraHtml);
                                    }
                                    smWindow[i].document.title = "(#" + i + ")";// + smWindow[i].document.getElementById("sm-video-title").innerHTML;
                                    smWindow[i].document.getElementById("sm-popup-id").innerHTML = i;
                                } else {
                                    setTimeout(onWindowLoad, 100);
                                }
                            })();

                        });
                    }
                }

                function smPauseAll() {
                    for (let i = 1; i <= smWindowAmount; i++) {
                        smWindow[i].document.getElementsByTagName("video")[0].pause();
                    }
                }

                function smResumeAllWhenReady() {
                    var smResumeRetryCount = 0;
                    var smReadyCheck = setInterval(function() {
                        var smNotReady = 0;

                        for (let i = 1; i <= smWindowAmount; i++) {
                            if (smWindow[i].document.getElementsByTagName("video")[0].readyState != 4) {
                                smNotReady += 1;
                            }
                        }
                        if (smNotReady == 0) {
                            for (let i = 1; i <= smWindowAmount; i++) {
                                smWindow[i].document.getElementsByTagName("video")[0].play();
                            }
                            document.getElementById("sm-sync-status-text").innerHTML = "";
                            clearInterval(smReadyCheck);
                        }

                        // DIRTY FIX:
                        // Simulates click on seek-backward button if syncing takes longer than 2 seconds.
                        // This fixes Bitmovin player sometimes not buffering video after setting it's currentTime value.
                        // Might cause issues on slow internet connections.
                        smResumeRetryCount += 1;
                        if (smResumeRetryCount == 20) {
                            for (let i = 2; i <= smWindowAmount; i++) {
                                var savedTime = smWindow[i].document.getElementsByTagName("video")[0].currentTime;
                                smWindow[i].document.getElementsByClassName("bmpui-ui-rewindbutton")[0].click();
                                smWindow[i].document.getElementsByTagName("video")[0].currentTime = savedTime;
                            }
                        }

                    }, 100);
                }

                function smSync() {
                    var time = [];
                    var offset = [];
                    var timeDiff = [];
                    var smSynced = 0;

                    for (let i = 1; i <= smWindowAmount; i++) {
                        if (typeof smWindow[i].document.getElementsByTagName("video")[0] == 'undefined') {
                            return;
                        } else if (smWindow[i].document.getElementsByTagName("video")[0].readyState == 0) {
                            return;
                        }
                    }

                    if (smWindow[1].document.getElementsByTagName("video")[0].paused) {

                        for (let i = 2; i <= smWindowAmount; i++) {
                            if (smWindow[i].document.getElementsByTagName("video")[0].paused != true) {
                                smWindow[i].document.getElementsByTagName("video")[0].pause();
                            }
                        }
                        return;
                    }

                    for (let i = 2; i <= smWindowAmount; i++) {
                        if (smWindow[i].document.getElementsByTagName("video")[0].playbackRate !== smWindow[1].document.getElementsByTagName("video")[0].playbackRate) {
                            smWindow[i].document.getElementsByTagName("video")[0].playbackRate = smWindow[1].document.getElementsByTagName("video")[0].playbackRate;
                        }
                    }

                    for (let i = 1; i <= smWindowAmount; i++) {
                        offset[i] = parseInt(document.getElementById("sm-offset-" + i).value) / 1000 || 0;
                        var streamId = smWindow[i].window.location.href.split("/")[4];
                        //var name = smWindow[i].document.getElementById("bitmovinplayer-video-slave-embeddedPlayer").dataset.name;
                        var name = smWindow[i].document.getElementsByClassName("bmpui-label-metadata-title")[0].innerHTML.toLowerCase().replace(" ", "_");
                        if (smSyncData.videos[streamId]) {
                            if ((document.getElementById("sm-offset-" + i).value == "") && (smSyncData.videos[streamId].values[name])) {
                                var smSyncValue = smSyncData.videos[streamId].values[name];
                                document.getElementById("sm-offset-external-" + i).innerHTML = smSyncValue;
                                offset[i] = smSyncValue / 1000;
                            } else {
                                if (document.getElementById("sm-offset-external-" + i).innerHTML !== "") {
                                    document.getElementById("sm-offset-external-" + i).innerHTML = "";
                                }
                            }
                        }
                    }

                    var maxDesync = parseInt(document.getElementById("sm-maxdesync").value) / 1000 || 0.3;
                    for (let i = 1; i <= smWindowAmount; i++) {
                        time[i] = smWindow[i].document.getElementsByTagName("video")[0].currentTime - offset[i];
                    }

                    for (let i = 2; i <= smWindowAmount; i++) {
                        timeDiff[i] = Math.abs(time[1] - time[i]);
                        document.getElementById("sm-sync-status-" + i).innerHTML = Math.floor(timeDiff[i] * 1000) + " ms";
                    }

                    for (let i = 2; i <= smWindowAmount; i++) {
                        timeDiff[i] = Math.abs(time[1] - time[i]);
                        if (timeDiff[i] > maxDesync) {
                            smPauseAll();
                            smWindow[i].document.getElementsByTagName("video")[0].currentTime = time[1] + offset[i];
                            smSynced += 1;
                        }
                    }

                    if (smSynced > 0) {
                        document.getElementById("sm-sync-status-text").innerHTML = "SYNCING";
                        smResumeAllWhenReady();
                    }
                }
                var smSyncLoop = setInterval(function() {
                    smSync();
                }, 500);

                function smCloseAllWindows() {
                    for (let i = 1; i <= smWindowAmount; i++) {
                        if (!smWindow[i].closed) {
                            smWindow[i].close();
                        }
                    }
                    window.close();
                }
                for (let i = 1; i <= smWindowAmount; i++) {
                    smWindow[i].onbeforeunload = function() {
                        smCloseAllWindows();
                    };
                }
                window.onbeforeunload = function() {
                    smCloseAllWindows();
                };

            }
        }
    } else {

        function smLoad() {
            var smBtnHtml = "<div id='sm-menu' style='display: none;'>" +
                "<a id='sm-btn-popup' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT</span></a>" +
                "<a id='sm-btn-popups' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open multiple synchronized popout videos'>" +
                "<span style='display: inline-block; font-size: 12px;'>MULTI-VIEW</span></a>" +
                "<a id='sm-btn-theater' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Toggle theater mode'>" +
                "<span style='display: inline-block; font-size: 12px;'>THEATER</span></a>" +
                "</div>" +
                "<style>.global-header-nav .global-header-links ul { display: none; }" +
                ".global-header { display: block !important; }" +
                ".navbar button.navbar-toggler { position: fixed; top: 8px; color: #000 !important; background-color: #fff; }" +
                "@media (max-width: 991.98px) {" +
                ".header .navbar { padding: 0; }" +
                ".header .navbar .navbar-brand { display: none !important; }" +
                ".global-header-f1tvicon { display: none; }" +
                ".global-header-f-links { display: none; }" +
                ".global-header .global-header-actions { display: none; }" +
                "}" +
                "</style>";
            document.getElementsByClassName("global-header-nav")[0].insertAdjacentHTML("beforeend", smBtnHtml);

            var smFooterHtml = "<div style='width: 100%; background-color: #18485f; font-size: 16px; color: #fff; padding: 20px; margin-top: 20px; text-align: center;'>" +
                "F1TV+ v" + smVersion + "<a style='margin-left: 20px; color: #d3dfff;' href='https://github.com/najdek/f1tv_plus' target='_blank'>" +
                "<svg style='padding: 4px 0px 6px 0px;' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>" +
                "Source code</a>" +
                "<div id='btn-checkupdates' style='display: inline-block; margin-left: 16px; cursor: pointer; text-decoration: underline;'>CHECK FOR UPDATES</div>" +
                "</div>" +
                "<style> .full-footer { padding-bottom: 0 !important; } </style>";
            document.getElementsByClassName("full-footer")[0].insertAdjacentHTML("beforeend", smFooterHtml);

            document.getElementById("btn-checkupdates").addEventListener("click", function() {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: smUpdateUrl,
                    onload: function(response) {
                        var smNewVersion = response.responseText.split("@version")[1].split("\n")[0].replace(/\s/g, "");
                        var smNewVersionDesc = response.responseText.split("<updateDescription>")[1].split("</updateDescription>")[0];
                        if (smNewVersion != smVersion) {
                            var smUpdateHtml = "<div id='sm-update' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1001; text-align: center;'>" +
                                "<div id='sm-update-bg' style='background-color: #0000008f; width: 100%; height: 100%; top: 0; left: 0; position: absolute;'></div>" +
                                "<div style='background-color: #c70000; color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                                "<h3>F1TV+ update is available!</h3>" +
                                "<p>Installed version: " + smVersion + "<br>" +
                                "New version: " + smNewVersion + "</p>" +
                                "<p>" + smNewVersionDesc + "</p>" +
                                "<a href='" + smUpdateUrl + "' target='_blank' style='color: #ff0;'>[Click here to get the new version]</a>" +
                                "</div>" +
                                "</div>";
                            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smUpdateHtml);
                            document.getElementById("sm-update-bg").addEventListener("click", function() {
                                $("#sm-update").remove();
                            });
                        } else {
                            var smUpdateHtml = "<div id='sm-update' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1001; text-align: center;'>" +
                                "<div id='sm-update-bg' style='background-color: #0000008f; width: 100%; height: 100%; top: 0; left: 0; position: absolute;'></div>" +
                                "<div style='background-color: #c70000; color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                                "<div style='font-weight: bold; font-size: 20px;'>F1TV+ v" + smVersion + "</div>" +
                                "<p>Your version is up to date!</p>" +
                                "</div>" +
                                "</div>";
                            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smUpdateHtml);
                            document.getElementById("sm-update-bg").addEventListener("click", function() {
                                $("#sm-update").hide();
                            });
                            setTimeout(function() {
                                $("#sm-update").remove();
                            }, 3000);
                        }
                    }
                });
            });

            document.getElementById("sm-btn-popup").addEventListener("click", function() {
                window.open(document.location.href.replace("action=play", "") + "#f1tvplus_popout", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });


            document.getElementById("sm-btn-popups").addEventListener("click", function() {
                var smPopoutMenuHtml = "<div id='sm-popout-menu' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1001; text-align: center;'>" +
                    "<div id='sm-popout-menu-bg' style='background-color: #0000008f; width: 100%; height: 100%; top: 0; left: 0; position: absolute;'></div>" +
                    "<div style='background-color: #c70000; color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                    "<div style='font-size: 20px; font-weight: bold;'>F1TV+ MULTI-VIEW</div>" +
                    "<div id='sm-popout-menu-mode-selection' style='margin-top: 10px;'>" +
                    "<div style='font-size: 12px; margin: 4px;'>Select mode:</div>" +
                    "<div id='sm-popout-menu-mode-multipopout' style='display: inline-block; padding: 10px 20px; text-transform: uppercase; border: 1px solid #ff7171; border-radius: 20px 0px 0px 20px; background-color: #9a0000; cursor: pointer;'>Popouts</div>" +
                    "<div id='sm-popout-menu-mode-onewindow' style='display: inline-block; padding: 10px 20px; text-transform: uppercase; border: 1px solid #ff7171; border-radius: 0px 20px 20px 0px; background-color: #c13636; cursor: pointer;'>Frames</div>" +
                    "</div>" +
                    "<div id='sm-popout-menu-frame-selection' style='display: none; margin-top: 10px;'>" +
                    "<div style='font-size: 12px; margin: 4px;'>Display aspect ratio:</div>" +
                    "<div id='sm-popout-menu-frame-16by9' style='display: inline-block; padding: 10px 20px; text-transform: uppercase; border: 1px solid #ff7171; border-radius: 20px 0px 0px 20px; background-color: #9a0000; cursor: pointer;'>16:9</div>" +
                    "<div id='sm-popout-menu-frame-21by9' style='display: inline-block; padding: 10px 20px; text-transform: uppercase; border: 1px solid #ff7171; border-radius: 0px 20px 20px 0px; background-color: #c13636; cursor: pointer;'>21:9</div>" +
                    "</div>" +
                    "<div id='sm-popout-menu-options' style='text-align: center; margin-top: 16px;'>" +
                    "<div id='sm-popout-options-list'></div>" +
                    "<div id='sm-popout-options-frames' style='display: none;'>" +
                    "<div id='sm-popout-options-frame-16by9-list'></div>" +
                    "<div id='sm-popout-options-frame-21by9-list' style='display: none;'></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smPopoutMenuHtml);
                document.getElementById("sm-popout-menu-bg").addEventListener("click", function() {
                    $("#sm-popout-menu").remove();
                });
                document.getElementById("sm-popout-menu-mode-multipopout").addEventListener("click", function() {
                    $("#sm-popout-menu-mode-multipopout").css("background-color", "#9a0000");
                    $("#sm-popout-menu-mode-onewindow").css("background-color", "#c13636");
                    $("#sm-popout-menu-frame-selection").hide();
                    $("#sm-popout-options-list").show();
                    $("#sm-popout-options-frames").hide();
                });
                document.getElementById("sm-popout-menu-mode-onewindow").addEventListener("click", function() {
                    $("#sm-popout-menu-mode-multipopout").css("background-color", "#c13636");
                    $("#sm-popout-menu-mode-onewindow").css("background-color", "#9a0000");
                    $("#sm-popout-menu-frame-selection").show();
                    $("#sm-popout-options-list").hide();
                    $("#sm-popout-options-frames").show();
                });
                document.getElementById("sm-popout-menu-frame-16by9").addEventListener("click", function() {
                    $("#sm-popout-menu-frame-16by9").css("background-color", "#9a0000");
                    $("#sm-popout-menu-frame-21by9").css("background-color", "#c13636");
                    $("#sm-popout-options-frame-16by9-list").show();
                    $("#sm-popout-options-frame-21by9-list").hide();
                });
                document.getElementById("sm-popout-menu-frame-21by9").addEventListener("click", function() {
                    $("#sm-popout-menu-frame-16by9").css("background-color", "#c13636");
                    $("#sm-popout-menu-frame-21by9").css("background-color", "#9a0000");
                    $("#sm-popout-options-frame-16by9-list").hide();
                    $("#sm-popout-options-frame-21by9-list").show();
                });
                // popout list
                for (var i in smPopupPositions) {
                    if (i < 2) {
                        continue;
                    }
                    var btnWidth = 112;
                    var btnHeight = 63;
                    var smUrl_contentId = window.location.href.split("/")[4];
                    var btnHtml = "<div id='sm-popout-menu-option-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                        "<div id='popout-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                        "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                        "</div>";
                    document.getElementById("sm-popout-options-list").insertAdjacentHTML("beforeend", btnHtml);
                    document.getElementById("sm-popout-menu-option-" + i).addEventListener("click", function() {
                        var smWindowOffsetX = Math.round(smPopupPositions[$(this).data("i")][0][0] * screen.availWidth / 100);
                        var smWindowOffsetY = Math.round(smPopupPositions[$(this).data("i")][0][1] * screen.availHeight / 100);
                        var smWindowWidth = Math.round(smPopupPositions[$(this).data("i")][0][2] * screen.availWidth / 100) - BROWSER_USED_WIDTH;
                        var smWindowHeight = Math.round(smPopupPositions[$(this).data("i")][0][3] * screen.availHeight / 100) - BROWSER_USED_HEIGHT;
                        window.open(window.location.href.split("#")[0] + "#f1tvplus_multipopout:" + $(this).data("i") + "=" + $(this).data("contentid"), Date.now(), "left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                        $("video").trigger("pause");
                        var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center; background-color: #000; font-family: Arial;'>" +
                            "<div style='color: #ccc; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                            "<h3>Opened in popout...</h3>" +
                            "</div>" +
                            "</div>";
                        document.getElementsByTagName("body")[0].innerHTML = smHtml;
                    });
                    for (var popoutAmount in smPopupPositions[i]) {
                        var smPopoutIconHtml = "<div style='position: absolute; left: " + smPopupPositions[i][popoutAmount][0] * btnWidth / 100 + "px; top: " + smPopupPositions[i][popoutAmount][1] * btnHeight / 100 + "px; width: " + smPopupPositions[i][popoutAmount][2] * btnWidth / 100 + "px; height: " + smPopupPositions[i][popoutAmount][3] * btnHeight / 100 + "px; background-color: #fff; border: 1px solid #000; border-radius: 2px;'></div>";
                        document.getElementById("popout-icon-" + i).insertAdjacentHTML("beforeend", smPopoutIconHtml);
                    }
                }

                // frame 16by9 list
                for (var i in smFramePositions16by9) {
                    if (smFramePositions16by9[i].length < 2) {
                        continue;
                    }
                    var btnWidth = 112;
                    var btnHeight = 63;
                    var smUrl_contentId = window.location.href.split("/")[4];
                    var btnHtml = "<div id='sm-popout-menu-option-frame-16by9-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                        "<div id='frame-16by9-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                        "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                        "</div>";
                    document.getElementById("sm-popout-options-frame-16by9-list").insertAdjacentHTML("beforeend", btnHtml);
                    document.getElementById("sm-popout-menu-option-frame-16by9-" + i).addEventListener("click", function() {
                        window.open(window.location.href.split("#")[0] + "#f1tvplus_multipopout:" + $(this).data("i") + ":onewindow:16by9=" + $(this).data("contentid"), Date.now(), "width=1280,height=720");
                        $("video").trigger("pause");
                        var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center; background-color: #000; font-family: Arial;'>" +
                            "<div style='color: #ccc; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                            "<h3>Opened in popout...</h3>" +
                            "</div>" +
                            "</div>";
                        document.getElementsByTagName("body")[0].innerHTML = smHtml;
                    });
                    for (var popoutAmount in smFramePositions16by9[i]) {
                        var smPopoutIconHtml = "<div style='position: absolute; left: " + smFramePositions16by9[i][popoutAmount][0] * btnWidth / 100 + "px; top: " + smFramePositions16by9[i][popoutAmount][1] * btnHeight / 100 + "px; width: " + smFramePositions16by9[i][popoutAmount][2] * btnWidth / 100 + "px; height: " + smFramePositions16by9[i][popoutAmount][3] * btnHeight / 100 + "px; background-color: #fff; border: 1px solid #000; border-radius: 2px;'></div>";
                        document.getElementById("frame-16by9-icon-" + i).insertAdjacentHTML("beforeend", smPopoutIconHtml);
                    }
                }

                // frame 21by9 list
                for (var i in smFramePositions21by9) {
                    if (smFramePositions21by9[i].length < 2) {
                        continue;
                    }
                    var btnWidth = 147;
                    var btnHeight = 63;
                    var smUrl_contentId = window.location.href.split("/")[4];
                    var btnHtml = "<div id='sm-popout-menu-option-frame-21by9-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                        "<div id='frame-21by9-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                        "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                        "</div>";
                    document.getElementById("sm-popout-options-frame-21by9-list").insertAdjacentHTML("beforeend", btnHtml);
                    document.getElementById("sm-popout-menu-option-frame-21by9-" + i).addEventListener("click", function() {
                        window.open(window.location.href.split("#")[0] + "#f1tvplus_multipopout:" + $(this).data("i") + ":onewindow:21by9=" + $(this).data("contentid"), Date.now(), "width=1280,height=720");
                        $("video").trigger("pause");
                        var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center; background-color: #000; font-family: Arial;'>" +
                            "<div style='color: #ccc; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                            "<h3>Opened in popout...</h3>" +
                            "</div>" +
                            "</div>";
                        document.getElementsByTagName("body")[0].innerHTML = smHtml;
                    });
                    for (var popoutAmount in smFramePositions21by9[i]) {
                        var smPopoutIconHtml = "<div style='position: absolute; left: " + smFramePositions21by9[i][popoutAmount][0] * btnWidth / 100 + "px; top: " + smFramePositions21by9[i][popoutAmount][1] * btnHeight / 100 + "px; width: " + smFramePositions21by9[i][popoutAmount][2] * btnWidth / 100 + "px; height: " + smFramePositions21by9[i][popoutAmount][3] * btnHeight / 100 + "px; background-color: #fff; border: 1px solid #000; border-radius: 2px;'></div>";
                        document.getElementById("frame-21by9-icon-" + i).insertAdjacentHTML("beforeend", smPopoutIconHtml);
                    }
                }
            });


            document.getElementById("sm-btn-theater").addEventListener("click", function() {
                if (!document.getElementById("sm-theater-style")) {
                    var smHtml = "<div id='sm-theater-style'>" +
                        "<style>" +
                        "#sm-btn-theater { background-color: #ffc1c1; }" +
                        ".vod-detail-page .container-lg:first-of-type { width: 100%; max-width: 100%; }" +
                        ".vod-detail-page .container-lg:first-of-type .col-xl-10.offset-xl-1 { margin: 0; width: 100%; max-width: 100%; flex: 0 0 100%; }" +
                        ".inset-video-item-container { margin-top: 0 !important; }" +
                        ".inset-video-item-image-container { max-height: calc(100vh - 100px); }" +
                        ".inset-video-item-play-action-container { width: 100%; }" +
                        ".sticky-header-wrapper.is-menu { margin-bottom: 94px; }" +
                        "nav.navbar { height: auto !important; }" +
                        "</style>" +
                        "</div>";
                    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);
                } else {
                    document.getElementById("sm-theater-style").outerHTML = "";
                }
            });
            document.getElementById("sm-btn-theater").click();
            setInterval(function() {
                if (window.location.href.includes("detail/")) {
                    document.getElementById("sm-menu").style.display = "inline-block";
                } else {
                    document.getElementById("sm-menu").style.display = "none";
                }
            }, 1000);
        }

        var smInitRetryCount = 0;
        (function smInit() {
            setTimeout(function() {
                if ((document.getElementsByClassName("global-header-nav").length > 0) && (document.getElementsByClassName("full-footer").length > 0)) {
                    smLoad();
                } else {
                    if (smInitRetryCount < 60) {
                        smInitRetryCount += 1;
                        smInit();
                    } else {
                        smLoad();
                    }
                }
            }, 500);
        }());

    }

})();
