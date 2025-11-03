function updateLiveBadge() {
    const liveBadge = document.getElementById("liveBadge");
    if (!liveBadge) return;

    // تحقق كل 100ms إذا window.isLiveNow موجود
    const checkLive = setInterval(() => {
        if (typeof window.isLiveNow !== "undefined") {
            // لو true خليها inline-block، لو false خليها none
            liveBadge.style.display = window.isLiveNow ? "inline-block" : "none";
            clearInterval(checkLive);
        }
    }, 100);
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updateLiveBadge);
