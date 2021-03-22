// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.me/
// @version      3.3f
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

    var smVersion = "3.3f";
    //<updateDescription></updateDescription>

    var smUpdateUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/main/f1tv_plus.user.js";

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
            "<a id='sm-btn-url' role='button' class='sm-btn' style='display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); background-color: #000; width: 40px; height: 30px; line-height: 20px; text-align: center; border-radius: 0px 0px 20px 20px;'>" +
            "<span style='border: solid #fff; border-width: 0 3px 3px 0; display: inline-block; padding: 3px; transform: rotate(45deg);'></span>" +
            "<style>" +
            "body { font-family: Arial; }" +
            "#sm-popup-alt-container:hover #sm-btn-url { display: block !important; }" +
            ".sm-btn { display: inline-block; cursor: pointer; border-radius: 4px; }" +
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
                                var smBtnHtml = "<a id='sm-btn-url-" + title + "' title='" + team[title] + "' role='button' class='sm-btn' data-url='" + url + "' style='border-bottom: 4px solid " + color + "; background-color: #333; color: #fff; font-size: 12px; margin: 8px; padding: 8px 16px; position: relative;'>" +
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

        var smSettingsFrameHtml = "<div id='sm-offset-settings' style='padding: 10px;'>" +
            "<p style='color: #ccc'>All windows are synced to Window #1.<br>Use Window #1 to pause/seek all videos.</p>" +
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
            "body { background-color: #000; color: #fff; font-family: Arial; margin: 0; }" +
            "td,th { padding: 4px 20px; }" +
            "</style>";

        var smWindow = [];

        document.getElementsByTagName("html")[0].innerHTML = smSettingsFrameHtml;

        for (let i = 1; i <= smWindowAmount; i++) {
            smWindow[i] = window.open(document.location.href.split("#")[0].replace("action=play", "") + "#sm-popup-alt", Date.now(), "width=1280,height=720");
            smWindow[i].addEventListener('load', (event) => {
                // dirty fix to keep new window names
                for (let n = 0; n < 30; n++) {
                    setTimeout(function() {
                        document.title = "SYNC MENU";
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
                    window.open(document.location.href.replace("action=play", "") + "#sm-popups-alt-" + smWindowAmountInput, Date.now(), "width=500,height=" + (450 + (34 * parseInt(smWindowAmountInput))));
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
