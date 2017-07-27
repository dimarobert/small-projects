/// <reference types="parse-torrent" />

import * as $ from 'jquery';
import 'jquery-binarytransport';
import * as ParseTorrent from 'parse-torrent';

interface MagnetHandlerData {
    isDetails: boolean;
};

let torrentRows = $('#maincolumn > div > div.cblock-content > div > div.visitedlinks > div.torrentrow');

let getCurrentTabInfo = (): Promise<chrome.tabs.Tab> => {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
        chrome.runtime.sendMessage(
            {},
            (r: chrome.tabs.Tab) =>
                resolve(r)
        );
    })
};

let getTorrentURI = (isDetails: boolean, magnetEl: JQuery<HTMLElement>): string => {
    if (isDetails)
        return magnetEl.next().attr('href');

    // else is browse
    var $downloadCol = magnetEl.parent().parent().next();
    return $('span > a', $downloadCol).attr('href');
};

let generateMagnet = (event: JQuery.Event<HTMLElement, MagnetHandlerData>) => {
    event.preventDefault();

    let $magnetCol = $(event.currentTarget);
    let torrentURI = getTorrentURI(event.data.isDetails, $magnetCol);

    new Promise<Blob>((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: torrentURI,
            processData: false,
            dataType: 'binary',
            success: (data: Blob) =>
                resolve(data)
        });
    }).then(blob => {
        return new Promise<FileReader>((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = () =>
                resolve(fileReader);
            fileReader.readAsArrayBuffer(blob);
        });
    }).then(fileReader => {
        let torrent = ParseTorrent(new Buffer(fileReader.result));
        var magnerUri = ParseTorrent.toMagnetURI(torrent);

        // optimization: this prevents magnet generation for the second time
        // instead it 'caches' the uri and directly delivers it. 
        $magnetCol.unbind("click", generateMagnet);
        $magnetCol.click(() => { window.location.href = magnerUri; });
        window.location.href = magnerUri;
    });
}

let generateBrowseLinks = () => {
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

        $generateMagnetAnchor.click({ isDetails: false }, generateMagnet);
    });

};

let generateDetailsLink = () => {
    let $downloadLink = $('#maincolumn > div:nth-child(1) > div.cblock-content > div > span:nth-child(1) > a.index');
    let $generateMagnetAnchor = $(`
        <a class="filelist-magnet-details" href="#">
            <img class="magnet-icon" 
                src="${chrome.extension.getURL("magnet.png")}" 
                data-toggle="tooltip" 
                data-placement="top" title="" 
                data-original-title="Download Magnet"
            />
        </a>`
    );

    $downloadLink.before($generateMagnetAnchor);
    $generateMagnetAnchor.click({ isDetails: true }, generateMagnet);
};

getCurrentTabInfo().then(tabInfo => {
    if (tabInfo.url.match(/browse.php/))
        generateBrowseLinks();
    else
        generateDetailsLink();
});

