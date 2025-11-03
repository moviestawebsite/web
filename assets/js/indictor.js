// live-point.js
document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return; // لو مش موجود في الصفحة، لا نفعل أي شيء

  function checkLiveVideos() {
    const videos = document.querySelectorAll("video");
    let isLive = false;

    videos.forEach(video => {
      // الفيديو يعتبر مباشر إذا كان شغال وغير منتهي
      if (!video.paused && !video.ended) isLive = true;
    });

    liveBadge.style.display = isLive ? "inline-block" : "none";
  }

  // شيك الفيديوهات عند التحميل
  checkLiveVideos();

  // راقب إضافة أي فيديو جديد في الصفحة
  const observer = new MutationObserver(() => {
    document.querySelectorAll("video").forEach(video => {
      if (!video.dataset.liveEventAdded) {
        video.addEventListener("play", checkLiveVideos);
        video.addEventListener("pause", checkLiveVideos);
        video.addEventListener("ended", checkLiveVideos);
        video.dataset.liveEventAdded = true; // لتجنب إضافة الحدث أكثر من مرة
      }
    });
    checkLiveVideos();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
