// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.me/
// @version      3.0
// @description  A few improvements to F1TV
// @author       Mateusz Najdek
// @match        https://f1tv.formula1.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/hls.js@0.14.17/dist/hls.min.js
// ==/UserScript==
(function() {
    'use strict';
    var smVersion = "3.0";

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

    } else if (window.location.hash == "#sm-popup-alt") {

        var smPopupAltHtml = "<div id='sm-popup-alt-container' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
            "<video id='sm-popup-video' controls muted style='position: fixed; top: 0; left: 0; height: 100%; width: 100%;'></video>" +
            "<a id='sm-btn-url' role='button' class='btn' style='display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); background-color: #000; width: 40px; height: 30px; line-height: 8px; border-radius: 0px 0px 20px 20px;'>" +
            "<span style='border: solid #fff; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(45deg);'></span>" +
            "<style>" +
            "#sm-popup-alt-container:hover #sm-btn-url { display: block !important; }" +
            "</style>" +
            "</div>";
        document.getElementsByTagName("body")[0].innerHTML = smPopupAltHtml;
        document.getElementById("sm-btn-url").addEventListener("click", function() {
            var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
            var smUrl_ascendon_token = JSON.parse(decodeURIComponent(document.cookie.match('(^|;)\\s*login-session\\s*=\\s*([^;]+)')?.pop() || '')).data.subscriptionToken;
            var smUrl_contentId = "not_video";
            if (window.location.href.includes("detail/")) {
                smUrl_contentId = window.location.href.split("detail/")[1].split("/")[0];
            }
            if (smUrl_contentId == "not_video") {
                alert("Error: No video on this page...");
            } else {
                var smHtml = "<div class='sm-urls-container' style='position: fixed; z-index: 1002; top: 0; left: 0;'>" +
                    "<div onclick='document.getElementsByClassName(&apos;sm-urls-container&apos;)[0].outerHTML = &apos;&apos;' style='position: fixed; z-index: 1002; top: 0; left: 0; height: 100%; width: 100%;'></div>" +
                    "<div style='position: fixed; text-align: center; background-color: #000; z-index: 1003; width: 100%;'>" +
                    "<div class='sm-urls-main'></div>" +
                    "<div class='sm-urls'></div>" +
                    "</div>" +
                    "</div>";
                document.getElementById("sm-popup-alt-container").insertAdjacentHTML("beforeend", smHtml);
                var smUrl_array = [];
                var smUrlColor_array = [];
                var smUrlTeam_array = [];
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
                                            "ascendontoken": smUrl_ascendon_token,
                                            "entitlementtoken": smUrl_entitlement_token
                                        },
                                        async: true,
                                        success: function(data) {
                                            //document.getElementById("sm-popup-video-source").src = data.resultObj.url;
                                            var oldTime = document.getElementById("sm-popup-video").currentTime;
                                            var smHls = new Hls();
                                            smHls.loadSource(data.resultObj.url);
                                            smHls.attachMedia(document.getElementById("sm-popup-video"));
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
                        console.log(smUrl_array);
                    },
                    error: function() {
                        alert("Error: Can't get stream URL...");
                    }
                });

            }
        });
        document.getElementById("sm-btn-url").click();

    } else if (window.location.hash.includes("#sm-popups-alt-")) {
        var smWindowAmount = parseInt(window.location.hash.split("#sm-popups-alt-")[1]);

        var smSettingsFrameHtml = "<a href='https://github.com/najdek/f1tv_plus' target='_blank' style='color: #bbb; font-size: 12px;'>F1TV+ v" + smVersion + " by Mateusz Najdek</a>" +
            "<div id='sm-offset-settings' style='padding: 10px;'>" +
            "<p style='color: #ccc'>All windows are synced to Window #1.<br>Use Window #1 to pause/seek all videos.<br>Sync will stop working after closing any video or this window!</p>" +
            "<table>" +
            "<tr><th colspan='2'>OFFSETS [ms]</th></tr>";


        for (let i = 1; i <= smWindowAmount; i++) {
            smSettingsFrameHtml += "<tr><td>Window #" + i + "</td><td><input id='sm-offset-" + i + "' type='number' step='250' value='0' style='width: 80px;'></td></tr>";
        }

        smSettingsFrameHtml += "<tr><td>Max desync [ms]</td><td><input id='sm-maxdesync' type='number' step='10' value='300' min='0' max='3000' style='width: 80px;'></td></tr>" +
            "</table>" +
            "<table style='margin-top: 40px;'>" +
            "<tr><th colspan='2'>CURRENT SYNC [ms]</th></tr>" +
            "<tr><td>Window #1</td><td>0 ms</td></tr>";

        for (let i = 2; i <= smWindowAmount; i++) {
            smSettingsFrameHtml += "<tr><td>Window #" + i + "</td><td id='sm-sync-status-" + i + "'></td></tr>";
        }

        smSettingsFrameHtml += "</table>" +
            "<div id='sm-sync-status-text' style='text-align: center; font-size: 24px; color: #ff0000;'></div>" +
            "</div>" +
            "<style>" +
            "body { background-color: #000; color: #fff; }" +
            "td,th { padding: 4px 20px; }" +
            "</style>";

        var smWindow = [];

        document.getElementsByTagName("body")[0].innerHTML = smSettingsFrameHtml;

        for (let i = 1; i <= smWindowAmount; i++) {
            smWindow[i] = window.open(document.location.href.split("#")[0] + "#sm-popup-alt", Date.now(), "width=1280,height=720");
            smWindow[i].addEventListener('load', (event) => {
                // dirty fix to keep new window names
                for (let n = 0; n < 30; n++) {
                    setTimeout(function() {
                        document.title = "F1TV+ v" + smVersion;
                        smWindow[i].document.title = "Window #" + i;
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


            for (let i = 1; i <= smWindowAmount; i++) {
                offset[i] = parseInt(document.getElementById("sm-offset-" + i).value) / 1000 || 0;
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




    } else if (window.location.hash == "#sm-frames-alt") {

        var smFramesAltHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
            "<div id='sm-frames-status' style='position: fixed; width: 100%; top: 0; left: 0; text-align: center; z-index: 1002; font-size: 20px; color: #ccc;'></div>" +
            "</div>" +
            "<div style='position: relative; top: 0; left: 0; width: 100%; height: 100%;'>" +
            "<div style='position: fixed; z-index: 1001; top: 0; left: 0;'><a style='color: #ccc;' onclick='document.getElementById(&apos;sm-offset-settings&apos;).style.display = &apos;block&apos;;'>[SYNC MENU]</a></div>" +
            "<div id='sm-offset-settings' style='display: none; position: fixed; z-index: 1002; top: 0; left: 0; background-color: #000; padding: 4px; border-radius: 4px;'><table>" +
            "<tr><td>OFFSETS [ms]</td><td style='text-align: right;'><a onclick='document.getElementById(&apos;sm-offset-settings&apos;).style.display = &apos;none&apos;;'>[X]</a></td></tr>" +
            "<tr><td>Frame #1 (left)</td><td><input id='sm-offset-1' type='number' step='250' value='0' style='width: 80px;'></td></tr>" +
            "<tr><td>Frame #2 (top right)</td><td><input id='sm-offset-2' type='number' step='250' value='0' style='width: 80px;'></td></tr>" +
            "<tr><td>Frame #3 (bottom right)</td><td><input id='sm-offset-3' type='number' step='250' value='0' style='width: 80px;'></td></tr>" +
            "<tr><td>Max desync [ms]</td><td><input id='sm-maxdesync' type='number' step='10' value='300' min='0' max='3000' style='width: 80px;'></td></tr>" +
            "</table></div>" +
            "<iframe id='sm-frame-1' style='height: 100%; width: 66.6%; top: 0; left: 0; position: absolute; z-index: 1001;'></iframe>" +
            "<iframe id='sm-frame-2' style='height: 50%; width: 33.3%; bottom: 50%; left: 66.6%; position: absolute; z-index: 1001;'></iframe>" +
            "<iframe id='sm-frame-3' style='height: 50%; width: 33.3%; top: 50%; left: 66.6%; position: absolute; z-index: 1001;'></iframe>" +
            "</div>" +
            "<style>" +
            "body {overflow: hidden;}" +
            ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; background-color: #000;}" +
            ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
            ".inset-video-item-play-action-container {width: 100%;}" +
            "</style>";
        document.getElementsByTagName("body")[0].innerHTML = smFramesAltHtml;
        document.getElementById("sm-frame-1").src = window.location.href.split("#")[0] + "#sm-popup-alt";
        document.getElementById("sm-frame-2").src = window.location.href.split("#")[0] + "#sm-popup-alt";
        document.getElementById("sm-frame-3").src = window.location.href.split("#")[0] + "#sm-popup-alt";

        function smResizeFrames() {
            if ((jQuery("body").height() / jQuery("body").width()) > 0.3819) {
                jQuery("#sm-frame-1").css("width", "66.6%");
                jQuery("#sm-frame-2").css("width", "33.3%");
                jQuery("#sm-frame-3").css("width", "33.3%");
                jQuery("#sm-frame-1").css("top", ((jQuery("body").height() - (jQuery("#sm-frame-1").width() * 0.5625)) / 2) + "px");
                jQuery("#sm-frame-1").height(jQuery("#sm-frame-1").width() * 0.5625);
                jQuery("#sm-frame-2").height(jQuery("#sm-frame-2").width() * 0.5625);
                jQuery("#sm-frame-3").height(jQuery("#sm-frame-3").width() * 0.5625);
                jQuery("#sm-frame-1").css("right", "");
                jQuery("#sm-frame-1").css("left", "0");
            } else {
                jQuery("#sm-frame-1").css("top", "0");
                jQuery("#sm-frame-1").height("100%");
                jQuery("#sm-frame-2").height("50%");
                jQuery("#sm-frame-3").height("50%");
                jQuery("#sm-frame-1").width(jQuery("#sm-frame-1").height() * 1.7778);
                jQuery("#sm-frame-2").width(jQuery("#sm-frame-2").height() * 1.7778);
                jQuery("#sm-frame-3").width(jQuery("#sm-frame-3").height() * 1.7778);
                jQuery("#sm-frame-1").css("right", "33.3%");
                jQuery("#sm-frame-1").css("left", "");
            }
        }
        smResizeFrames();
        window.addEventListener("resize", smResizeFrames);


        function smPauseAll() {
            var video1 = document.getElementById("sm-frame-1").contentDocument || document.getElementById("sm-frame-1").contentWindow.document;
            var video2 = document.getElementById("sm-frame-2").contentDocument || document.getElementById("sm-frame-2").contentWindow.document;
            var video3 = document.getElementById("sm-frame-3").contentDocument || document.getElementById("sm-frame-3").contentWindow.document;
            video1.getElementById("sm-popup-video").pause();
            video2.getElementById("sm-popup-video").pause();
            video3.getElementById("sm-popup-video").pause();

        }

        function smResumeAllWhenReady() {
            var video1 = document.getElementById("sm-frame-1").contentDocument || document.getElementById("sm-frame-1").contentWindow.document;
            var video2 = document.getElementById("sm-frame-2").contentDocument || document.getElementById("sm-frame-2").contentWindow.document;
            var video3 = document.getElementById("sm-frame-3").contentDocument || document.getElementById("sm-frame-3").contentWindow.document;
            var smReadyCheck = setInterval(function() {
                var smNotReady = 0;
                if (video1.getElementById("sm-popup-video").readyState != 4) {
                    smNotReady += 1;
                }
                if (video2.getElementById("sm-popup-video").readyState != 4) {
                    smNotReady += 1;
                }
                if (video3.getElementById("sm-popup-video").readyState != 4) {
                    smNotReady += 1;
                }
                if (smNotReady == 0) {
                    video1.getElementById("sm-popup-video").play();
                    video2.getElementById("sm-popup-video").play();
                    video3.getElementById("sm-popup-video").play();
                    document.getElementById("sm-frames-status").innerHTML = "";
                    clearInterval(smReadyCheck);
                }
            }, 100);
        }

        function smSync() {
            var time = [];
            var offset = [];
            var timeDiff = [];
            var smSynced = 0;
            var video1 = document.getElementById("sm-frame-1").contentDocument || document.getElementById("sm-frame-1").contentWindow.document;
            var video2 = document.getElementById("sm-frame-2").contentDocument || document.getElementById("sm-frame-2").contentWindow.document;
            var video3 = document.getElementById("sm-frame-3").contentDocument || document.getElementById("sm-frame-3").contentWindow.document;

            if (video1.getElementById("sm-popup-video").readyState == 0) {
                return;
            }
            if (video2.getElementById("sm-popup-video").readyState == 0) {
                return;
            }
            if (video3.getElementById("sm-popup-video").readyState == 0) {
                return;
            }
            if (video1.getElementById("sm-popup-video").paused) {
                if (video2.getElementById("sm-popup-video").paused != true) {
                    video2.getElementById("sm-popup-video").pause()
                }
                if (video3.getElementById("sm-popup-video").paused != true) {
                    video3.getElementById("sm-popup-video").pause()
                }
                return;
            }
            offset[1] = parseInt(document.getElementById("sm-offset-1").value) / 1000 || 0;
            offset[2] = parseInt(document.getElementById("sm-offset-2").value) / 1000 || 0;
            offset[3] = parseInt(document.getElementById("sm-offset-3").value) / 1000 || 0;
            var maxDesync = parseInt(document.getElementById("sm-maxdesync").value) / 1000 || 0.3;
            time[1] = video1.getElementById("sm-popup-video").currentTime - offset[1];
            time[2] = video2.getElementById("sm-popup-video").currentTime - offset[2];
            time[3] = video3.getElementById("sm-popup-video").currentTime - offset[3];
            timeDiff[2] = Math.abs(time[1] - time[2]);
            timeDiff[3] = Math.abs(time[1] - time[3]);
            console.log(timeDiff);
            if (timeDiff[2] > maxDesync) {
                smPauseAll();
                video2.getElementById("sm-popup-video").currentTime = time[1] + offset[2];
                smSynced += 1;
            }
            if (timeDiff[3] > maxDesync) {
                smPauseAll();
                video3.getElementById("sm-popup-video").currentTime = time[1] + offset[3];
                smSynced += 1;
            }
            if (smSynced > 0) {
                document.getElementById("sm-frames-status").innerHTML = "Syncing...";
                smResumeAllWhenReady();
            }
        }
        var smSyncLoop = setInterval(function() {
            smSync();
        }, 500);



    } else if (window.location.hash == "#sm-frames") {

        var smFramesHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
            "</div>" +
            "<div style='position: relative; top: 0; left: 0; width: 100%; height: 100%;'>" +
            "<iframe id='sm-frame-1' style='height: 100%; width: 66.6%; top: 0; left: 0; position: absolute; z-index: 1001;'></iframe>" +
            "<iframe id='sm-frame-2' style='height: 50%; width: 33.3%; bottom: 50%; left: 66.6%; position: absolute; z-index: 1001;'></iframe>" +
            "<iframe id='sm-frame-3' style='height: 50%; width: 33.3%; top: 50%; left: 66.6%; position: absolute; z-index: 1001;'></iframe>" +
            "</div>" +
            "<style>" +
            "body {overflow: hidden;}" +
            ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; background-color: #000;}" +
            ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
            ".inset-video-item-play-action-container {width: 100%;}" +
            "</style>";
        document.getElementsByTagName("body")[0].innerHTML = smFramesHtml;
        document.getElementById("sm-frame-1").src = window.location.href.split("#")[0] + "#sm-popup";
        document.getElementById("sm-frame-2").src = window.location.href.split("#")[0] + "#sm-popup";
        document.getElementById("sm-frame-3").src = window.location.href.split("#")[0] + "#sm-popup";

        function smResizeFrames() {
            if ((jQuery("body").height() / jQuery("body").width()) > 0.3819) {
                jQuery("#sm-frame-1").css("width", "66.6%");
                jQuery("#sm-frame-2").css("width", "33.3%");
                jQuery("#sm-frame-3").css("width", "33.3%");
                jQuery("#sm-frame-1").css("top", ((jQuery("body").height() - (jQuery("#sm-frame-1").width() * 0.5625)) / 2) + "px");
                jQuery("#sm-frame-1").height(jQuery("#sm-frame-1").width() * 0.5625);
                jQuery("#sm-frame-2").height(jQuery("#sm-frame-2").width() * 0.5625);
                jQuery("#sm-frame-3").height(jQuery("#sm-frame-3").width() * 0.5625);
                jQuery("#sm-frame-1").css("right", "");
                jQuery("#sm-frame-1").css("left", "0");
            } else {
                jQuery("#sm-frame-1").css("top", "0");
                jQuery("#sm-frame-1").height("100%");
                jQuery("#sm-frame-2").height("50%");
                jQuery("#sm-frame-3").height("50%");
                jQuery("#sm-frame-1").width(jQuery("#sm-frame-1").height() * 1.7778);
                jQuery("#sm-frame-2").width(jQuery("#sm-frame-2").height() * 1.7778);
                jQuery("#sm-frame-3").width(jQuery("#sm-frame-3").height() * 1.7778);
                jQuery("#sm-frame-1").css("right", "33.3%");
                jQuery("#sm-frame-1").css("left", "");
            }
        }
        smResizeFrames();
        window.addEventListener("resize", smResizeFrames);

    } else {

        function smLoad() {

            var smBtnHtml = "<div id='sm-menu' style='display: none;'>" +
                "<a id='sm-btn-url' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Get stream URL'>" +
                "<span style='display: inline-block; font-size: 12px;'>URL</span></a>" +
                "<a id='sm-btn-popup' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT</span></a>" +
                "<a id='sm-btn-popup-alt' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout (alternative mode)'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT (ALT)</span></a>" +
                "<a id='sm-btn-frames' role='button' class='btn btn--transparent' style='color: #000; margin: 6px; display: none;' title='Open popout with 3 streams'>" +
                "<span style='display: inline-block; font-size: 12px;'>MULTI-VIEW</span></a>" +
                "<a id='sm-btn-frames-alt' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout with 3 synchronized streams'>" +
                "<span style='display: inline-block; font-size: 12px;'>MULTI-VIEW</span></a>" +
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

            document.getElementById("sm-btn-url").addEventListener("click", function() {
                var smUrl_entitlement_token = document.cookie.match('(^|;)\\s*entitlement_token\\s*=\\s*([^;]+)')?.pop() || '';
                var smUrl_ascendon_token = JSON.parse(decodeURIComponent(document.cookie.match('(^|;)\\s*login-session\\s*=\\s*([^;]+)')?.pop() || '')).data.subscriptionToken;
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
                                                "ascendontoken": smUrl_ascendon_token,
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
                            console.log(smUrl_array);
                        },
                        error: function() {
                            alert("Error: Can't get stream URL...");
                        }
                    });

                }
            });

            document.getElementById("sm-btn-popup").addEventListener("click", function() {
                window.open(document.location.href + "#sm-popup", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-frames").addEventListener("click", function() {
                window.open(document.location.href + "#sm-frames", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-popup-alt").addEventListener("click", function() {
                window.open(document.location.href + "#sm-popup-alt", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-frames-alt").addEventListener("click", function() {
                window.open(document.location.href + "#sm-frames-alt", Date.now(), "width=1870,height=760");
                $("video").trigger("pause");
            });
            document.getElementById("sm-btn-popups-alt").addEventListener("click", function() {
                var smWindowAmountInput = prompt("How many windows [2-10]?", "2");
                smWindowAmountInput = parseInt(smWindowAmountInput);
                if ((smWindowAmountInput >= 2) && (smWindowAmountInput <= 10)) {
                    window.open(document.location.href + "#sm-popups-alt-" + smWindowAmountInput, Date.now(), "width=500,height=500");
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
                        ".header .navbar-dark .nav-link { padding: 0.7rem .5rem; }" +
                        ".inset-video-item-play-action-container { width: 100%; }" +
                        ".sticky-header-wrapper.is-menu { margin-bottom: 94px; }" +
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

        (function smInit() {
            setTimeout(function() {
                if (document.getElementsByClassName("global-header-nav").length > 0) {
                    smLoad();
                } else {
                    smInit();
                }
            }, 500);
        }());

    }

})();
