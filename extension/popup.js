var f1tvDomain = "https://f1tv.formula1.com/";
var f1tvVideosUrl = "2.0/R/ENG/WEB_DASH/ALL/PAGE/SEARCH/VOD/F1_TV_Pro_Annual/2?orderBy=contractStartDate&sortOrder=desc&filter_orderByDefault=Y&maxResults=18";

var f1tvVideoImageUrl = [f1tvDomain + "image-resizer/image/",
    "?w=296&h=167&q=HI&o=L"];

    var f1tvVideos = $.getJSON(f1tvDomain + f1tvVideosUrl, function (data) {
        if (data.resultCode == "OK") {
            listVideos(data.resultObj.containers);
        }
    }).fail(function() {
        $("#video-list").text("Error: Can't load video list from F1TV");
    });


function listVideos(data) {
    for (let i = 0; i < data.length; i++) {
        let videoHtml = "<div class='carbon-video' id='vid-" + i + "'>" +
            "<div class='video-content'>" +
            "<div class='video-img' id='video-img-" + i + "'><div class='video-duration'></div></div>" +
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
            window.open(f1tvDomain + "detail/" + data[i]["metadata"]["contentId"] + "/a");
            window.close();
        })
    }
}