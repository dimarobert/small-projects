import 'jquery-binarytransport';
import * as ParseTorrent from 'parse-torrent';

export class MagnetUri {
    constructor(private url: string, private anchor: JQuery<HTMLElement>) {
        anchor.find('[data-toggle="tooltip"]').tooltip();
        anchor.click(evt => {
            evt.preventDefault();
            this.clickHandler(evt);
        });
    }

    private clickHandler = (event: JQuery.Event) => {
        new Promise<Blob>((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: this.url,
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

            // swapping the handler to prevent magnet generation for the second time
            // instead it 'caches' the uri and directly delivers it. 
            this.clickHandler = () => { window.location.href = magnerUri; };
            window.location.href = magnerUri;
        });
    }
}