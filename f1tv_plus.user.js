// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.me/
// @version      1.0.8
// @description  A few improvements to F1TV
// @author       Mateusz Najdek
// @match        https://f1tv.formula1.com/*
// @grant        GM.xmlHttpRequest
// @connect      raw.githubusercontent.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/hls.js@0.14.17/dist/hls.min.js
// ==/UserScript==
(function() {
    'use strict';

    var smVersion = "1.0.8";
    //<updateDescription>Update details:<br>-popout (alt)/multi-popout: Added playback speed control</updateDescription>

    var smUpdateUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/main/f1tv_plus.user.js";
    var smSyncDataUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/main/sync_offsets.json";


    //// SETTINGS FOR MULTI-POPOUT MODE ////
    var BROWSER_USED_HEIGHT = 70; // height [px] of window that is used by browser/system (title bar, url bar, etc) | Default value: 70
    var BROWSER_USED_WIDTH = 9; // width [px] of window that is used by browser/system | Default value: 9
    // settings above are browser and OS dependent. If values are too small, windows will overlap. If too high, there will be gaps between windows.

    var smPopupPositions = [
        [],
        [],
        // offset X %, offset Y %, width %, height %
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



    if (window.location.hash == "#sm-popup") {

        var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
            "</div>" +
            "<style>" +
            "body {overflow: hidden;}" +
            ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; background-color: #000;}" +
            ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
            ".inset-video-item-play-action-container {width: 100%;}" +
            "</style>";
        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);

    } else if ((window.location.hash == "#sm-popup-alt") || (window.location.hash.includes("#sm-popups-alt-"))) {

        var smPopupAltHtml = "<div id='sm-popup-alt-container' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<div id='sm-popup-id' style='display: none;'>0</div>" +
            "<div style='position: absolute; top: 50%; width: 100%; text-align: center; transform: translateY(-50%); font-weight: bold; font-size: 90px; color: #ccc;'>F1TV+</div>" +
            "<video id='sm-popup-video' muted style='position: fixed; top: 0; left: 0; height: 100%; width: 100%;'></video>" +
            "<div id='sm-top-hover' style='position: absolute; top: 0; left: 0; height: 20%; width: 100%;'></div>" +
            "<div id='sm-audio-tracks-container' onclick='document.getElementById(&apos;sm-audio-tracks-container&apos;).style.display = &apos;none&apos;' style='display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
            "<div id='sm-audio-tracks' style='position: fixed; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 180px; bottom: 40px;'></div>" +
            "</div>" +
            "<div id='sm-levels-container' onclick='document.getElementById(&apos;sm-levels-container&apos;).style.display = &apos;none&apos;' style='display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
            "<div id='sm-levels' style='position: fixed; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 215px; bottom: 40px;'></div>" +
            "</div>" +
            "<div id='sm-speeds-container' onclick='document.getElementById(&apos;sm-speeds-container&apos;).style.display = &apos;none&apos;' style='display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index: 2;'>" +
            "<div id='sm-speeds' style='position: fixed; background-color: #000; color: #fff; text-align: center; padding: 20px; border-radius: 20px; right: 250px; bottom: 40px;'></div>" +
            "</div>" +
            "<div id='sm-video-menu-container' style='position: absolute; bottom: 0; height: 20%; width: 100%;'>" +
            "<div id='sm-video-menu' style='display: none; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background-color: #000;'>" +
            "<div id='sm-video-titlebar' style='display: none; cursor: default; width: 100%; height: 40px; background-color: black;'><div id='sm-video-titlebar-txt' style='position: absolute; color: #fff; width: 100%; text-align: left; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 16px; line-height: 40px;'><span id='sm-video-title' style='margin-left: 20px;'></span><span class='sm-hide-from-900px' style='margin-left: 40px; color: #bbb;'>Use Window #1 to control all feeds.</span></div></div>" +
            "<div id='sm-video-primary-controls'>" +
            "<div id='sm-pause-toggle' style='display: inline-block; cursor: pointer; height: 40px;'>" +
            "<svg class='sm-icon-pause' style='display: none; height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M14 19h4V5h-4M6 19h4V5H6v14z' fill='#ffffff'/></svg>" +
            "<svg class='sm-icon-play' style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M8 5.14v14l11-7l-11-7z' fill='#ffffff'/></svg>" +
            "</div>" +
            "<div style='display: inline-block; position: relative; width: calc(100% - 390px); bottom: 0; left: 0;'>" +
            "<div id='sm-video-seekbar' style='display: inline-block; cursor: pointer; width: 100%; height: 40px; background-color: black;'>" +
            "<div id='sm-video-seekbar-in' style='background-color: #b10000; width: 0%; height: 100%;'></div>" +
            "<div id='sm-video-seekbar-txt' style='position: absolute; color: #fff; width: 100%; text-align: center; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 16px; line-height: 40px;'></div>" +
            "<div id='sm-video-seekbar-txt-onhover' style='display: none; padding: 0 20px; position: absolute; color: #fff; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 16px; line-height: 40px;'></div>" +
            "<div id='sm-video-seekbar-pointer-onhover' style='display: none; position: absolute; height: 100%; width: 1px; top: 0; background-color: #fff;'></div>" +
            "</div>" +
            "</div>" +
            "<div id='sm-speed-change' onclick='document.getElementById(&apos;sm-speeds-container&apos;).style.display = &apos;block&apos;' style='display: inline-block; cursor: pointer; height: 40px;'>" +
            "<svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z' fill='#ffffff'/></svg>" +
            "</div>" +
            "</div>" +
            "<div style='position: absolute; bottom: 0; right: 0; height: 40px;'>" +
            "<div id='sm-level-change' onclick='document.getElementById(&apos;sm-levels-container&apos;).style.display = &apos;block&apos;' style='display: inline-block; cursor: pointer; height: 40px; margin-right: 8px;'>" +
            "<svg style='height: 32px; width: 32px; margin: 4px;' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' focusable='false' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z' fill='#ffffff'/></svg>" +
            "</div>" +
            "<div id='sm-audiotrack-change' onclick='document.getElementById(&apos;sm-audio-tracks-container&apos;).style.display = &apos;block&apos;' style='display: inline-block; cursor: pointer; height: 40px; margin-right: 8px;'>" +
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
            "</div>" +
            "<a id='sm-btn-url' role='button' class='sm-btn' style='display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); background-color: #000000aa; width: 40px; height: 30px; line-height: 20px; text-align: center; border-radius: 0px 0px 20px 20px;'>" +
            "<span style='border: solid #fff; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(45deg);'></span>" +
            "<style>" +
            "body { font-family: Arial; }" +
            "#sm-top-hover:hover ~ #sm-btn-url, #sm-btn-url:hover { display: block !important; }" +
            ".sm-btn { display: inline-block; cursor: pointer; border-radius: 4px; }" +
            ".sm-btn-audiotrack, .sm-btn-level, .sm-btn-speed { background-color: #333; color: #fff; font-size: 12px; width: 100%; margin: 2px 0; padding: 8px 0; position: relative; } " +
            ".sm-btn-speed { padding: 6px 0; }" +
            ".sm-btn-active { background-color: #b10000; }" +
            "#sm-video-menu-container:hover #sm-video-menu { display: block !important; }" +
            "@media screen and (max-width: 900px) { .sm-hide-from-900px { display: none; } }" +
            "</style>" +
            "</div>";
        document.getElementsByTagName("html")[0].innerHTML = smPopupAltHtml;

        document.getElementById("sm-btn-url").addEventListener("click", function() {
            var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
            //var smUrl_ascendon_token = JSON.parse(decodeURIComponent(document.cookie.match('(^|;)\\s*login-session\\s*=\\s*([^;]+)')?.pop() || '')).data.subscriptionToken;
            var smUrl_contentId = "not_video";
            if (window.location.href.includes("detail/")) {
                smUrl_contentId = window.location.href.split("detail/")[1].split("/")[0];
            }
            if (smUrl_contentId == "not_video") {
                alert("Error: No video on this page...");
            } else {
                var smHtml = "<div class='sm-urls-container' style='position: fixed; z-index: 1002; top: 0; left: 0;'>" +
                    "<div onclick='document.getElementsByClassName(&apos;sm-urls-container&apos;)[0].outerHTML = &apos;&apos;' style='position: fixed; z-index: 1002; top: 0; left: 0; height: 100%; width: 100%;'></div>" +
                    "<div style='position: fixed; text-align: center; background-color: #000; z-index: 1003; width: 96%; left: 2%; border-radius: 0px 0px 20px 20px;'>" +
                    "<div class='sm-urls-main'></div>" +
                    "<div class='sm-urls'></div>" +
                    "</div>" +
                    "</div>";
                document.getElementById("sm-popup-alt-container").insertAdjacentHTML("beforeend", smHtml);
                var smUrl_array = [];
                var smUrlColor_array = [];
                var smUrlTeam_array = [];
                var smAdditionalStreams = true;
                smUrl_array["main_feed"] = "https://f1tv.formula1.com/1.0/R/ENG/WEB_HLS/ALL/CONTENT/PLAY?contentId=" + smUrl_contentId;
                smUrlTeam_array["-"] = [];
                smUrlTeam_array["-"]["main_feed"] = "MAIN FEED";
                $.ajax({
                    url: "https://f1tv.formula1.com/2.0/R/ENG/WEB_DASH/ALL/CONTENT/VIDEO/" + smUrl_contentId + "/F1_TV_Pro_Annual/2",
                    type: 'get',
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        if (data.resultObj.containers[0].metadata.additionalStreams) {
                            data.resultObj.containers[0].metadata.additionalStreams.forEach(function(d) {
                                smUrl_array[d.title.replace(/\s+/g, '_').toLowerCase()] = "https://f1tv.formula1.com/1.0/R/ENG/WEB_HLS/ALL/" + d.playbackUrl;
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
                                var smBtnHtml = "<a id='sm-btn-url-" + title + "' title='" + team[title] + "' role='button' class='sm-btn' data-streamid='" + smUrl_contentId + "' data-name='" + title + "' data-fullname='" + team[title] + "' data-url='" + url + "' style='border-bottom: 4px solid " + color + "; background-color: #333; color: #fff; font-size: 12px; margin: 8px; padding: 8px 16px; position: relative;'>" +
                                    "<span>" + title.replace(/_+/g, ' ').toUpperCase() + "</span></a>";
                                document.getElementsByClassName(smUrlElement)[0].insertAdjacentHTML("beforeend", smBtnHtml);
                                document.getElementById("sm-btn-url-" + title).addEventListener("click", function() {
                                    var name = $(this).data("name");
                                    var fullname = $(this).data("fullname");
                                    var streamId = $(this).data("streamid");
                                    $.ajax({
                                        url: $(this).data("url"),
                                        type: 'get',
                                        dataType: 'json',
                                        headers: {
                                            //"ascendontoken": smUrl_ascendon_token,
                                            "entitlementtoken": smUrl_entitlement_token
                                        },
                                        async: true,
                                        success: function(data) {
                                            var oldTime = document.getElementById("sm-popup-video").currentTime;
                                            var smHls = new Hls();
                                            smHls.loadSource(data.resultObj.url);
                                            smHls.attachMedia(document.getElementById("sm-popup-video"));
                                            smHls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                                                smHls.subtitleDisplay = false;
                                                document.getElementById("sm-audio-tracks").innerHTML = "<div style='margin-bottom: 8px;'>Audio track</div>";
                                                var smAudioTracks = [];
                                                smHls.audioTracks.forEach(function(track) {
                                                    document.getElementById("sm-audio-tracks").innerHTML += "<a class='sm-btn sm-btn-audiotrack' data-id='" + track.id + "' id='sm-btn-audiotrack-" + track.id + "'>" + track.name + "</a><br>";
                                                    smAudioTracks[track.id] = track.name;
                                                });
                                                $("#sm-btn-audiotrack-" + smHls.audioTrack).addClass("sm-btn-active");
                                                for (var i in smAudioTracks) {
                                                    document.getElementById("sm-btn-audiotrack-" + i).addEventListener("click", function() {
                                                        smHls.audioTrack = ($(this).data("id"));
                                                        $(".sm-btn-audiotrack").removeClass("sm-btn-active");
                                                        $(this).addClass("sm-btn-active");
                                                    });
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

                                            });
                                            $("#sm-popup-video").attr('data-name', name);
                                            $("#sm-popup-video").attr('data-streamid', streamId);
                                            document.getElementById("sm-popup-video").currentTime = oldTime;
                                            document.getElementById("sm-popup-video").play();

                                            document.getElementsByClassName("sm-urls-container")[0].outerHTML = "";
                                        },
                                        error: function() {
                                            alert("Error: Can't get stream URL...");
                                            document.getElementsByClassName("sm-urls-container")[0].outerHTML = "";
                                        }
                                    });

                                });
                            }
                        }
                        if (smAdditionalStreams == false) {
                            document.getElementById("sm-btn-url-main_feed").click();
                            document.getElementById("sm-btn-url").style = "display: none !important;";
                        }
                        console.log(smUrl_array);
                    },
                    error: function() {
                        alert("Error: Can't get stream URL...");
                    }
                });

            }
        });
        document.getElementById("sm-btn-url").click();

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
        document.getElementById("sm-fullscreen-toggle").addEventListener("click", function() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
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
            $("#sm-video-seekbar-in").css("width", ((document.getElementById("sm-popup-video").currentTime / document.getElementById("sm-popup-video").duration) * 100) + "%");
            document.getElementById("sm-video-seekbar-txt").innerHTML = new Date(1000 * document.getElementById("sm-popup-video").currentTime).toISOString().substr(11, 8) + " / " + new Date(1000 * document.getElementById("sm-popup-video").duration).toISOString().substr(11, 8);
        };

        $("#sm-video-seekbar").on("click", function(e) {
            document.getElementById("sm-popup-video").currentTime = document.getElementById("sm-popup-video").duration * ((e.pageX - $(this).offset().left) / $("#sm-video-seekbar").width());
        });

        $("#sm-video-seekbar").on("mousemove", function(e) {
            var p = ((e.pageX - $(this).offset().left) / $("#sm-video-seekbar").width());
            $("#sm-video-seekbar-txt").hide();
            $("#sm-video-seekbar-txt-onhover").show();
            $("#sm-video-seekbar-pointer-onhover").show();
            document.getElementById("sm-video-seekbar-txt-onhover").innerHTML = new Date(1000 * document.getElementById("sm-popup-video").duration * p).toISOString().substr(11, 8);
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

        document.addEventListener("keydown", function(event) {
            const key = event.key;
            switch (key) {
                case "ArrowLeft":
                    document.getElementById("sm-popup-video").currentTime += -5;
                    break;
                case "ArrowRight":
                    document.getElementById("sm-popup-video").currentTime += 5;
                    break;
                case " ": //space
                    document.getElementById("sm-pause-toggle").click();
                    break;
            }
        });


        if (window.location.hash.includes("#sm-popups-alt-")) {

            var smWindowAmount = parseInt(window.location.hash.split("#sm-popups-alt-")[1]);

            var smSettingsFrameHtml = "<div id='sm-offset-settings-btn' onclick='document.getElementById(&apos;sm-offset-settings&apos;).style.display = &apos;block&apos;' style='background-color: #000000aa; color: #fff; font-size: 12px; padding: 8px 16px; border-radius: 0px 0px 20px 20px; position: fixed; top: 0; left: 5%; cursor: pointer;'>SYNC MENU</div>" +
                "<div id='sm-offset-settings' style='padding: 10px; position: fixed; top: 0; left: 0; background-color: #000; border-radius: 0px 0px 20px; display: none;'>" +
                "<div style='text-align: right; font-size: 20px; cursor: pointer;' onclick='document.getElementById(&apos;sm-offset-settings&apos;).style.display = &apos;none&apos;'>[x]</div>" +
                "<div id='sm-offset-settings-msg-top' style='padding: 10px; margin: 10px 0px; border-radius: 10px; font-size: 14px; background-color: #ffef5b; color: #000;'></div>" +
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
                "#sm-offset-settings-btn { display: none; }" +
                "#sm-top-hover:hover ~ #sm-offset-settings-btn, #sm-offset-settings-btn:hover { display: block !important; }" +
                "</style>";

            var smWindow = [];

            document.getElementById("sm-popup-alt-container").insertAdjacentHTML("beforeend", smSettingsFrameHtml);

            var smSyncData;
            GM.xmlHttpRequest({
                method: "GET",
                url: smSyncDataUrl,
                onload: function(response) {
                    smSyncData = JSON.parse(response.responseText);
                    if (Object.keys(smSyncData.videos).length > 0) {
                        console.log("F1TV+: Loaded sync offsets for " + Object.keys(smSyncData.videos).length + " videos!");
                        if (smSyncData.videos[window.location.href.split("detail/")[1].split("/")[0]]) {
                            console.log("F1TV+: Found sync offsets for current video!");
                            document.getElementById("sm-offset-settings-msg-top").innerHTML = "Loaded offsets for this video from F1TV+ database!<br>All feeds should be perfectly synchronized!";
                        }
                    } else {
                        console.log("F1TV+: Error loading sync offsets");
                    }
                }
            });



            smWindow[1] = window;
            for (let i = 1; i <= smWindowAmount; i++) {
                if (i > 1) {
                    var smWindowOffsetX = Math.round(smPopupPositions[smWindowAmount][i - 1][0] * screen.availWidth / 100);
                    var smWindowOffsetY = Math.round(smPopupPositions[smWindowAmount][i - 1][1] * screen.availHeight / 100);
                    var smWindowWidth = Math.round(smPopupPositions[smWindowAmount][i - 1][2] * screen.availWidth / 100) - BROWSER_USED_WIDTH;
                    var smWindowHeight = Math.round(smPopupPositions[smWindowAmount][i - 1][3] * screen.availHeight / 100) - BROWSER_USED_HEIGHT;
                    console.log("left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                    smWindow[i] = window.open(document.location.href.split("#")[0].replace("action=play", "") + "#sm-popup-alt", Date.now(), "left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                }
                smWindow[i].addEventListener('load', (event) => {
                    // dirty fix to keep new window names
                    for (let n = 0; n < 30; n++) {
                        setTimeout(function() {
                            if (i > 1) {
                                smWindow[i].document.getElementById("sm-video-primary-controls").style.display = "none";
                                smWindow[i].document.getElementById("sm-video-titlebar").style.display = "inline-block";
                            }
                            smWindow[i].document.title = "(#" + i + ") " + smWindow[i].document.getElementById("sm-video-title").innerHTML;
                            smWindow[i].document.getElementById("sm-popup-id").innerHTML = i;
                        }, 1000 * n);
                    }
                });
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
                    time[i] = smWindow[i].document.getElementById("sm-popup-video").currentTime - offset[i];
                }

                for (let i = 2; i <= smWindowAmount; i++) {
                    timeDiff[i] = Math.abs(time[1] - time[i]);
                    document.getElementById("sm-sync-status-" + i).innerHTML = Math.floor(timeDiff[i] * 1000) + " ms";
                }


                for (let i = 2; i <= smWindowAmount; i++) {
                    timeDiff[i] = Math.abs(time[1] - time[i]);
                    if (timeDiff[i] > maxDesync) {
                        smPauseAll();
                        smWindow[i].document.getElementById("sm-popup-video").currentTime = time[1] + offset[i];
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



    } else {

        function smLoad() {


            GM.xmlHttpRequest({
                method: "GET",
                url: smUpdateUrl,
                onload: function(response) {
                    var smNewVersion = response.responseText.split("@version")[1].split("\n")[0].replace(/\s/g, "");
                    var smNewVersionDesc = response.responseText.split("<updateDescription>")[1].split("</updateDescription>")[0];
                    if (smNewVersion != smVersion) {
                        var smUpdateHtml = "<div id='sm-update' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; text-align: center;'>" +
                            "<div style='background-color: #0000008f; width: 100%; height: 100%; top: 0; left: 0; position: absolute;' onclick='document.getElementById(&apos;sm-update&apos;).outerHTML = &apos;&apos;'></div>" +
                            "<div style='background-color: #c70000; color: #fff; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px; position: absolute;'>" +
                            "<h3>F1TV+ update is available!</h3>" +
                            "<p>Installed version: " + smVersion + "<br>" +
                            "New version: " + smNewVersion + "</p>" +
                            "<p>" + smNewVersionDesc + "</p>" +
                            "<a href='" + smUpdateUrl + "' target='_blank' style='color: #ff0;'>[Click here to get new version]</a>" +
                            "</div>" +
                            "</div>";
                        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smUpdateHtml);
                    }
                }
            });


            var smBtnHtml = "<div id='sm-menu' style='display: none;'>" +
                "<a id='sm-btn-url' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Get stream URL'>" +
                "<span style='display: inline-block; font-size: 12px;'>URL</span></a>" +
                "<a id='sm-btn-popup' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT</span></a>" +
                "<a id='sm-btn-popup-alt' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout (alternative mode)'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT (ALT)</span></a>" +
                "<a id='sm-btn-popups-alt' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open multiple synchronized popout videos'>" +
                "<span style='display: inline-block; font-size: 12px;'>MULTI-POPOUT</span></a>" +
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
                "#sm-btn-url { margin-left: 60px !important; }" +
                "}" +
                "</style>";
            document.getElementsByClassName("global-header-nav")[0].insertAdjacentHTML("beforeend", smBtnHtml);

            var smFooterHtml = "<div style='width: 100%; background-color: #18485f; font-size: 16px; color: #fff; padding: 20px; margin-top: 20px; text-align: center;'>" +
                "F1TV+ v" + smVersion + "<a style='margin-left: 20px; color: #d3dfff;' href='https://github.com/najdek/f1tv_plus' target='_blank'>" +
                "<svg style='padding: 4px 0px 6px 0px;' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>" +
                "Source code</a> <a style='color: #ff6643; margin-left: 20px;' href='https://github.com/najdek/f1tv_plus/blob/main/DONATE.md' target='_blank'>❤ Donate</a>" +
                "</div>" +
                "<style> .full-footer { padding-bottom: 0 !important; } </style>";
            document.getElementsByClassName("full-footer")[0].insertAdjacentHTML("beforeend", smFooterHtml);


            document.getElementById("sm-btn-url").addEventListener("click", function() {
                var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
                //var smUrl_ascendon_token = JSON.parse(decodeURIComponent(document.cookie.match('(^|;)\\s*login-session\\s*=\\s*([^;]+)')?.pop() || '')).data.subscriptionToken;
                var smUrl_contentId = "not_video";
                if (window.location.href.includes("detail/")) {
                    smUrl_contentId = window.location.href.split("detail/")[1].split("/")[0];
                }
                if (smUrl_contentId == "not_video") {
                    alert("Error: No video on this page...");
                } else {
                    var smHtml = "<div class='sm-urls-container' style='position: fixed; z-index: 1002; top: 0; left: 0;'>" +
                        "<div onclick='document.getElementsByClassName(&apos;sm-urls-container&apos;)[0].outerHTML = &apos;&apos;' style='position: fixed; background-color: #00000077; z-index: 1002; top: 0; left: 0; height: 100%; width: 100%;'></div>" +
                        "<div style='position: fixed; text-align: center; background-color: #000; z-index: 1003; width: 100%;'>" +
                        "<div class='sm-urls-main'></div>" +
                        "<div class='sm-urls'></div>" +
                        "</div>" +
                        "</div>";
                    document.getElementsByClassName("vod-detail-page")[0].insertAdjacentHTML("beforeend", smHtml);
                    var smUrl_array = [];
                    var smUrlColor_array = [];
                    var smUrlTeam_array = [];
                    var smAdditionalStreams = true;
                    smUrlTeam_array["-"] = [];
                    smUrlTeam_array["-"]["main_feed"] = "MAIN FEED";
                    smUrl_array["main_feed"] = "https://f1tv.formula1.com/1.0/R/ENG/WEB_HLS/ALL/CONTENT/PLAY?contentId=" + smUrl_contentId;
                    $.ajax({
                        url: "https://f1tv.formula1.com/2.0/R/ENG/WEB_DASH/ALL/CONTENT/VIDEO/" + smUrl_contentId + "/F1_TV_Pro_Annual/2",
                        type: 'get',
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            if (data.resultObj.containers[0].metadata.additionalStreams) {
                                data.resultObj.containers[0].metadata.additionalStreams.forEach(function(d) {
                                    smUrl_array[d.title.replace(/\s+/g, '_').toLowerCase()] = "https://f1tv.formula1.com/1.0/R/ENG/WEB_HLS/ALL/" + d.playbackUrl;
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
                                    var smBtnHtml = "<a id='sm-btn-url-" + title + "' title='" + team[title] + "' role='button' class='btn' data-url='" + url + "' style='border-bottom: 4px solid " + color + "; background-color: #333; color: #fff; font-size: 12px; margin: 8px; padding: 8px 16px; position: relative;'>" +
                                        "<span>" + title.replace(/_+/g, ' ').toUpperCase() + "</span></a>";
                                    document.getElementsByClassName(smUrlElement)[0].insertAdjacentHTML("beforeend", smBtnHtml);
                                    document.getElementById("sm-btn-url-" + title).addEventListener("click", function() {

                                        $.ajax({
                                            url: $(this).data("url"),
                                            type: 'get',
                                            dataType: 'json',
                                            headers: {
                                                //"ascendontoken": smUrl_ascendon_token,
                                                "entitlementtoken": smUrl_entitlement_token
                                            },
                                            async: true,
                                            success: function(data) {
                                                prompt("Stream URL: ", data.resultObj.url);
                                                document.getElementsByClassName("sm-urls-container")[0].outerHTML = "";
                                            },
                                            error: function() {
                                                alert("Error: Can't get stream URL...");
                                                document.getElementsByClassName("sm-urls-container")[0].outerHTML = "";
                                            }
                                        });

                                    });
                                }
                            }
                            if (smAdditionalStreams == false) {
                                document.getElementById("sm-btn-url-main_feed").click();
                            }
                            console.log(smUrl_array);
                        },
                        error: function() {
                            alert("Error: Can't get stream URL...");
                        }
                    });

                }
            });

            document.getElementById("sm-btn-popup").addEventListener("click", function() {
                window.open(document.location.href.replace("action=play", "") + "#sm-popup", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-popup-alt").addEventListener("click", function() {
                window.open(document.location.href.replace("action=play", "") + "#sm-popup-alt", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-popups-alt").addEventListener("click", function() {
                var smWindowAmountInput = prompt("How many windows [2-10]?", "2");
                smWindowAmountInput = parseInt(smWindowAmountInput);
                if ((smWindowAmountInput >= 2) && (smWindowAmountInput <= 10)) {
                    var smWindowOffsetX = Math.round(smPopupPositions[smWindowAmountInput][0][0] * screen.availWidth / 100);
                    var smWindowOffsetY = Math.round(smPopupPositions[smWindowAmountInput][0][1] * screen.availHeight / 100);
                    var smWindowWidth = Math.round(smPopupPositions[smWindowAmountInput][0][2] * screen.availWidth / 100) - BROWSER_USED_WIDTH;
                    var smWindowHeight = Math.round(smPopupPositions[smWindowAmountInput][0][3] * screen.availHeight / 100) - BROWSER_USED_HEIGHT;
                    console.log("left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                    window.open(document.location.href.split("#")[0].replace("action=play", "") + "#sm-popups-alt-" + smWindowAmountInput, Date.now(), "left=" + smWindowOffsetX + ",top=" + smWindowOffsetY + ",width=" + smWindowWidth + ",height=" + smWindowHeight);
                    $("video").trigger("pause");
                } else {
                    alert("error: wrong input");
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
