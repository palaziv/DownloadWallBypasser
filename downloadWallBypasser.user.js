// ==UserScript==
// @name           DownloadWallBypasser
// @description    Bypass download walls on popular sound sharing sites.
// @author         cortex42 (https://github.com/cortex42)
// @include        https://hypeddit.com/track/*
// @include        https://theartistunion.com/tracks/*
// @version        1.3
// @grant          GM_xmlhttpRequest
// @require        https://code.jquery.com/jquery-3.2.1.js
// @run-at         document-idle
// ==/UserScript==

var downloadButton = document.createElement("input");
downloadButton.type = "button";
downloadButton.value = "Download Track!";
downloadButton.onclick = downloadTrack;
downloadButton.setAttribute("style", "position:absolute;top:250px;right:50px;");
document.body.appendChild(downloadButton);

function downloadTrack(){
    var url = window.location.href;

    if(url.indexOf("hypeddit.com/track/") != -1) { // hypeddit

        if(document.getElementById("comment_text") !== null) {
            document.getElementById("comment_text").value = "foobar"; //fill comment box
        }
        return downloadUnlimitedGate();

    } else if(url.indexOf("theartistunion.com/tracks/" != -1)) { // theartistunion

        var trackId = url.substring(url.indexOf("tracks/")+7);
        var apiUrl = "https://theartistunion.com/api/v3/tracks/" + trackId +"/";

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                var responseText = response.responseText;
                console.log("[DownloadWallBypasser] ResponseText: "+ responseText);
                // "audio_source":"https://d2tml28x3t0b85.cloudfront.net/tracks/stream_files/000/749/807/original/Sarcasmo%20-%20Roraima%20%28Original%20Mix%29%20-%20%5BFREE%20DOWNLOAD%5D.mp3?1519832964","blu
                var downloadLink = responseText.substring(responseText.indexOf("audio_source\":") + "audio_source\":\"".length, responseText.indexOf(",\"blurred_artwork")-1);
                console.log("[DownloadWallBypasser] DownloadLink: "+ downloadLink);

                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: downloadLink,
                    onload: function(response) {
                        if(response.status != 404) {
                            console.log("[DownloadWallBypasser] file found!");
                            var a = document.createElement("a");
                            a.setAttribute("href", downloadLink);
                            document.body.appendChild(a);
                            a.click();
                        } else {
                            console.log("[DownloadWallBypasser] file not found.");
                            alert("[DownloadWallBypasser] Failed trying to find the direct download link!");
                            return;
                        }
                    }
                });
            }
        });
    }
}
