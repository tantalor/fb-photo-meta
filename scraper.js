let firstUrl = '';

const baseDir = new Date().toISOString().replace(/[-:\.]/g, "") + "/";

function downloadImage() {
  openOptionsMenu().then(() => {
    const download = getDownloadLink();
    if (download) {
      return download.href;
    } else {
      console.log("no download link");
    }
  }).then(url => {
    if (url == firstUrl) {
      console.log("done!");
      return;
    }
    if (!firstUrl) firstUrl = url;
    const date = getTimestamp().innerText;
    const filename = baseDir + url.match("fbid=([^&]*)&")[1] + ".jpg";
    chrome.runtime.sendMessage(null, {url, date, filename});
    nextImage();
  });
}

function getTimestamp() {
  const timestamps = document.querySelectorAll('span.timestampContent');
  return timestamps[timestamps.length - 1];
}

function getDownloadLink() {
  const downloads = Array.from(document.querySelectorAll('a')).filter(
    a => a.getAttribute('data-action-type') == 'download_photo');
  return downloads[downloads.length - 1];
}

function openOptionsMenu() {
  const options = Array.from(document.querySelectorAll('span'))
    .filter(span => span.innerText == 'Options')[0];
  return new Promise(resolve => {
    if (options) {
      options.click();
      setTimeout(() => resolve(), 2000);
    }
  });
}

function nextImage() {
  const next = document.querySelector("a.next");
  if (!next || !next.getClientRects().length > 0) {
    console.log("no next link");
    return
  }
  
  next.click();
  setTimeout(downloadImage, 1000);
}

downloadImage();
