// ==UserScript==
// @name           Hypeddit Bypasser
// @description    Download a track from Hypeddit without having to comment and follow. Just click the button.
// @include        http://hypeddit.com/track/sc/*
// @version        1
// ==/UserScript==

var downloadButton = document.createElement("input");
downloadButton.type = "button";
downloadButton.value = "Download directly";
downloadButton.onclick = downloadTrack;
downloadButton.setAttribute("style", "position:absolute;top:250px;right:50px;");
document.body.appendChild(downloadButton);

function downloadTrack(){
    document.getElementById("comment_text").value = " "; //fill comment box
    return filedownload();
}
