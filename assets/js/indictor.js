// live-point.js
document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (liveBadge) {
    liveBadge.style.display = window.isLiveNow ? "inline-block" : "none";
  }
});
