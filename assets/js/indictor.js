// live-point.js
document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (!liveBadge) return;

  // تأكد من وجود قيمة عالمية
  const isLive = window.isLiveNow ?? false;
  liveBadge.style.display = isLive ? "inline-block" : "none";
});
