// ==UserScript==
// @name           DownloadWallBypasser
// @description    Bypass download walls on popular sound sharing sites.
// @author         cortex42 (https://github.com/cortex42)
// @include        https://hypeddit.com/track/sc/*
// @include        https://theartistunion.com/tracks/*
// @version        1.0
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

    if(url.indexOf("hypeddit.com/track/sc/") != -1) { // hypeddit

        if(document.getElementById("comment_text") !== null) {
            document.getElementById("comment_text").value = "foobar"; //fill comment box
        }
        return downloadGate();

    } else if(url.indexOf("theartistunion.com/tracks/" != -1)) { // theartistunion

        var trackId = url.substring(url.indexOf("tracks/")+7);
        var apiUrl = "https://theartistunion.com/api/v3/tracks/" + trackId +"/";

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                var responseText = response.responseText;
                console.log("[DownloadWallBypasser] ResponseText: "+ responseText);
                var audioSource = responseText.substring(responseText.indexOf("https://content.theartistunion.com/tracks/stream_files/"), responseText.indexOf(".mp3?")+4);
                var finalLink = audioSource.replace("stream_files", "original_files");
                console.log("[DownloadWallBypasser] FinalLink: " + finalLink);

                if(finalLink.indexOf("u0026") != -1) {
                    var index = finalLink.indexOf("u0026");
                    finalLink = finalLink.substr(0, index-1) + "&" + finalLink.substr(index+5);
                    console.log("[DownloadWallBypasser] Replaced \\u0026 in FinalLink: " + finalLink);
                }

                // now check if the link really exists
                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: finalLink,
                    onload: function(response) {
                        if(response.status == 404) {
                            // now try it with .wav
                            console.log("[DownloadWallBypasser] .mp3 file not found, trying with .wav");
                            finalLink = finalLink.replace(".mp3", ".wav");
                            console.log("[DownloadWallBypasser] FinalLink: " + finalLink);

                            GM_xmlhttpRequest({
                                method: "HEAD",
                                url: finalLink,
                                onload: function(response) {
                                    console.log("[DownloadWallBypasser] Response: " + response.responseText);
                                    if(response.status != 404) {
                                        console.log("[DownloadWallBypasser] .wav file found!");
                                        var a = document.createElement("a");
                                        a.setAttribute("href", finalLink);
                                        document.body.appendChild(a);
                                        a.click();
                                    } else {
                                        console.log("[DownloadWallBypasser] .wav file also not found...");
                                        alert("[DownloadWallBypasser] Failed trying to find the direct download link!");
                                        return;
                                    }
                                }
                            });
                        } else {
                            console.log("[DownloadWallBypasser] .mp3 file found!");
                            var a = document.createElement("a");
                            a.setAttribute("href", finalLink);
                            document.body.appendChild(a);
                            a.click();
                        }
                    }
                });
            }
        });
    }
}
