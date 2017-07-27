/// <reference types="parse-torrent" />

import * as $ from 'jquery';
import 'jquery-binarytransport';
import * as ParseTorrent from 'parse-torrent';

let torrentRows = $('#maincolumn > div > div.cblock-content > div > div.visitedlinks > div.torrentrow');

let generateMagnet = (event: JQuery.Event) => {
    event.preventDefault();
    let $magnetCol = $(event.currentTarget);
    let $downloadCol = $magnetCol.parent().parent().next();
    let torrentURI = $('span > a', $downloadCol).attr('href');

    $.ajax({
        type: 'GET',
        url: torrentURI,
        processData: false,
        dataType: 'binary',
        success: (data) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let torrent = ParseTorrent(new Buffer(fileReader.result));
                var magnerUri = ParseTorrent.toMagnetURI(torrent);

                // optimization: this prevents magnet generation for the second time
                // instead it 'caches' the uri and directly delivers it. 
                $magnetCol.unbind("click", generateMagnet);
                $magnetCol.click(() => { window.location.href = magnerUri; });
                window.location.href = magnerUri;
            };
            fileReader.readAsArrayBuffer(data);
        }
    });

}

$.each(torrentRows, (idx, row) => {
    let $downloadCol = $('div:nth-child(3) > span', row);
    let $generateMagnetAnchor = $(`
        <a href="#">
            <img class="magnet-icon" 
                 src="${chrome.extension.getURL("magnet.png")}" 
                 data-toggle="tooltip" 
                 data-placement="top" title="" 
                 data-original-title="Download Magnet"
            />
        </a>`
    );
    let $generateMagnet = $('<span class="filelist-magnet"></span>');
    $generateMagnet.append($generateMagnetAnchor);
    $downloadCol.replaceWith($generateMagnet);

    $generateMagnetAnchor.click(generateMagnet);
});

