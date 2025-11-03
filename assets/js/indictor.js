// live-status.js (ملف صغير لكل الصفحات)
function updateLiveBadge() {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return;

  // تحقق كل 100ms إذا window.isLiveNow موجود
  const checkLive = setInterval(() => {
    if (typeof window.isLiveNow !== "undefined") {
      liveBadge.style.display = window.isLiveNow ? "inline-block" : "none";
      clearInterval(checkLive);
    }
  }, 100);
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updateLiveBadge);
