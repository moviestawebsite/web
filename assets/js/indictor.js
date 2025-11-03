document.addEventListener("DOMContentLoaded", () => {
    const liveBadge = document.getElementById("liveBadge");
    if (!liveBadge) return;

    if (typeof window.isLiveNow !== "undefined") {
        liveBadge.style.display = window.isLiveNow ? "inline-block" : "none";
    }
});
