const liveBadge = document.getElementById("liveBadge");

function checkLiveVideos() {
  const videos = document.querySelectorAll("video");

  let isLive = false;
  videos.forEach(video => {
    if (!video.paused && !video.ended) {
      isLive = true;
    }
  });

  liveBadge.style.display = isLive ? "inline-block" : "none";
}
