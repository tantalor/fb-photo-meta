chrome.browserAction.onClicked.addListener(tab => 
  chrome.tabs.executeScript({file: 'scraper.js'})
);

chrome.runtime.onMessage.addListener(msg => {
  const img = document.createElement('img');
  img.addEventListener('load', evt => copyImageToCanvas(evt, msg));
  img.src = msg.url;
});

function copyImageToCanvas(evt, msg) {
  const img = evt.target;
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg');
  addDateToImage(dataUrl, msg);
}

function parseDate(date) {
  const dt = new Date(date);
  if (dt.getYear() == 101 && !date.includes("2001")) {
    const currentYear = new Date().getYear() + 1900;
    return new Date(date + " " + currentYear);
  } else {
    return dt;
  }
}

function addDateToImage(dataUrl, msg) {
  const dt = parseDate(msg.date);
  const year = dt.getYear() + 1900;
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const DateTimeOriginal = `${year}:${month}:${day} 12:34:56`;
  
  const exifStr = piexif.dump({"Exif": {
    [piexif.ExifIFD.DateTimeOriginal]: DateTimeOriginal,
  }});
  
  const newDataUrl = piexif.insert(exifStr, dataUrl);
  chrome.downloads.download({url: newDataUrl, filename: msg.filename});
}
