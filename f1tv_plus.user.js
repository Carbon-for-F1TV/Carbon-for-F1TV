// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.github.io/f1tv_plus/
// @version      2.2.5
// @description  A few improvements to F1TV
// @author       Mateusz Najdek
// @match        https://f1tv.formula1.com/*
// @grant        GM.xmlHttpRequest
// @connect      raw.githubusercontent.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.1.5/dist/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/shaka-player@3.3.2/dist/shaka-player.compiled.min.js
// ==/UserScript==
(function() {
    'use strict';

    var smVersion = "2.2.5";
    //<updateDescription>- Updated player libraries</updateDescription>

    var smUpdateUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/master/f1tv_plus.user.js";
    var smSyncDataUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/master/sync_offsets.json";

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

    var DEFAULT_AUDIOTRACK = "English";

    var USE_F1_FONT = false;

    var smURL_DOMAIN = "f1tv.formula1.com";
    var smURL_EMPTYPAGE = "/1.0/R/ENG/WEB_DASH/ALL/GETSTATICTEXT/"; // an empty page on F1TV domain
    var LOGIN_PAGE = "https://account.formula1.com/#/en/login?redirect=https%3A%2F%2Ff1tv.formula1.com%2F";


    shaka.polyfill.installAll();

    if (window.location.href.split(smURL_DOMAIN)[1].split("#")[0] == smURL_EMPTYPAGE) {
        if (window.location.hash.split("_")[0] == "#f1tvplus") {
            window.onhashchange = function() {
                window.location.reload();
            }
            if (window.location.hash.split("_")[1].split("=")[0] == "play" ||
                window.location.hash.split("_")[1].split("=")[0] == "popout" ||
                window.location.hash.split("_")[1].split("=")[0].split(":")[0] == "multipopout") {
                var smPopupAltHtml = "<div id='sm-header' style='display: none; justify-content: space-between; align-items: center; user-select: none; position: fixed; top: 0; left: 0; width: 100%; height: 50px; line-height: 30px; background-color: #e10600; color: #fff;'>" +
                    "<div id='header-title' style='padding: 10px 20px; font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'></div>" +
                    "<div id='header-links' style='padding: 10px; display: flex;'>" +
                    "<div id='header-btn-url' style='display: inline-flex; background-color: #af2020; font-size: 14px; padding: 2px 10px; border-radius: 6px; border: 1px solid #ffc0c0; cursor: pointer;'>URL</div>" +
                    "<div id='header-btn-popout' style='display: inline-flex; background-color: #af2020; font-size: 14px; padding: 2px 10px; border-radius: 6px; border: 1px solid #ffc0c0; cursor: pointer; margin-left: 10px;'>MULTI-VIEW</div>" +
                    "<div style='display: inline-flex; align-items: center; margin-left: 20px;'><div style='font-size: 24px; font-weight: bold;'>F1TV+</div><div id='header-btn-checkupdates' style='display: inline-flex; font-size: 10px; padding: 2px 10px; cursor: pointer; margin-left: 10px; line-height: 12px; text-align: center; text-decoration: underline;'>CHECK FOR<br>UPDATES</div></div>" +
                    "</div>" +
                    "</div>" +
                    "<div id='sm-popup-alt-container' style='user-select: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
                    "<div id='sm-popup-id' style='display: none;'>0</div>" +
                    "<div id='sm-additional-streams' style='display: none;'>0</div>" +
                    "<div style='position: absolute; top: 50%; width: 100%; text-align: center; transform: translateY(-50%); font-weight: bold; font-size: 90px; color: #ccc;'>F1TV+</div>" +
                    "<video id='sm-popup-video' muted style='position: absolute; top: 0; left: 0; height: 100%; width: 100%;'></video>" +
                    "<div id='sm-audio-tracks-container' style='display: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
                    "<div id='sm-audio-tracks' style='position: absolute; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 165px; bottom: 40px;'></div>" +
                    "</div>" +
                    "<div id='sm-levels-container' style='display: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
                    "<div id='sm-levels' style='position: absolute; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 205px; bottom: 40px;'></div>" +
                    "</div>" +
                    "<div id='sm-speeds-container' style='display: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
                    "<div id='sm-speeds' style='position: absolute; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 235px; bottom: 40px;'></div>" +
                    "</div>" +
                    "<div id='sm-video-menu' class='sm-autohide' style='position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background-color: #000;'>" +
                    "<div id='sm-video-titlebar' style='display: none; cursor: default; width: 100%; height: 40px; background-color: black;'><div id='sm-video-titlebar-txt' style='position: absolute; color: #fff; width: 100%; text-align: left; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 16px; line-height: 40px;'><span id='sm-video-title' style='margin-left: 20px;'></span><span class='sm-hide-from-900px' style='margin-left: 40px; color: #bbb;'>Use Window #1 to control all feeds.</span></div></div>" +
                    "<div id='sm-video-primary-controls'>" +
                    "<div id='sm-pause-toggle' style='display: inline-block; cursor: pointer; height: 40px;'>" +
                    "<svg class='sm-icon-pause' style='display: none; height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M14 19h4V5h-4M6 19h4V5H6v14z' fill='#ffffff'/></svg>" +
                    "<svg class='sm-icon-play' style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M8 5.14v14l11-7l-11-7z' fill='#ffffff'/></svg>" +
                    "</div>" +
                    "<div style='display: inline-block; position: relative; width: calc(100% - 390px); bottom: 0; left: 0;'>" +
                    "<div id='sm-video-seekbar' style='display: inline-block; cursor: pointer; width: 100%; height: 40px; background-color: black;'>" +
                    "<div id='sm-video-seekbar-in' style='background-color: #e10600; width: 0%; height: 100%;'></div>" +
                    "<div id='sm-video-seekbar-txt' style='position: absolute; color: #fff; width: 100%; text-align: center; top: 0; font-family: monospace; font-size: 16px; line-height: 40px;'></div>" +
                    "<div id='sm-video-seekbar-txt-onhover' style='display: none; padding: 0 20px; position: absolute; color: #fff; top: 0; font-family: monospace; font-size: 16px; line-height: 40px;'></div>" +
                    "<div id='sm-video-seekbar-pointer-onhover' style='display: none; position: absolute; height: 100%; width: 1px; top: 0; background-color: #fff;'></div>" +
                    "</div>" +
                    "</div>" +
                    "<div id='sm-speed-change' style='display: inline-block; cursor: pointer; height: 40px;'>" +
                    "<svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z' fill='#ffffff'/></svg>" +
                    "</div>" +
                    "</div>" +
                    "<div style='position: absolute; bottom: 0; right: 0; height: 40px;'>" +
                    "<div id='sm-level-change' style='display: inline-block; cursor: pointer; height: 40px; margin-right: 8px;'>" +
                    "<svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z' fill='#ffffff'/></svg>" +
                    "</div>" +
                    "<div id='sm-audiotrack-change' style='display: inline-block; cursor: pointer; height: 40px; margin-right: 8px;'>" +
                    "<svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M9 5a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c2.67 0 8 1.34 8 4v2H1v-2c0-2.66 5.33-4 8-4m7.76-9.64c2.02 2.2 2.02 5.25 0 7.27l-1.68-1.69c.84-1.18.84-2.71 0-3.89l1.68-1.69M20.07 2c3.93 4.05 3.9 10.11 0 14l-1.63-1.63c2.77-3.18 2.77-7.72 0-10.74L20.07 2z' fill='#ffffff'/></svg>" +
                    "</div>" +
                    "<div style='display: inline-block;'><input type='range' id='sm-volume-slider' min='0' max='100' value='0' style='height: 36px; margin: 0; width: 120px; opacity: 0.5;'></div>" +
                    "<div id='sm-volume-toggle' style='display: inline-block; cursor: pointer; margin-right: 8px;'>" +
                    "<svg class='volume-high' style='display: none; height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z' fill='#ffffff'/></svg>" +
                    "<svg class='volume-muted' style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12z' fill='#ffffff'/></svg>" +
                    "</div>" +
                    "<div id='sm-fullscreen-toggle' style='display: inline-block; cursor: pointer;'><svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z' fill='#ffffff'/></svg></div>" +
                    "</div>" +
                    "</div>" +
                    "<a id='sm-btn-feeds' role='button' class='sm-btn sm-autohide' style='position: absolute; top: 0; left: 50%; transform: translateX(-50%); background-color: #000000aa; width: 40px; height: 30px; line-height: 20px; text-align: center; border-radius: 0px 0px 20px 20px;'>" +
                    "<span style='border: solid #fff; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(45deg);'></span>" +
                    "</a>" +
                    "<style>" +
                    "body { font-family: Arial; }" +
                    ".sm-btn { display: inline-block; cursor: pointer; border-radius: 4px; }" +
                    ".sm-btn-audiotrack, .sm-btn-level, .sm-btn-speed { background-color: #333; color: #fff; font-size: 12px; width: 100%; margin: 2px 0; padding: 8px 0; position: relative; } " +
                    ".sm-btn-speed { padding: 6px 0; }" +
                    ".sm-btn-active { background-color: #b10000; }" +
                    "#sm-video-menu-container:hover #sm-video-menu { display: block !important; }" +
                    "@media screen and (max-width: 900px) { .sm-hide-from-900px { display: none; } }" +
                    ".sm-autohide {" +
                    "visibility: hidden; opacity: 0;" +
                    "transition: visibility 0.3s, opacity 0.3s linear;" +
                    "}" +
                    ".sm-autohide.shown {" +
                    "visibility: visible; opacity: 1;" +
                    "}" +
                    "</style>" +
                    "</div>";

                document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smPopupAltHtml);

                if (USE_F1_FONT) {
                    var fontHtml = "<style>" +
                        "@font-face {font-family: 'Formula1-Regular'; src: url(/static/0f4e3d54644717199c6f6c04c19737f1.ttf) format('truetype')}" +
                        "body {font-family: 'Formula1-Regular';}"
                    "</style>";
                    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", fontHtml);
                }

                if (window.location.hash.split("_")[1].split("=")[0] == "play") {
                    $("#sm-header").css("display", "flex");
                    $("#sm-popup-alt-container").css("top", "50px");
                    $("#sm-popup-alt-container").css("height", "calc(100% - 50px)");

                    document.getElementById("header-btn-url").addEventListener("click", function() {
                        if (document.getElementsByClassName("sm-urls-container").length > 0) {
                            $(".sm-urls-container").show();
                        } else {
                            var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
                            var smUrl_contentId = window.location.hash.split("_")[1].split("=")[1];
                            var smHtml = "<div class='sm-urls-container' style='position: fixed; z-index: 1002; top: 0; left: 0;'>" +
                                "<div id='sm-urls-container-bg' style='position: fixed; background-color: #000000c9; z-index: 1002; top: 0; left: 0; height: 100%; width: 100%;'></div>" +
                                "<div style='position: fixed; text-align: center; background-color: #000; z-index: 1003; width: 100%;'>" +
                                "<div class='sm-urls-main'></div>" +
                                "<div class='sm-urls'></div>" +
                                "</div>" +
                                "</div>";
                            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);
                            document.getElementById("sm-urls-container-bg").addEventListener("click", function() {
                                $(".sm-urls-container").hide();
                            });
                            var smUrl_array = [];
                            var smUrlColor_array = [];
                            var smUrlTeam_array = [];
                            var smAdditionalStreams = true;
                            smUrlTeam_array["-"] = [];
                            smUrlTeam_array["-"]["main_feed"] = "MAIN FEED";
                            smUrl_array["main_feed"] = "https://" + smURL_DOMAIN + "/1.0/R/ENG/WEB_HLS/ALL/CONTENT/PLAY?contentId=" + smUrl_contentId;
                            $.ajax({
                                url: "https://" + smURL_DOMAIN + "/2.0/R/ENG/WEB_DASH/ALL/CONTENT/VIDEO/" + smUrl_contentId + "/F1_TV_Pro_Annual/2",
                                type: 'get',
                                dataType: 'json',
                                async: true,
                                success: function(data) {
                                    if (data.resultObj.containers[0].metadata.additionalStreams) {
                                        data.resultObj.containers[0].metadata.additionalStreams.forEach(function(d) {
                                            smUrl_array[d.title.replace(/\s+/g, '_').toLowerCase()] = "https://" + smURL_DOMAIN + "/1.0/R/ENG/WEB_HLS/ALL/" + d.playbackUrl;
                                            smUrlColor_array[d.title.replace(/\s+/g, '_').toLowerCase()] = d.hex;
                                            if (!d.teamName || d.teamName == "") {
                                                d.teamName = "-";
                                            }
                                            if (!smUrlTeam_array[d.teamName]) {
                                                smUrlTeam_array[d.teamName] = [];
                                            }
                                            if (d.driverFirstName && d.driverLastName) {
                                                smUrlTeam_array[d.teamName][d.title.replace(/\s+/g, '_').toLowerCase()] = d.driverFirstName + " " + d.driverLastName;
                                            } else {
                                                smUrlTeam_array[d.teamName][d.title.replace(/\s+/g, '_').toLowerCase()] = d.title.replace(/_+/g, ' ').toUpperCase();
                                            }
                                        });
                                    } else {
                                        smAdditionalStreams = false;
                                    }
                                    var smMainFeeds = [
                                        "main_feed",
                                        "data",
                                        "pit_lane",
                                        "tracker"
                                    ];
                                    for (var t in smUrlTeam_array) {
                                        var team = smUrlTeam_array[t];
                                        for (var title in team) {
                                            var url = smUrl_array[title];
                                            var smUrlElement = "sm-urls";
                                            if (smMainFeeds.indexOf(title) > -1) {
                                                smUrlElement = "sm-urls-main";
                                            }
                                            var color = "#999999";
                                            if (smUrlColor_array[title]) {
                                                color = smUrlColor_array[title];
                                            }
                                            var smBtnHtml = "<a id='btn-url-" + title + "' title='" + team[title] + "' role='button' class='sm-btn' data-url='" + url + "' style='border-bottom: 4px solid " + color + "; background-color: #333; color: #fff; font-size: 12px; margin: 3px; padding: 8px 14px; position: relative;'>" +
                                                "<span>" + title.replace(/_+/g, ' ').toUpperCase() + "</span></a>";
                                            document.getElementsByClassName(smUrlElement)[0].insertAdjacentHTML("beforeend", smBtnHtml);
                                            document.getElementById("btn-url-" + title).addEventListener("click", function() {

                                                $.ajax({
                                                    url: $(this).data("url"),
                                                    type: 'get',
                                                    dataType: 'json',
                                                    headers: {
                                                        "entitlementtoken": smUrl_entitlement_token
                                                    },
                                                    async: true,
                                                    success: function(data) {
                                                        prompt("Stream URL: ", data.resultObj.url);
                                                        $(".sm-urls-container").hide();
                                                    },
                                                    error: function() {
                                                        alert("Error: Can't get stream URL...");
                                                        $(".sm-urls-container").hide();
                                                    }
                                                });

                                            });
                                        }
                                    }
                                    if (smAdditionalStreams == false) {
                                        document.getElementById("btn-url-main_feed").click();
                                    }
                                },
                                error: function() {
                                    alert("Error: Can't get stream URL...");
                                }
                            });
                        }
                    });


                    document.getElementById("header-btn-popout").addEventListener("click", function() {
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
                            if (i == 0) {
                                continue;
                            }
                            if ((i > 1) && (parseInt(document.getElementById("sm-additional-streams").innerHTML) == 0)) {
                                document.getElementById("sm-popout-menu-option-1").click();
                                break;
                            }
                            var btnWidth = 112;
                            var btnHeight = 63;
                            var smUrl_contentId = window.location.hash.split("_")[1].split("=")[1];
                            var btnHtml = "<div id='sm-popout-menu-option-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                                "<div id='popout-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                                "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                                "</div>";
                            document.getElementById("sm-popout-options-list").insertAdjacentHTML("beforeend", btnHtml);
                            document.getElementById("sm-popout-menu-option-" + i).addEventListener("click", function() {
                                if ($(this).data("i") == 1) {
                                    window.open("https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_popout=" + $(this).data("contentid"), Date.now(), "width=1280,height=720");
                                } else {
                                    var smWindowOffsetX = Math.round(smPopupPositions[$(this).data("i")][0][0] * screen.availWidth / 100);
                                    var smWindowOffsetY = Math.round(smPopupPositions[$(this).data("i")][0][1] * screen.availHeight / 100);
                                    var smWindowWidth = Math.round(smPopupPositions[$(this).data("i")][0][2] * screen.availWidth / 100) - BROWSER_USED_WIDTH;
                                    var smWindowHeight = Math.round(smPopupPositions[$(this).data("i")][0][3] * screen.availHeight / 100) - BROWSER_USED_HEIGHT;
                                    window.open("https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_multipopout:" + $(this).data("i") + "=" + $(this).data("contentid"), Date.now(), "left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                                }
                                var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center; background-color: #000; font-family: Arial;'>" +
                                    "<div style='color: #ccc; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                                    "<h3>Opened in popout...</h3>" +
                                    "<p style='text-decoration: underline; cursor: pointer;' onclick='window.location.reload();'>Click here to reload</p>" +
                                    "</div>" +
                                    "</div>";
                                document.getElementsByTagName("body")[0].innerHTML = smHtml;
                                $("video").trigger("pause");
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
                            var smUrl_contentId = window.location.hash.split("_")[1].split("=")[1];
                            var btnHtml = "<div id='sm-popout-menu-option-frame-16by9-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                                "<div id='frame-16by9-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                                "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                                "</div>";
                            document.getElementById("sm-popout-options-frame-16by9-list").insertAdjacentHTML("beforeend", btnHtml);
                            document.getElementById("sm-popout-menu-option-frame-16by9-" + i).addEventListener("click", function() {
                                window.location.href = "https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_multipopout:" + $(this).data("i") + ":onewindow:16by9=" + $(this).data("contentid");
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
                            var smUrl_contentId = window.location.hash.split("_")[1].split("=")[1];
                            var btnHtml = "<div id='sm-popout-menu-option-frame-21by9-" + i + "' data-i='" + i + "' data-contentid='" + smUrl_contentId + "' style='display: inline-block; margin: 6px; padding: 10px; border-radius: 6px; border: 1px solid #ffc0c0; background-color: #af2020; cursor: pointer;'>" +
                                "<div id='frame-21by9-icon-" + i + "' style='width: " + btnWidth + "px; height: " + btnHeight + "px; position: relative;'></div>" +
                                "<div style='font-size: 20px; margin-top: 10px;'>" + i + "</div>" +
                                "</div>";
                            document.getElementById("sm-popout-options-frame-21by9-list").insertAdjacentHTML("beforeend", btnHtml);
                            document.getElementById("sm-popout-menu-option-frame-21by9-" + i).addEventListener("click", function() {
                                window.location.href = "https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_multipopout:" + $(this).data("i") + ":onewindow:21by9=" + $(this).data("contentid");
                            });
                            for (var popoutAmount in smFramePositions21by9[i]) {
                                var smPopoutIconHtml = "<div style='position: absolute; left: " + smFramePositions21by9[i][popoutAmount][0] * btnWidth / 100 + "px; top: " + smFramePositions21by9[i][popoutAmount][1] * btnHeight / 100 + "px; width: " + smFramePositions21by9[i][popoutAmount][2] * btnWidth / 100 + "px; height: " + smFramePositions21by9[i][popoutAmount][3] * btnHeight / 100 + "px; background-color: #fff; border: 1px solid #000; border-radius: 2px;'></div>";
                                document.getElementById("frame-21by9-icon-" + i).insertAdjacentHTML("beforeend", smPopoutIconHtml);
                            }
                        }
                    });


                    document.getElementById("header-btn-checkupdates").addEventListener("click", function() {
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
                }

                document.getElementById("sm-audio-tracks-container").addEventListener("click", function() {
                    document.getElementById("sm-audio-tracks-container").style.display = "none";
                });

                document.getElementById("sm-levels-container").addEventListener("click", function() {
                    document.getElementById("sm-levels-container").style.display = "none";
                });

                document.getElementById("sm-speeds-container").addEventListener("click", function() {
                    document.getElementById("sm-speeds-container").style.display = "none";
                });

                document.getElementById("sm-speed-change").addEventListener("click", function() {
                    document.getElementById("sm-speeds-container").style.display = "block";
                });

                document.getElementById("sm-level-change").addEventListener("click", function() {
                    document.getElementById("sm-levels-container").style.display = "block";
                });

                document.getElementById("sm-audiotrack-change").addEventListener("click", function() {
                    document.getElementById("sm-audio-tracks-container").style.display = "block";
                });

                document.getElementById("sm-btn-feeds").addEventListener("click", function() {
                    if (document.getElementsByClassName("sm-feeds-container").length > 0) {
                        $(".sm-feeds-container").show();
                    } else {
                        var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
                        var smUrl_contentId = window.location.hash.split("_")[1].split("=")[1];
                        var smHtml = "<div class='sm-feeds-container' style='position: relative; z-index: 1002; top: 0; left: 0; width: 100%; height: 100%;'>" +
                            "<div id='sm-feeds-container-bg' style='position: absolute; z-index: 1002; top: 0; left: 0; height: 100%; width: 100%;'></div>" +
                            "<div style='position: absolute; text-align: center; background-color: #000000dd; z-index: 1003; width: 96%; left: 2%; border-radius: 0px 0px 20px 20px;'>" +
                            "<div class='sm-feeds-main'></div>" +
                            "<div class='sm-feeds'></div>" +
                            "</div>" +
                            "</div>";
                        document.getElementById("sm-popup-alt-container").insertAdjacentHTML("beforeend", smHtml);
                        document.getElementById("sm-feeds-container-bg").addEventListener("click", function() {
                            $(".sm-feeds-container").hide();
                        });
                        var smUrl_array = [];
                        var smUrlColor_array = [];
                        var smUrlTeam_array = [];
                        var smAdditionalStreams = true;
                        smUrl_array["main_feed"] = "https://" + smURL_DOMAIN + "/1.0/R/ENG/WEB_HLS/ALL/CONTENT/PLAY?contentId=" + smUrl_contentId;
                        smUrlTeam_array["-"] = [];
                        smUrlTeam_array["-"]["main_feed"] = "MAIN FEED";
                        $.ajax({
                            url: "https://" + smURL_DOMAIN + "/2.0/R/ENG/WEB_DASH/ALL/CONTENT/VIDEO/" + smUrl_contentId + "/F1_TV_Pro_Annual/2",
                            type: 'get',
                            dataType: 'json',
                            async: true,
                            success: function(data) {
                                if (parseInt(document.getElementById("sm-popup-id").innerHTML) == 0) {
                                    document.title = data.resultObj.containers[0].metadata.title;
                                    document.getElementById("header-title").innerHTML = data.resultObj.containers[0].metadata.title;
                                }
                                if (data.resultObj.containers[0].metadata.additionalStreams) {
                                    data.resultObj.containers[0].metadata.additionalStreams.forEach(function(d) {
                                        smUrl_array[d.title.replace(/\s+/g, '_').toLowerCase()] = "https://" + smURL_DOMAIN + "/1.0/R/ENG/WEB_HLS/ALL/" + d.playbackUrl;
                                        smUrlColor_array[d.title.replace(/\s+/g, '_').toLowerCase()] = d.hex;
                                        if (!d.teamName || d.teamName == "") {
                                            d.teamName = "-";
                                        }
                                        if (!smUrlTeam_array[d.teamName]) {
                                            smUrlTeam_array[d.teamName] = [];
                                        }
                                        if (d.driverFirstName && d.driverLastName) {
                                            smUrlTeam_array[d.teamName][d.title.replace(/\s+/g, '_').toLowerCase()] = d.driverFirstName + " " + d.driverLastName;
                                        } else {
                                            smUrlTeam_array[d.teamName][d.title.replace(/\s+/g, '_').toLowerCase()] = d.title.replace(/_+/g, ' ').toUpperCase();
                                        }
                                    });
                                    document.getElementById("sm-additional-streams").innerHTML = "1";
                                } else {
                                    smAdditionalStreams = false;
                                }

                                var smMainFeeds = [
                                    "main_feed",
                                    "data",
                                    "pit_lane",
                                    "tracker"
                                ];
                                for (var t in smUrlTeam_array) {
                                    var team = smUrlTeam_array[t];
                                    for (var title in team) {
                                        var url = smUrl_array[title];
                                        var smUrlElement = "sm-feeds";
                                        if (smMainFeeds.indexOf(title) > -1) {
                                            smUrlElement = "sm-feeds-main";
                                        }
                                        var color = "#999999";
                                        if (smUrlColor_array[title]) {
                                            color = smUrlColor_array[title];
                                        }
                                        var smBtnHtml = "<a id='sm-btn-feeds-" + title + "' title='" + team[title] + "' role='button' class='sm-btn' data-streamid='" + smUrl_contentId + "' data-name='" + title + "' data-fullname='" + team[title] + "' data-url='" + url + "' style='border-bottom: 4px solid " + color + "; background-color: #333; color: #fff; font-size: 12px; margin: 3px; padding: 8px 14px; position: relative;'>" +
                                            "<span>" + title.replace(/_+/g, ' ').toUpperCase() + "</span></a>";
                                        document.getElementsByClassName(smUrlElement)[0].insertAdjacentHTML("beforeend", smBtnHtml);
                                        document.getElementById("sm-btn-feeds-" + title).addEventListener("click", function() {
                                            var name = $(this).data("name");
                                            var fullname = $(this).data("fullname");
                                            var streamId = $(this).data("streamid");
                                            $.ajax({
                                                url: $(this).data("url"),
                                                type: 'get',
                                                dataType: 'json',
                                                headers: {
                                                    "entitlementtoken": smUrl_entitlement_token
                                                },
                                                async: true,
                                                success: function(data) {

                                                    var oldTime = document.getElementById("sm-popup-video").currentTime;

                                                    if (parseInt(document.getElementById("sm-popup-id").innerHTML) > 0) {
                                                        document.title = "(#" + document.getElementById("sm-popup-id").innerHTML + ") " + fullname;
                                                        document.getElementById("sm-video-title").innerHTML = fullname;
                                                    }

                                                    document.getElementById("sm-speeds").innerHTML = "<div style='margin-bottom: 8px;'>Playback speed</div>";
                                                    var smSpeed;
                                                    for (smSpeed in VIDEO_SPEEDS) {
                                                        document.getElementById("sm-speeds").innerHTML += "<a class='sm-btn sm-btn-speed' data-speed='" + VIDEO_SPEEDS[smSpeed][0] + "' id='sm-btn-speed-" + VIDEO_SPEEDS[smSpeed][0] + "'>" + VIDEO_SPEEDS[smSpeed][1] + "</a><br>";
                                                    }
                                                    $("#sm-btn-speed-100").addClass("sm-btn-active");
                                                    for (smSpeed in VIDEO_SPEEDS) {
                                                        document.getElementById("sm-btn-speed-" + VIDEO_SPEEDS[smSpeed][0]).addEventListener("click", function() {
                                                            document.getElementById("sm-popup-video").playbackRate = parseInt($(this).data("speed")) / 100;
                                                            $(".sm-btn-speed").removeClass("sm-btn-active");
                                                            $(this).addClass("sm-btn-active");
                                                        });
                                                    }


                                                    function waitForVideo() {
                                                        if (document.getElementById("sm-popup-video").readyState > 0 && $("#sm-popup-video").attr('data-name') == name) {
                                                            document.getElementById("sm-popup-video").currentTime = oldTime;
                                                            document.getElementById("sm-popup-video").play();
                                                        } else {
                                                            setTimeout(waitForVideo, 200);
                                                        }
                                                    }
                                                    waitForVideo();
                                                    $("#sm-popup-video").attr('data-name', name);
                                                    $("#sm-popup-video").attr('data-streamid', streamId);

                                                    if (data.resultObj.url.includes("index.mpd")) {
                                                        console.log("[F1TV+] Streaming protocol: DASH");
                                                        $("#sm-popup-video").attr("data-streamprotocol", "DASH");
                                                        var smPlayer = new shaka.Player(document.getElementById("sm-popup-video"));
                                                        smPlayer.getNetworkingEngine().registerRequestFilter(function(type, request) {
                                                            request.allowCrossSiteCredentials = true;
                                                        });


                                                        smPlayer.configure({
                                                            streaming: {
                                                                inaccurateManifestTolerance: 0,
                                                                rebufferingGoal: 0.01,
                                                                bufferingGoal: 30,
                                                                bufferBehind: 15
                                                            },
                                                            manifest: {
                                                                dash: {
                                                                    ignoreMinBufferTime: true
                                                                },
                                                            }
                                                        });
                                                        smPlayer.load(data.resultObj.url).then(function() {
                                                            console.log('[F1TV+] Shaka-Player loaded');
                                                            var seekRange = smPlayer.seekRange();
                                                            $("#sm-popup-video").attr('data-livestart', seekRange.start);
                                                            $("#sm-popup-video").attr('data-liveend', seekRange.end);

                                                            if (smPlayer.isLive()) {
                                                                $("#sm-popup-video").attr("data-streamprotocol", "DASH-LIVE");

                                                                function waitForVideo() {
                                                                    if (document.getElementById("sm-popup-video").readyState > 1) {
                                                                        smPlayer.goToLive();
                                                                    } else {
                                                                        setTimeout(waitForVideo, 100);
                                                                    }
                                                                }
                                                                waitForVideo();

                                                                var currentSubstream = document.getElementById("sm-popup-video").dataset.name;
                                                                function liveTimeUpdate() {
                                                                    if (document.getElementById("sm-popup-video").dataset.name == currentSubstream) {
                                                                        var seekRange = smPlayer.seekRange();
                                                                        $("#sm-popup-video").attr('data-liveend', seekRange.end);
                                                                        setTimeout(liveTimeUpdate, 1000);
                                                                    }
                                                                }
                                                                liveTimeUpdate();
                                                            }

                                                            document.getElementById("sm-popup-video").play();
                                                            document.getElementById("sm-audio-tracks").innerHTML = "<div style='margin-bottom: 8px;'>Audio track</div>";
                                                            document.getElementById("sm-levels").innerHTML = "<div style='margin-bottom: 8px;'>Video quality</div>";

                                                            var smAudioTracks = [];
                                                            var smAudioTrack;
                                                            var smLevels = [];
                                                            var smLevel;
                                                            smPlayer.getVariantTracks().forEach(function(track) {
                                                                if (smAudioTracks.indexOf(track.language) === -1) {
                                                                    smAudioTracks[track.language] = track.label;
                                                                }
                                                                if (smLevels.indexOf(track.height) === -1) {
                                                                    smLevels[track.height] = track.height + "p";
                                                                }
                                                                if (track.active == true) {
                                                                    smAudioTrack = track.language;
                                                                    smLevel = track.height;
                                                                }
                                                            });


                                                            var smForceAudioTrackSwitch = false;
                                                            if (smAudioTracks[smAudioTrack] !== DEFAULT_AUDIOTRACK && smAudioTracks[smAudioTrack] !== "Team Radio") {
                                                                for (var id in smAudioTracks) {
                                                                    if (smAudioTracks[id] == DEFAULT_AUDIOTRACK) {
                                                                        console.log("[F1TV+] Changing audio track: " + smAudioTracks[smAudioTrack] + " -> " + DEFAULT_AUDIOTRACK);
                                                                        smForceAudioTrackSwitch = id;
                                                                    }
                                                                }
                                                            }

                                                            for (var id in smAudioTracks) {
                                                                document.getElementById("sm-audio-tracks").innerHTML += "<a class='sm-btn sm-btn-audiotrack' data-id='" + id + "' id='sm-btn-audiotrack-" + id + "'>" + smAudioTracks[id] + "</a><br>";
                                                            }

                                                            $("#sm-btn-audiotrack-" + smAudioTrack).addClass("sm-btn-active");
                                                            for (var id in smAudioTracks) {
                                                                document.getElementById("sm-btn-audiotrack-" + id).addEventListener("click", function() {
                                                                    smPlayer.selectAudioLanguage($(this).data("id"));
                                                                    $(".sm-btn-audiotrack").removeClass("sm-btn-active");
                                                                    $(this).addClass("sm-btn-active");
                                                                });
                                                            }

                                                            if (smForceAudioTrackSwitch !== false) {
                                                                setTimeout(function() {
                                                                    document.getElementById("sm-btn-audiotrack-" + smForceAudioTrackSwitch).click();
                                                                }, 1000);
                                                            }


                                                            document.getElementById("sm-levels").innerHTML += "<a class='sm-btn sm-btn-level sm-btn-active' data-id='-1' id='sm-btn-level--1'>Auto</a><br>";
                                                            for (var id in smLevels) {
                                                                document.getElementById("sm-levels").innerHTML += "<a class='sm-btn sm-btn-level' data-id='" + id + "' id='sm-btn-level-" + id + "'>" + smLevels[id] + "</a><br>";
                                                            }
                                                            document.getElementById("sm-btn-level--1").addEventListener("click", function() {
                                                                smPlayer.configure({
                                                                    abr: {
                                                                        enabled: true
                                                                    }
                                                                });
                                                                $(".sm-btn-level").removeClass("sm-btn-active");
                                                                $(this).addClass("sm-btn-active");
                                                            });
                                                            for (var id in smLevels) {
                                                                document.getElementById("sm-btn-level-" + id).addEventListener("click", function() {
                                                                    var targetLanguage;
                                                                    var targetHeight = $(this).data("id");
                                                                    var tracks = smPlayer.getVariantTracks();
                                                                    tracks.forEach(function(track) {
                                                                        if (track.active == true) {
                                                                            targetLanguage = track.language;
                                                                        }
                                                                    });
                                                                    tracks.forEach(function(track) {
                                                                        if (track.language == targetLanguage && track.height == targetHeight) {
                                                                            smPlayer.configure({
                                                                                abr: {
                                                                                    enabled: false
                                                                                }
                                                                            });
                                                                            smPlayer.selectVariantTrack(track, true);
                                                                        }
                                                                    });
                                                                    $(".sm-btn-level").removeClass("sm-btn-active");
                                                                    $(this).addClass("sm-btn-active");
                                                                });
                                                            }
                                                        });



                                                    } else {
                                                        console.log("[F1TV+] Streaming protocol: HLS");
                                                        $("#sm-popup-video").attr("data-streamprotocol", "HLS");
                                                        var smHls = new Hls({
                                                            xhrSetup: xhr => {
                                                                xhr.withCredentials = true;
                                                            }
                                                        });
                                                        smHls.loadSource(data.resultObj.url);
                                                        smHls.attachMedia(document.getElementById("sm-popup-video"));
                                                        smHls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                                                            smHls.subtitleDisplay = false;
                                                            document.getElementById("sm-audio-tracks").innerHTML = "<div style='margin-bottom: 8px;'>Audio track</div>";
                                                            var smAudioTracks = [];
                                                            var smAudioTrack;
                                                            data.audioTracks.forEach(function(track) {
                                                                document.getElementById("sm-audio-tracks").innerHTML += "<a class='sm-btn sm-btn-audiotrack' data-id='" + track.id + "' id='sm-btn-audiotrack-" + track.id + "'>" + track.name + "</a><br>";
                                                                smAudioTracks[track.id] = track.name;
                                                                if (track.default == true) {
                                                                    smAudioTrack = track.id;
                                                                }
                                                            });
                                                            var smForceAudioTrackSwitch = false;
                                                            if (smAudioTracks[smAudioTrack] !== DEFAULT_AUDIOTRACK && smAudioTracks[smAudioTrack] !== "Team Radio") {
                                                                for (var id in smAudioTracks) {
                                                                    if (smAudioTracks[id] == DEFAULT_AUDIOTRACK) {
                                                                        console.log("[F1TV+] Changing audio track: " + smAudioTracks[smAudioTrack] + " -> " + DEFAULT_AUDIOTRACK);
                                                                        smForceAudioTrackSwitch = id;
                                                                    }
                                                                }
                                                            }
                                                            $("#sm-btn-audiotrack-" + smAudioTrack).addClass("sm-btn-active");
                                                            for (var i in smAudioTracks) {
                                                                document.getElementById("sm-btn-audiotrack-" + i).addEventListener("click", function() {
                                                                    smHls.audioTrackController.audioTrack = ($(this).data("id"));
                                                                    $(".sm-btn-audiotrack").removeClass("sm-btn-active");
                                                                    $(this).addClass("sm-btn-active");
                                                                });
                                                            }
                                                            if (smForceAudioTrackSwitch !== false) {
                                                                setTimeout(function() {
                                                                    document.getElementById("sm-btn-audiotrack-" + smForceAudioTrackSwitch).click();
                                                                }, 1000);
                                                            }
                                                            document.getElementById("sm-levels").innerHTML = "<div style='margin-bottom: 8px;'>Video quality</div>";
                                                            var smLevels = [];
                                                            document.getElementById("sm-levels").innerHTML += "<a class='sm-btn sm-btn-level' data-id='-1' id='sm-btn-level--1'>Auto</a><br>";
                                                            smLevels[-1] = "Auto";
                                                            for (var level in smHls.levels) {
                                                                document.getElementById("sm-levels").innerHTML += "<a class='sm-btn sm-btn-level' data-id='" + level + "' id='sm-btn-level-" + level + "'>" + smHls.levels[level].height + "p</a><br>";
                                                                smLevels[level] = smHls.levels[level].height;
                                                            }
                                                            $("#sm-btn-level-" + smHls.currentLevel).addClass("sm-btn-active");
                                                            for (var smLevel in smLevels) {
                                                                document.getElementById("sm-btn-level-" + smLevel).addEventListener("click", function() {
                                                                    smHls.currentLevel = ($(this).data("id"));
                                                                    $(".sm-btn-level").removeClass("sm-btn-active");
                                                                    $(this).addClass("sm-btn-active");
                                                                });
                                                            }


                                                        });

                                                    }


                                                    $(".sm-feeds-container").hide();
                                                },
                                                error: function(data) {
                                                    if (data.responseJSON.errorDescription == "ACN_1001") { // Missing parameter Ascendon Token or Entitlement Token
                                                        window.location.href = LOGIN_PAGE;
                                                    } else {
                                                        alert("Error: Can't get stream URL...");
                                                        $(".sm-feeds-container").hide();
                                                    }
                                                }
                                            });

                                        });
                                    }
                                }
                                if (window.location.hash.split("_")[1].split("=")[0] == "play" ||
                                    window.location.hash.split("_")[1].split("=")[0].split(":")[0] == "multipopout" ||
                                    smAdditionalStreams == false) {
                                    document.getElementById("sm-btn-feeds-main_feed").click();
                                }
                                if (smAdditionalStreams == false) {
                                    document.getElementById("sm-btn-feeds").style = "display: none !important;";
                                    $("#header-btn-popout").text("POPOUT");
                                }
                            },
                            error: function() {
                                alert("Error: Can't get stream URL...");
                            }
                        });
                    }
                });
                document.getElementById("sm-btn-feeds").click();

                document.getElementById("sm-volume-slider").addEventListener("input", function(e) {
                    if (e.target.value > 0) {
                        if (document.getElementById("sm-popup-video").muted) {
                            document.getElementById("sm-popup-video").muted = false;
                            $("#sm-volume-toggle .volume-high").show();
                            $("#sm-volume-toggle .volume-muted").hide();
                        }
                        document.getElementById("sm-popup-video").volume = e.target.value / 100;
                        $("#sm-volume-slider").css("opacity", "1");
                    } else {
                        document.getElementById("sm-popup-video").muted = true;
                        $("#sm-volume-toggle .volume-high").hide();
                        $("#sm-volume-toggle .volume-muted").show();
                        document.getElementById("sm-popup-video").volume = 0;
                        $("#sm-volume-slider").css("opacity", "0.5");
                    }
                });
                document.getElementById("sm-volume-toggle").addEventListener("click", function() {
                    if (document.getElementById("sm-popup-video").muted) {
                        document.getElementById("sm-popup-video").muted = false;
                        $("#sm-volume-toggle .volume-high").show();
                        $("#sm-volume-toggle .volume-muted").hide();
                        $("#sm-volume-slider").css("opacity", "1");
                        if (document.getElementById("sm-volume-slider").value == 0) {
                            document.getElementById("sm-popup-video").volume = 1;
                            document.getElementById("sm-volume-slider").value = 100;
                        }
                    } else {
                        document.getElementById("sm-popup-video").muted = true;
                        $("#sm-volume-toggle .volume-high").hide();
                        $("#sm-volume-toggle .volume-muted").show();
                        $("#sm-volume-slider").css("opacity", "0.5");
                    }
                });

                if (window.location.hash.split("_")[1].split("=")[0] == "play" ||
                    window.location.hash.split("_")[1].split("=")[0].split(":")[0] == "multipopout") {
                    document.getElementById("sm-volume-toggle").click();
                }

                document.getElementById("sm-fullscreen-toggle").addEventListener("click", function() {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        document.getElementById("sm-popup-alt-container").requestFullscreen();
                    }
                });
                document.getElementById("sm-pause-toggle").addEventListener("click", function() {
                    if (document.getElementById("sm-popup-video").paused) {
                        document.getElementById("sm-popup-video").play();
                    } else {
                        document.getElementById("sm-popup-video").pause();
                    }
                });

                document.getElementById("sm-popup-video").ontimeupdate = function() {
                    if (document.getElementById("sm-popup-video").dataset["streamprotocol"] == "DASH-LIVE") {
                        var timeStart = parseInt(document.getElementById("sm-popup-video").dataset.livestart);
                        var timeEnd = parseInt(document.getElementById("sm-popup-video").dataset.liveend);
                        $("#sm-video-seekbar-in").css("width", (((document.getElementById("sm-popup-video").currentTime - timeStart) / (timeEnd - timeStart)) * 100) + "%");
                        document.getElementById("sm-video-seekbar-txt").innerHTML = new Date(1000 * (document.getElementById("sm-popup-video").currentTime - timeStart)).toISOString().substr(11, 8) + " / " + new Date(1000 * (timeEnd - timeStart)).toISOString().substr(11, 8);
                    } else {
                        $("#sm-video-seekbar-in").css("width", ((document.getElementById("sm-popup-video").currentTime / document.getElementById("sm-popup-video").duration) * 100) + "%");
                        document.getElementById("sm-video-seekbar-txt").innerHTML = new Date(1000 * document.getElementById("sm-popup-video").currentTime).toISOString().substr(11, 8) + " / " + new Date(1000 * document.getElementById("sm-popup-video").duration).toISOString().substr(11, 8);
                    }
                };

                $("#sm-video-seekbar").on("click", function(e) {
                    if (document.getElementById("sm-popup-video").dataset["streamprotocol"] == "DASH-LIVE") {
                        var timeStart = parseInt(document.getElementById("sm-popup-video").dataset.livestart);
                        var timeEnd = parseInt(document.getElementById("sm-popup-video").dataset.liveend);
                        document.getElementById("sm-popup-video").currentTime = timeStart + ((timeEnd - timeStart) * ((e.pageX - $(this).offset().left) / $("#sm-video-seekbar").width()));
                    } else {
                        document.getElementById("sm-popup-video").currentTime = document.getElementById("sm-popup-video").duration * ((e.pageX - $(this).offset().left) / $("#sm-video-seekbar").width());
                    }
                });

                $("#sm-video-seekbar").on("mousemove", function(e) {
                    var p = ((e.pageX - $(this).offset().left) / $("#sm-video-seekbar").width());
                    $("#sm-video-seekbar-txt").hide();
                    $("#sm-video-seekbar-txt-onhover").show();
                    $("#sm-video-seekbar-pointer-onhover").show();
                    if (document.getElementById("sm-popup-video").dataset["streamprotocol"] == "DASH-LIVE") {
                        var timeStart = parseInt(document.getElementById("sm-popup-video").dataset.livestart);
                        var timeEnd = parseInt(document.getElementById("sm-popup-video").dataset.liveend);
                        document.getElementById("sm-video-seekbar-txt-onhover").innerHTML = new Date(1000 * (timeEnd - timeStart) * p).toISOString().substr(11, 8);
                    } else {
                        document.getElementById("sm-video-seekbar-txt-onhover").innerHTML = new Date(1000 * document.getElementById("sm-popup-video").duration * p).toISOString().substr(11, 8);
                    }
                    if (p < 0.5) {
                        $("#sm-video-seekbar-txt-onhover").css("left", p * 100 + "%");
                        $("#sm-video-seekbar-txt-onhover").css("right", "auto");
                    } else {
                        $("#sm-video-seekbar-txt-onhover").css("right", (1 - p) * 100 + "%");
                        $("#sm-video-seekbar-txt-onhover").css("left", "auto");
                    }
                    $("#sm-video-seekbar-pointer-onhover").css("left", p * 100 + "%");
                });

                $("#sm-video-seekbar").on("mouseleave", function(e) {
                    $("#sm-video-seekbar-txt-onhover").hide();
                    $("#sm-video-seekbar-pointer-onhover").hide();
                    $("#sm-video-seekbar-txt").show();
                });

                document.getElementById("sm-popup-video").onpause = function() {
                    $(".sm-icon-play").show();
                    $(".sm-icon-pause").hide();
                };

                document.getElementById("sm-popup-video").onplay = function() {
                    $(".sm-icon-pause").show();
                    $(".sm-icon-play").hide();
                };

                var mouseMoveTimeout;
                var mouseMoveTimeoutState;
                $("#sm-popup-alt-container").on("mousemove", function(e) {
                    if (mouseMoveTimeoutState !== 1) {
                        $(".sm-autohide").addClass("shown");
                        $("#sm-popup-alt-container").css('cursor', '');
                    }
                    clearTimeout(mouseMoveTimeout);
                    mouseMoveTimeoutState = 1;
                    mouseMoveTimeout = setTimeout(function() {
                        mouseMoveTimeoutState = 0;
                        $(".sm-autohide").removeClass("shown");
                        $("#sm-popup-alt-container").css('cursor', 'none');
                    }, 3000);
                });

                $("#sm-popup-video").dblclick(function() {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        document.getElementById("sm-popup-alt-container").requestFullscreen();
                    }
                });

                document.addEventListener("keydown", function(event) {
                    const key = event.key;
                    switch (key) {
                        case "ArrowLeft":
                            document.getElementById("sm-popup-video").currentTime += -5 * document.getElementById("sm-popup-video").playbackRate;
                            break;
                        case "ArrowRight":
                            document.getElementById("sm-popup-video").currentTime += 5 * document.getElementById("sm-popup-video").playbackRate;
                            break;
                        case " ": //space
                            document.getElementById("sm-pause-toggle").click();
                            break;
                    }
                });

                if (window.location.hash.split("_")[1].split(":")[0] == "multipopout") {
                    if (window.location.hash.split("_")[1].split("=")[0].split(":")[2] == "onewindow") {
                        var oneWindow = true;
                        var oneWindowAr = window.location.hash.split("_")[1].split("=")[0].split(":")[3];
                        if (oneWindowAr == "16by9") {
                            smPopupPositions = smFramePositions16by9;
                        } else if (oneWindowAr == "21by9") {
                            smPopupPositions = smFramePositions21by9;
                        }
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
                    }

                    var smWindowAmount = parseInt(window.location.hash.split("_")[1].split(":")[1]);

                    document.getElementById("sm-popup-id").innerHTML = 1;
                    document.title = "(#1)";
                    var smSettingsFrameHtml = "<div id='sm-offset-settings-btn' class='sm-autohide' style='background-color: #000000aa; color: #fff; font-size: 12px; padding: 8px 16px; border-radius: 0px 0px 20px 20px; position: fixed; top: 0; left: 5%; cursor: pointer;'>SYNC MENU</div>" +
                        "<div id='sm-offset-settings' style='padding: 10px; position: fixed; top: 0; left: 0; background-color: #000; border-radius: 0px 0px 20px; display: none;'>" +
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
                        "</style>";

                    var smWindow = [];

                    document.getElementById("sm-popup-alt-container").insertAdjacentHTML("beforeend", smSettingsFrameHtml);

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

                    if (oneWindow) {
                        $("#sm-popup-alt-container").css("position", "absolute");
                        $("#sm-popup-alt-container").css("left", smPopupPositions[smWindowAmount][0][0] + "%");
                        $("#sm-popup-alt-container").css("top", smPopupPositions[smWindowAmount][0][1] + "%");
                        $("#sm-popup-alt-container").css("width", smPopupPositions[smWindowAmount][0][2] + "%");
                        $("#sm-popup-alt-container").css("height", smPopupPositions[smWindowAmount][0][3] + "%");
                    }

                    smWindow[1] = window;

                    if (oneWindow) {
                        for (let i = 2; i <= smWindowAmount; i++) {
                            var smWindowOffsetX = smPopupPositions[smWindowAmount][i - 1][0];
                            var smWindowOffsetY = smPopupPositions[smWindowAmount][i - 1][1];
                            var smWindowWidth = smPopupPositions[smWindowAmount][i - 1][2];
                            var smWindowHeight = smPopupPositions[smWindowAmount][i - 1][3];
                            var frameHtml = '<iframe id="sm-frame-' + i + '" style="position: absolute; border: 0; left: ' + smWindowOffsetX + '%; top: ' + smWindowOffsetY + '%; width: ' + smWindowWidth + '%; height: ' + smWindowHeight + '%;" src="' + document.location.href.split("_multipopout")[0] + "_popout=" + window.location.hash.split("_")[1].split("=")[1] + '"></iframe>';
                            document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", frameHtml);
                            smWindow[i] = document.getElementById("sm-frame-" + i).contentWindow;

                            smWindow[i].addEventListener('load', (event) => {
                                setTimeout(function() {
                                    if (i > 1) {
                                        smWindow[i].document.getElementById("sm-video-primary-controls").style.display = "none";
                                        smWindow[i].document.getElementById("sm-video-titlebar").style.display = "inline-block";
                                    }
                                    smWindow[i].document.title = "(#" + i + ") " + smWindow[i].document.getElementById("sm-video-title").innerHTML;
                                    smWindow[i].document.getElementById("sm-popup-id").innerHTML = i;
                                }, 500);
                            });
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
                                setTimeout(function() {
                                    if (i > 1) {
                                        smWindow[i].document.getElementById("sm-video-primary-controls").style.display = "none";
                                        smWindow[i].document.getElementById("sm-video-titlebar").style.display = "inline-block";
                                    }
                                    smWindow[i].document.title = "(#" + i + ") " + smWindow[i].document.getElementById("sm-video-title").innerHTML;
                                    smWindow[i].document.getElementById("sm-popup-id").innerHTML = i;
                                }, 500);


                            });
                        }
                    }

                    function smPauseAll() {
                        for (let i = 1; i <= smWindowAmount; i++) {
                            smWindow[i].document.getElementById("sm-popup-video").pause();
                        }
                    }

                    function smResumeAllWhenReady() {
                        var smReadyCheck = setInterval(function() {
                            var smNotReady = 0;

                            for (let i = 1; i <= smWindowAmount; i++) {
                                if (smWindow[i].document.getElementById("sm-popup-video").readyState != 4) {
                                    smNotReady += 1;
                                }
                            }
                            if (smNotReady == 0) {
                                for (let i = 1; i <= smWindowAmount; i++) {
                                    smWindow[i].document.getElementById("sm-popup-video").play();
                                }
                                document.getElementById("sm-sync-status-text").innerHTML = "";
                                clearInterval(smReadyCheck);
                            }
                        }, 100);
                    }

                    function smSync() {
                        var time = [];
                        var offset = [];
                        var timeDiff = [];
                        var smSynced = 0;

                        for (let i = 1; i <= smWindowAmount; i++) {
                            if (smWindow[i].document.getElementById("sm-popup-video").readyState == 0) {
                                return;
                            }
                        }

                        if (smWindow[1].document.getElementById("sm-popup-video").paused) {

                            for (let i = 2; i <= smWindowAmount; i++) {
                                if (smWindow[i].document.getElementById("sm-popup-video").paused != true) {
                                    smWindow[i].document.getElementById("sm-popup-video").pause();
                                }
                            }
                            return;
                        }

                        for (let i = 2; i <= smWindowAmount; i++) {
                            if (smWindow[i].document.getElementById("sm-popup-video").playbackRate !== smWindow[1].document.getElementById("sm-popup-video").playbackRate) {
                                smWindow[i].document.getElementById("sm-popup-video").playbackRate = smWindow[1].document.getElementById("sm-popup-video").playbackRate;
                            }
                        }

                        for (let i = 1; i <= smWindowAmount; i++) {
                            offset[i] = parseInt(document.getElementById("sm-offset-" + i).value) / 1000 || 0;
                            var streamId = smWindow[i].document.getElementById("sm-popup-video").dataset.streamid;
                            var name = smWindow[i].document.getElementById("sm-popup-video").dataset.name;
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
                            if (document.getElementById("sm-popup-video").dataset["streamprotocol"] == "DASH-LIVE") {
                                var timeStart = parseInt(smWindow[i].document.getElementById("sm-popup-video").dataset["livestart"]);
                                time[i] = smWindow[i].document.getElementById("sm-popup-video").currentTime - timeStart - offset[i];
                            } else {
                                time[i] = smWindow[i].document.getElementById("sm-popup-video").currentTime - offset[i];
                            }
                        }

                        for (let i = 2; i <= smWindowAmount; i++) {
                            timeDiff[i] = Math.abs(time[1] - time[i]);
                            document.getElementById("sm-sync-status-" + i).innerHTML = Math.floor(timeDiff[i] * 1000) + " ms";
                        }

                        for (let i = 2; i <= smWindowAmount; i++) {
                            timeDiff[i] = Math.abs(time[1] - time[i]);
                            if (timeDiff[i] > maxDesync) {
                                smPauseAll();
                                if (document.getElementById("sm-popup-video").dataset["streamprotocol"] == "DASH-LIVE") {
                                    var timeStart = parseInt(smWindow[i].document.getElementById("sm-popup-video").dataset["livestart"]);
                                    smWindow[i].document.getElementById("sm-popup-video").currentTime = timeStart + time[1] + offset[i];
                                } else {
                                    smWindow[i].document.getElementById("sm-popup-video").currentTime = time[1] + offset[i];
                                }
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
        }

    } else {
        /*
        if (window.location.href.includes("detail/")) {
            window.location.href = "https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_play=" + window.location.href.split("detail/")[1].split("/")[0];
        }
        */

        var oldHref = document.location.href;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    if (window.location.href.includes("detail/")) {
                        var smLoadingHtml = "<div id='sm-update' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center; background-color: #000;'>" +
                            "<div style='color: #ccc; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                            "<h3>F1TV+</h3>" +
                            "<p>Loading video...</p>" +
                            "</div>" +
                            "</div>";
                        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smLoadingHtml);
                        window.history.back();
                        window.location.href = "https://" + document.location.href.split("/")[2] + smURL_EMPTYPAGE + "#f1tvplus_play=" + window.location.href.split("detail/")[1].split("/")[0];
                    }
                }
            });
        });
        observer.observe(document.querySelector("body"), {
            childList: true,
            subtree: true
        });

    }

})();
