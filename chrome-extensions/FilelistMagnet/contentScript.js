var torrentRows = $('#maincolumn > div > div.cblock-content > div > div.visitedlinks > div.torrentrow');

$.each(torrentRows, function(idx, row) {
    var $downloadCol = $('div:nth-child(3) > span', row);
    var $generateMagnetAnchor = $('<a href="#"><img class="magnet-icon" src="' + chrome.extension.getURL("magnet.png") + '" data-toggle="tooltip" data-placement="top" title="" data-original-title="Download Magnet"></a>');
    var $generateMagnet = $('<span class="filelist-magnet"></span>');
    $generateMagnet.append($generateMagnetAnchor);
    $downloadCol.replaceWith($generateMagnet);

    $generateMagnetAnchor.click(generateMagnet);
});

function generateMagnet() {
    var $downloadCol = $(this).parent().parent().next();
    var torrentURI = $('span > a', $downloadCol).attr('href');

    $.get(torrentURI, function(data) {
        debugger;

    });
}