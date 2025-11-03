function updateLiveBadge() {
    const liveBadge = document.getElementById("liveBadge");
    if (!liveBadge) return;

    const checkLive = setInterval(() => {
        if (typeof window.isLiveNow !== "undefined") {
            liveBadge.style.display = window.isLiveNow ? "inline-block" : "none";
            clearInterval(checkLive);
        }
    }, 100);
}

document.addEventListener("DOMContentLoaded", updateLiveBadge);
