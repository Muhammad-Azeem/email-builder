import JSZip from "jszip";

export const formatColorValue = (e) => {
    return e.color + ((e.alpha < 100 && e.alpha > 0) ? e.alpha : (e.alpha === 0) ? '00' : '');
};

export const camelToTitleCase = (str) => {
    return str
        .replace(/[0-9]{2,}/g, match => ` ${match} `)
        .replace(/[^A-Z0-9][A-Z]/g, match => `${match[0]} ${match[1]}`)
        .replace(/[A-Z][A-Z][^A-Z0-9]/g, match => `${match[0]} ${match[1]}${match[2]}`)
        .replace(/[ ]{2,}/g, match => ' ')
        .replace(/\s./g, match => match.toUpperCase())
        .replace(/^./, match => match.toUpperCase())
        .trim();
};

export const getPage = (preview) => {
    let element = document.getElementsByClassName('ant-layout-content');
    if(element.length) {
        if(preview) {
            return "<!DOCTYPE html><html><head><title>Email Builder - Softpers</title><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>body{flex-wrap: wrap;align-content: center;} .react-grid-layout{width: 600px; margin: auto;}</style></head><body>"+element[0].innerHTML+"</body></html>";
        } else {
            let htmlPage = "<!DOCTYPE html><html><head><title>Email Builder - Softpers</title><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>body{flex-wrap: wrap;align-content: center;} .react-grid-layout{width: 100%; height: 100%}</style></head><body>"+element[0].innerHTML+"</body></html>";
            let zip = new JSZip();
            zip.file("email-builder.html", htmlPage);
            zip.file("email-builder.eml", htmlPage);
            zip.file("email-builder.emltpl", htmlPage);
            zip.generateAsync({type:"base64"})
                .then(function(content) {
                    window.location.href = "data:application/zip;base64," + content;
                });
        }
    }
};