// live-point.js
document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return;

  function checkLiveVideos() {
    const videos = document.querySelectorAll("video");
    let isLive = true;

    videos.forEach(video => {
      if (!video.paused && !video.ended) isLive = true;
    });

    liveBadge.style.display = isLive ? "inline-block" : "none";
  }

  // راقب الفيديوهات الموجودة أول ما الصفحة تتحمل
  checkLiveVideos();

  // حدث لكل فيديو موجود أو جديد
  const observer = new MutationObserver(() => {
    document.querySelectorAll("video").forEach(video => {
      if (!video.dataset.liveEventAdded) {
        video.addEventListener("play", checkLiveVideos);
        video.addEventListener("pause", checkLiveVideos);
        video.addEventListener("ended", checkLiveVideos);
        video.dataset.liveEventAdded = true;
      }
    });
    checkLiveVideos();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
