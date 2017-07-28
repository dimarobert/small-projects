import { MagnetUri } from './MagnetUri';

export class MagnetUrlManager {
    private torrentRows: JQuery<HTMLElement>;

    public run(): void {
        this.torrentRows = $('#maincolumn > div > div.cblock-content > div > div.visitedlinks > div.torrentrow');

        if (window.location.pathname.match(/browse.php/))
            this.generateBrowseLinks();
        else
            this.generateDetailsLink();
    };

    private generateDetailsLink(): void {
        let $downloadLink = $('#maincolumn > div:nth-child(1) > div.cblock-content > div > span:nth-child(1) > a.index');
        if (!$downloadLink.length)
            $downloadLink = $('#maincolumn > div:nth-child(1) > div.cblock-content > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > a');

        if (!$downloadLink.length) {
            console.error("Failed to retrieve download link in details.php");
            return;
        }

        let $magnetAnchor = this.getAnchor({ cssClass: 'filelist-magnet-details', tooltipText: 'Download Magnet' });

        $downloadLink.before($magnetAnchor);
        new MagnetUri($downloadLink.attr('href'), $magnetAnchor);
    }

    private generateBrowseLinks(): void {
        $.each(this.torrentRows, (idx, row) => {
            let $magnetCol = $('div:nth-child(3) > span', row);
            let $magnetAnchor = this.getAnchor({ tooltipText: "Download Magnet" });

            let $magnetSpan = $('<span class="filelist-magnet"></span>');
            $magnetSpan.append($magnetAnchor);
            $magnetCol.replaceWith($magnetSpan);

            let torrentUri = $('div:nth-child(4) > span > a', row).attr('href');
            let magnetUri = new MagnetUri(torrentUri, $magnetAnchor);
        });
    }

    private getAnchor(options: { cssClass?: string, tooltipText: string }): JQuery<HTMLElement> {
        return $(`
            <a class="${options.cssClass || ""}" href="#">
                <img class="magnet-icon" 
                    src="${chrome.extension.getURL("magnet.png")}" 
                    data-toggle="tooltip" 
                    data-placement="top" title="" 
                    data-original-title="${options.tooltipText}"
                />
            </a>`
        );
    }
}