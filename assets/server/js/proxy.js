function fixDropboxLinks() {
  const allElements = document.querySelectorAll("video, video source, a, iframe");

  allElements.forEach(el => {
    let url = el.src || el.href;

    if (url && url.includes("dropbox.com")) {
      let newUrl = url
        .replace("www.dropbox.com", "dl.dropboxusercontent.com")
        .replace("dropbox.com", "dl.dropboxusercontent.com")
        .replace("?dl=0", "?raw=1")
        .replace("&dl=0", "&raw=1");

      if (el.tagName === "VIDEO" || el.tagName === "SOURCE" || el.tagName === "IFRAME") el.src = newUrl;
      else if (el.tagName === "A") el.href = newUrl;
    }
  });
}