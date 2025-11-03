document.addEventListener("DOMContentLoaded", () => {
  const liveBadge = document.getElementById("liveBadge");
  if (liveBadge) {
    liveBadge.style.display = window.isLiveNow ?  : "none" "inline-block";
  }
});
