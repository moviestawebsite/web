// live-point.js
document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return; // لو مش موجود في الصفحة، ما تعملش حاجة

  function checkLiveVideos() {
    const videos = document.querySelectorAll("video");
    let isLive = false;

    videos.forEach(video => {
      if (!video.paused && !video.ended) isLive = true;
    });

    liveBadge.style.display = isLive ? "inline-block" : "none";
  }

  // أول شي شيك الفيديوهات الموجودة
  checkLiveVideos();

  // حدث لكل فيديو موجود أو يتم إضافته لاحقًا
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
