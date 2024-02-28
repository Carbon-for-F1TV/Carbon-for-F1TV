var f1tvDomain = "https://f1tv.formula1.com/";
var f1tvVideosUrl = "2.0/R/ENG/WEB_DASH/ALL/PAGE/SEARCH/VOD/F1_TV_Pro_Annual/2?orderBy=contractStartDate&sortOrder=desc&filter_orderByDefault=Y&maxResults=12";

var f1tvFeaturedUrl = "2.0/R/ENG/WEB_DASH/ALL/PAGE/395/F1_TV_Pro_Annual/2";

var f1tvVideoImageUrl = [f1tvDomain + "image-resizer/image/",
    "?w=296&h=167&q=HI&o=L"];

    
var f1tvVideos = $.getJSON(f1tvDomain + f1tvVideosUrl, function (data) {
    if (data.resultCode == "OK") {
        listVideos(data.resultObj.containers);
    }
}).fail(function () {
    $("#video-list").text("Error: Can't load video list from F1TV");
});

function listVideos(data) {
    for (let i = 0; i < data.length; i++) {
        let videoHtml = "<div class='carbon-video' id='vid-" + i + "'>" +
            "<div class='video-content'>" +
            "<div class='video-img'><div class='video-duration'></div></div>" +
            "<div class='video-title'></div>" +
            "</div>" +
            "</div>";
        $("#video-list")[0].insertAdjacentHTML("beforeend", videoHtml);
        $("#vid-" + i + " .video-img").css("background-image", "url(" + f1tvVideoImageUrl[0] + data[i]["metadata"]["pictureUrl"] + f1tvVideoImageUrl[1] + ")");
        $("#vid-" + i + " .video-title").text(data[i]["metadata"]["title"]);
        let duration = data[i]["metadata"]["uiDuration"];
        let durationH = parseInt(duration.split(":")[0]);
        let durationM;
        let durationS;
        if (durationH > 0) {
            durationM = duration.split(":")[1];
            durationS = duration.split(":")[2];
            duration = durationH + ":" + durationM + ":" + durationS;
        } else {
            durationM = parseInt(duration.split(":")[1]);
            durationS = duration.split(":")[2];
            duration = durationM + ":" + durationS;
        }
        $("#vid-" + i + " .video-duration").text(duration);
        $("#vid-" + i)[0].addEventListener("click", function () {
            window.open(f1tvDomain + "detail/" + data[i]["metadata"]["contentId"] + "/0?action=play");
            window.close();
        })
    }
}


var f1tvFeatured = $.getJSON(f1tvDomain + f1tvFeaturedUrl, function (data) {
    if (data.resultCode == "OK") {
        let containers = data.resultObj.containers;
        for (let i = 0; i < containers.length; i++) {
            if (containers[i].layout == "interactive_schedule") {
                let title = containers[i].meeting.metadata.shortDescription;
                listFeatured(containers[i].retrieveItems.resultObj.containers, title);
                break;
            }
        }
    }
}).fail(function () {
    $("#featured-list").text("Error: Can't load featured list from F1TV");
});


function timesCompare(a, b) {
    let timeA = parseInt(a.metadata.emfAttributes.sessionStartDate);
    let timeB = parseInt(b.metadata.emfAttributes.sessionStartDate);
    let c = 0;
    if (timeA > timeB) {
        c = 1;
    } else if (timeA < timeB) {
        c = -1;
    }
    return c;
}

function listFeatured(data, title) {
    console.log(title);
    console.log(data);

    $("#featured-list-title").text(title);


    for (let i = 0; i < data.length; i++) {
        let dataI = i;
        let eventName = data[i].eventShortName || data[i].eventName;
        let events = data[i].events;

        let sortedEvents = events.sort(timesCompare);

        console.log(sortedEvents);
        let eventBtnHtml = "<div id='featured-switcher-" + dataI + "' class='featured-switcher'>" + eventName + "</div>";
        $("#featured-list-switchers")[0].insertAdjacentHTML("beforeend", eventBtnHtml);
        $("#featured-switcher-" + dataI)[0].addEventListener("click", function() {
            $(".carbon-video.featured").hide();
            $(".carbon-video.featured-" + dataI).show();
            $(".featured-switcher").removeClass("enabled");
            $("#featured-switcher-" + dataI).addClass("enabled");
        });

        for (let i = 0; i < events.length; i++) {
            let subtype = events[i]["metadata"]["contentSubtype"];
            if ((subtype == "LIVE_EVENT") || (subtype == "SHOW")) {
                subtype = "UPCOMING";
            }
            let title = events[i]["metadata"]["titleBrief"] || events[i]["metadata"]["title"];
            let titleHeader = events[i]["metadata"]["uiSeries"];
            if (/^[A-Za-z0-9]*$/.test(titleHeader) == false) {
                titleHeader = "";
            }
            let videoHtml = "<div class='carbon-video featured featured-" + subtype.toLowerCase() + " featured-" + dataI + "' id='featured-" + dataI + "-" + i + "'>" +
                "<div class='video-content'>" +
                "<div class='video-img'>" +
                "<div class='video-subtype video-subtype-" + subtype.toLowerCase() + "'>" + subtype + "</div>" +
                "<div class='video-duration'></div>" +
                "</div>" +
                "<div class='video-title-header video-title-header-" + titleHeader.toLowerCase() + "'></div>" +
                "<div class='video-title'></div>" +
                "</div>" +
                "</div>";
            $("#featured-list")[0].insertAdjacentHTML("beforeend", videoHtml);
            $("#featured-" + dataI + "-" + i + " .video-img").css("background-image", "url(" + f1tvVideoImageUrl[0] + events[i]["metadata"]["pictureUrl"] + f1tvVideoImageUrl[1] + ")");
            $("#featured-" + dataI + "-" + i + " .video-title-header").text(titleHeader);
            $("#featured-" + dataI + "-" + i + " .video-title").text(title);
            let duration = events[i]["metadata"]["uiDuration"];
            let durationH = parseInt(duration.split(":")[0]);
            let durationM;
            let durationS;
            if (durationH > 0) {
                durationM = duration.split(":")[1];
                durationS = duration.split(":")[2];
                duration = durationH + ":" + durationM + ":" + durationS;
            } else {
                durationM = parseInt(duration.split(":")[1]);
                durationS = duration.split(":")[2];
                duration = durationM + ":" + durationS;
            }
            if (subtype == "UPCOMING") {
                let sessionStartDate = parseInt(events[i]["metadata"]["emfAttributes"]["sessionStartDate"]);
                sessionStartDate = new Date(sessionStartDate);
                console.log(sessionStartDate);

                sessionStartDate = sessionStartDate.toISOString().split('T')[0] + " " + sessionStartDate.toTimeString().split(' ')[0].slice(0, -3);
                $("#featured-" + dataI + "-" + i + " .video-duration").text(sessionStartDate);
            } else {
                $("#featured-" + dataI + "-" + i + " .video-duration").text(duration);
                $("#featured-" + dataI + "-" + i)[0].addEventListener("click", function () {
                    window.open(f1tvDomain + "detail/" + events[i]["metadata"]["contentId"] + "/0?action=play");
                    window.close();
                })
            }
        }
    }
    $("#featured-switcher-0").click();
    if ($(".featured-switcher").length < 3) {
        $("#featured-list-switchers").hide();
    }
}